import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { analyzeCreativeFatigue } from "../../core/analytics/fatigue-analyzer";
import { AngleType } from "../../types";

export interface AnalyzeCommandOptions {
  metrics: string;
  minThumbstop?: string;
  minCtr?: string;
  maxCpi?: string;
  fatigueDays?: string;
  output?: string;
}

export async function analyzeCommand(options: AnalyzeCommandOptions): Promise<void> {
  const metricsPath = path.resolve(process.cwd(), options.metrics);

  if (!fs.existsSync(metricsPath)) {
    console.error(chalk.red(`Error: Metrics file not found at ${metricsPath}`));
    process.exit(1);
  }

  let rawRecords: any[];
  try {
    rawRecords = JSON.parse(fs.readFileSync(metricsPath, "utf8"));
    if (!Array.isArray(rawRecords)) {
      throw new Error("Expected an array of performance metric records");
    }
  } catch (err: any) {
    console.error(chalk.red(`Error parsing metrics JSON: ${err.message}`));
    process.exit(1);
  }

  const result = analyzeCreativeFatigue(rawRecords, {
    minThumbstopRate: options.minThumbstop ? parseFloat(options.minThumbstop) : undefined,
    minCtr: options.minCtr ? parseFloat(options.minCtr) : undefined,
    maxCpi: options.maxCpi ? parseFloat(options.maxCpi) : undefined,
    fatigueDaysThreshold: options.fatigueDays ? parseFloat(options.fatigueDays) : undefined,
  });

  console.log(chalk.bold.cyan(`\n=== UACraft Creative Fatigue Diagnosis ===`));
  console.log(chalk.gray(`Analyzed ${result.totalAdsAnalyzed} active ad creatives across $${result.totalSpend} total spend\n`));

  console.log(chalk.bold(`Angle Health Breakdown:`));

  const angles = Object.keys(result.angleBreakdown) as AngleType[];
  angles.forEach((angle) => {
    const status = result.angleBreakdown[angle];
    let badge = chalk.green("[HEALTHY]");
    if (status.status === "fatigued") badge = chalk.red("[FATIGUED]");
    if (status.status === "warning") badge = chalk.yellow("[WARNING]");
    if (status.status === "fresh") badge = chalk.cyan("[UNTESTED]");

    console.log(`\n  ${badge} ${chalk.bold(status.label)} (${status.angle})`);
    console.log(`    Ads: ${status.adCount} | Spend: $${status.totalSpend} | Avg CTR: ${status.averageCtr}% | 3s Hook: ${status.averageHookRate}% | Avg CPI: $${status.averageCpi}`);
    console.log(`    Fatigue Score: ${status.fatigueScore}/100 | Status: ${status.reason}`);
  });

  console.log(chalk.bold(`\nActionable Recommendations:`));
  result.actionItems.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${chalk.white(item)}`);
  });

  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n", "utf8");
    console.log(chalk.green(`\n✓ Full diagnostic report saved to: ${chalk.yellow(outPath)}`));
  }
  console.log();
}
