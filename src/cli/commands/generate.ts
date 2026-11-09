import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { AngleType } from "../../types";
import { generateCreativePackage } from "../../core/engine";
import { exportMetaAdsCsv } from "../../core/exporters/meta-csv";
import { exportTikTokAdsCsv } from "../../core/exporters/tiktok-csv";
import { exportAirtableCsv, exportAirtableJson } from "../../core/exporters/airtable-export";
import { exportMarkdownBrief } from "../../core/exporters/markdown-brief";
import { exportHtmlStoryboard } from "../../core/exporters/html-preview";

export interface GenerateCommandOptions {
  gameProfile?: string;
  angles?: string;
  count?: string;
  durations?: string;
  outputDir?: string;
  formats?: string;
  offline?: boolean;
  provider?: "gemini" | "openai" | "anthropic" | "custom";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export async function generateCommand(options: GenerateCommandOptions): Promise<void> {
  const profilePath = path.resolve(
    process.cwd(),
    options.gameProfile || "game-profile.json"
  );

  if (!fs.existsSync(profilePath)) {
    console.error(
      chalk.red(`Error: Game profile file not found at ${profilePath}`)
    );
    console.log(
      chalk.yellow(`Tip: Run "uacraft init" to generate a sample game profile first.`)
    );
    process.exit(1);
  }

  let rawData: any;
  try {
    rawData = JSON.parse(fs.readFileSync(profilePath, "utf8"));
  } catch (err: any) {
    console.error(chalk.red(`Error parsing JSON in ${profilePath}: ${err.message}`));
    process.exit(1);
  }

  // Parse angles
  let angles: AngleType[] | undefined;
  if (options.angles) {
    angles = options.angles
      .split(",")
      .map((a) => a.trim()) as AngleType[];
  }

  // Parse durations
  let durations: Array<15 | 30> = [15, 30];
  if (options.durations) {
    durations = options.durations
      .split(",")
      .map((d) => Number(d.trim()))
      .filter((n) => n === 15 || n === 30) as Array<15 | 30>;
  }

  const countPerAngle = options.count ? parseInt(options.count, 10) : 2;
  const outDir = path.resolve(process.cwd(), options.outputDir || "./output");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(chalk.bold.cyan(`\n=== UACraft Ad Creative Mutation Engine ===`));
  console.log(chalk.gray(`Ingesting game profile: ${rawData.title || "Game"} (${profilePath})`));
  console.log(chalk.gray(`Execution mode: ${options.offline ? "Offline (Heuristic)" : "Automatic (LLM / Fallback)"}`));

  const startTime = Date.now();

  try {
    const pkg = await generateCreativePackage(rawData, {
      angles,
      countPerAngle,
      durations,
      offline: options.offline,
      provider: options.provider,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      model: options.model,
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Save master JSON package
    const jsonPath = path.join(outDir, `${pkg.gameId}_creative_package.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

    // Formats
    const requestedFormats = (options.formats || "all")
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());
    const isAll = requestedFormats.includes("all");

    const createdFiles: string[] = [jsonPath];

    if (isAll || requestedFormats.includes("meta")) {
      const metaCsv = exportMetaAdsCsv(pkg);
      const metaPath = path.join(outDir, `${pkg.gameId}_meta_ads_bulk.csv`);
      fs.writeFileSync(metaPath, metaCsv, "utf8");
      createdFiles.push(metaPath);
    }

    if (isAll || requestedFormats.includes("tiktok")) {
      const ttCsv = exportTikTokAdsCsv(pkg);
      const ttPath = path.join(outDir, `${pkg.gameId}_tiktok_ads_bulk.csv`);
      fs.writeFileSync(ttPath, ttCsv, "utf8");
      createdFiles.push(ttPath);
    }

    if (isAll || requestedFormats.includes("airtable")) {
      const atCsv = exportAirtableCsv(pkg);
      const atJson = exportAirtableJson(pkg);
      const atCsvPath = path.join(outDir, `${pkg.gameId}_airtable_cards.csv`);
      const atJsonPath = path.join(outDir, `${pkg.gameId}_airtable_cards.json`);
      fs.writeFileSync(atCsvPath, atCsv, "utf8");
      fs.writeFileSync(atJsonPath, atJson, "utf8");
      createdFiles.push(atCsvPath, atJsonPath);
    }

    if (isAll || requestedFormats.includes("markdown") || requestedFormats.includes("md")) {
      const md = exportMarkdownBrief(pkg);
      const mdPath = path.join(outDir, `${pkg.gameId}_CREATIVE_BRIEFS.md`);
      fs.writeFileSync(mdPath, md, "utf8");
      createdFiles.push(mdPath);
    }

    if (isAll || requestedFormats.includes("html")) {
      const html = exportHtmlStoryboard(pkg);
      const htmlPath = path.join(outDir, `${pkg.gameId}_storyboard.html`);
      fs.writeFileSync(htmlPath, html, "utf8");
      createdFiles.push(htmlPath);
    }

    console.log(chalk.green(`\n✓ Creative generation complete in ${elapsed}s!`));
    console.log(chalk.white(`Engine version: ${pkg.engineVersion} | Engine: ${pkg.providerUsed}`));
    console.log();
    console.log(chalk.bold(`Generated Assets Summary:`));
    console.log(`  * ${chalk.cyan(pkg.summary.totalHooks)} Opening 3-Second Hooks`);
    console.log(`  * ${chalk.cyan(pkg.summary.totalCopies)} Short/Long Ad Copy Variations`);
    console.log(`  * ${chalk.cyan(pkg.summary.totalScripts)} Timed Video Scripts (15s & 30s)`);
    console.log(`  * ${chalk.cyan(pkg.summary.totalPrompts)} Midjourney / Flux Prompts`);
    console.log(`  * ${chalk.cyan(pkg.summary.estimatedTestingDurationDays + " days")} Estimated UA Testing Cycle`);
    console.log();
    console.log(chalk.bold(`Exported Files:`));
    createdFiles.forEach((file) => {
      console.log(`  - ${chalk.yellow(file)}`);
    });
    console.log();
  } catch (err: any) {
    console.error(chalk.red(`\nGeneration failed: ${err.message}`));
    if (err.issues) {
      console.error(chalk.red(JSON.stringify(err.issues, null, 2)));
    }
    process.exit(1);
  }
}
