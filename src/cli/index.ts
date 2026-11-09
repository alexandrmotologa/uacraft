import { Command } from "commander";
import { initCommand } from "./commands/init";
import { generateCommand } from "./commands/generate";
import { mutateCommand } from "./commands/mutate";
import { exportCommand } from "./commands/export";
import { analyzeCommand } from "./commands/analyze";
import { previewCommand } from "./commands/preview";
import { validateCommand } from "./commands/validate";

export function createCli(): Command {
  const program = new Command();

  program
    .name("uacraft")
    .description(
      "Multi-angle ad creative, video hook, and copy mutation engine for mobile user acquisition teams."
    )
    .version("1.0.0");

  program
    .command("init [file]")
    .description("Scaffold a new game profile JSON template")
    .option("-p, --preset <type>", "Preset template (puzzle, runner)", "puzzle")
    .option("-f, --force", "Overwrite existing file", false)
    .action(async (file, options) => {
      await initCommand(file, options);
    });

  program
    .command("generate")
    .description("Generate multi-angle ad hooks, copy variations, scripts, and prompt recipes")
    .option("-p, --game-profile <file>", "Path to game profile JSON", "game-profile.json")
    .option(
      "-a, --angles <list>",
      "Comma-separated angles (asmr-satisfying,challenge-fail,curiosity-gap,story-drama,competitive-flex)"
    )
    .option("-c, --count <num>", "Number of hooks/copies per angle", "2")
    .option("-d, --durations <list>", "Durations in seconds (e.g. 15,30)", "15,30")
    .option("-o, --output-dir <dir>", "Output directory for generated assets", "./output")
    .option(
      "-f, --formats <list>",
      "Export formats: all, meta, tiktok, airtable, markdown, html",
      "all"
    )
    .option("--offline", "Force offline rule-based heuristic engine without LLM", false)
    .option("--provider <name>", "LLM provider: gemini, openai, anthropic, custom")
    .option("--api-key <key>", "LLM API key")
    .option("--base-url <url>", "Custom OpenAI-compatible base URL")
    .option("--model <name>", "Model name override")
    .action(async (options) => {
      await generateCommand(options);
    });

  program
    .command("mutate")
    .description("Perform hook swaps and copy variations on existing creatives")
    .requiredOption("-i, --input <file>", "Input creative package JSON")
    .option("-a, --angle <angle>", "Target swap angle (challenge-fail, asmr-satisfying, etc.)")
    .option("-o, --output <file>", "Output file path")
    .action(async (options) => {
      await mutateCommand(options);
    });

  program
    .command("export")
    .description("Export creative package to Meta CSV, TikTok CSV, Airtable, Markdown or HTML")
    .requiredOption("-i, --input <file>", "Path to creative package JSON file")
    .option(
      "-f, --format <format>",
      "Target export format: meta, tiktok, airtable, markdown, html, all",
      "all"
    )
    .option("-o, --output <file>", "Target destination output path")
    .action(async (options) => {
      await exportCommand(options);
    });

  program
    .command("analyze")
    .description("Diagnose creative fatigue and generate angle rotation recommendations")
    .requiredOption("-m, --metrics <file>", "Path to ad performance metrics JSON file")
    .option("--min-thumbstop <number>", "Minimum acceptable 3s thumbstop rate %", "24")
    .option("--min-ctr <number>", "Minimum acceptable CTR %", "1.8")
    .option("--max-cpi <number>", "Maximum allowable CPI in dollars", "2.8")
    .option("--fatigue-days <number>", "Creative age threshold for fatigue warning", "12")
    .option("-o, --output <file>", "Output path for diagnostic report JSON")
    .action(async (options) => {
      await analyzeCommand(options);
    });

  program
    .command("preview")
    .description("Launch or serve interactive HTML storyboard in browser")
    .requiredOption("-i, --input <file>", "Path to creative package JSON or HTML storyboard")
    .option("-p, --port <number>", "Local port for storyboard server", "3456")
    .option("--no-open", "Do not open browser automatically")
    .action(async (options) => {
      await previewCommand(options);
    });

  program
    .command("validate")
    .description("Validate game profile or creative package against schema and ad limits")
    .option("-p, --profile <file>", "Path to game profile JSON to validate")
    .option("-k, --package <file>", "Path to creative package JSON to validate")
    .action(async (options) => {
      await validateCommand({
        profile: options.profile,
        package: options.package,
      });
    });

  return program;
}
