import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { CreativePackage } from "../../types";
import { exportMetaAdsCsv } from "../../core/exporters/meta-csv";
import { exportTikTokAdsCsv } from "../../core/exporters/tiktok-csv";
import { exportGoogleUacCsv } from "../../core/exporters/google-uac-csv";
import { exportAppLovinJson } from "../../core/exporters/applovin-export";
import { exportAirtableCsv, exportAirtableJson } from "../../core/exporters/airtable-export";
import { exportMarkdownBrief } from "../../core/exporters/markdown-brief";
import { exportHtmlStoryboard } from "../../core/exporters/html-preview";

export interface ExportCommandOptions {
  input: string;
  format?: string;
  output?: string;
}

export async function exportCommand(options: ExportCommandOptions): Promise<void> {
  const inputPath = path.resolve(process.cwd(), options.input);

  if (!fs.existsSync(inputPath)) {
    console.error(chalk.red(`Error: Input JSON file not found at ${inputPath}`));
    process.exit(1);
  }

  let pkg: CreativePackage;
  try {
    pkg = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (err: any) {
    console.error(chalk.red(`Error reading package: ${err.message}`));
    process.exit(1);
  }

  const format = (options.format || "all").toLowerCase();
  const baseDir = path.dirname(inputPath);
  const outPath = options.output ? path.resolve(process.cwd(), options.output) : null;

  console.log(chalk.bold.cyan(`\n=== UACraft Ad Network Exporter ===`));
  console.log(chalk.gray(`Exporting: ${pkg.gameTitle} | Format: ${format}`));

  const generatedFiles: string[] = [];

  if (format === "all" || format === "meta") {
    const metaCsv = exportMetaAdsCsv(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_meta_ads_bulk.csv`);
    fs.writeFileSync(dest, metaCsv, "utf8");
    generatedFiles.push(dest);
  }

  if (format === "all" || format === "tiktok") {
    const ttCsv = exportTikTokAdsCsv(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_tiktok_ads_bulk.csv`);
    fs.writeFileSync(dest, ttCsv, "utf8");
    generatedFiles.push(dest);
  }

  if (format === "all" || format === "google" || format === "uac") {
    const gCsv = exportGoogleUacCsv(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_google_uac_bulk.csv`);
    fs.writeFileSync(dest, gCsv, "utf8");
    generatedFiles.push(dest);
  }

  if (format === "all" || format === "applovin" || format === "unity") {
    const alJson = exportAppLovinJson(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_applovin_specs.json`);
    fs.writeFileSync(dest, alJson, "utf8");
    generatedFiles.push(dest);
  }

  if (format === "all" || format === "airtable") {
    const atCsv = exportAirtableCsv(pkg);
    const atJson = exportAirtableJson(pkg);
    const destCsv = outPath || path.join(baseDir, `${pkg.gameId}_airtable_cards.csv`);
    const destJson = outPath ? `${outPath}.json` : path.join(baseDir, `${pkg.gameId}_airtable_cards.json`);
    fs.writeFileSync(destCsv, atCsv, "utf8");
    fs.writeFileSync(destJson, atJson, "utf8");
    generatedFiles.push(destCsv, destJson);
  }

  if (format === "all" || format === "markdown" || format === "md") {
    const md = exportMarkdownBrief(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_CREATIVE_BRIEFS.md`);
    fs.writeFileSync(dest, md, "utf8");
    generatedFiles.push(dest);
  }

  if (format === "all" || format === "html") {
    const html = exportHtmlStoryboard(pkg);
    const dest = outPath || path.join(baseDir, `${pkg.gameId}_storyboard.html`);
    fs.writeFileSync(dest, html, "utf8");
    generatedFiles.push(dest);
  }

  console.log(chalk.green(`\n✓ Export complete!`));
  generatedFiles.forEach((file) => {
    console.log(`  - ${chalk.yellow(file)}`);
  });
  console.log();
}
