import chalk from "chalk";
import { calculateBudgetPlan } from "../../core/analytics/budget-planner";

export interface PlanCommandOptions {
  budget: string;
  cpi: string;
  platform?: "meta" | "tiktok" | "google";
}

export async function planCommand(options: PlanCommandOptions): Promise<void> {
  const budget = parseFloat(options.budget);
  const cpi = parseFloat(options.cpi);

  if (isNaN(budget) || budget <= 0) {
    console.error(chalk.red("Error: Invalid weekly budget amount. Example: --budget 2500"));
    process.exit(1);
  }

  if (isNaN(cpi) || cpi <= 0) {
    console.error(chalk.red("Error: Invalid target CPI amount. Example: --cpi 1.75"));
    process.exit(1);
  }

  const result = calculateBudgetPlan({
    weeklyBudget: budget,
    targetCpi: cpi,
    platform: options.platform || "meta",
  });

  console.log(chalk.bold.cyan(`\n=== UACraft Media Buying & Testing Budget Planner ===`));
  console.log(
    chalk.gray(
      `Weekly Budget: $${result.weeklyBudget} ($${result.dailyBudget}/day) | Target CPI: $${result.targetCpi} | Platform: ${result.platform}\n`
    )
  );

  if (result.warnings.length > 0) {
    result.warnings.forEach((w) => {
      console.log(chalk.red(`[CRITICAL WARNING] ${w}`));
    });
    console.log();
  }

  console.log(chalk.bold(`Campaign Mathematical Bounds:`));
  console.log(`  * Total Estimated Installs / Week: ${chalk.green(result.totalEstimatedInstallsWeekly)}`);
  console.log(`  * Max Parallel Ad Sets (To Exit Learning Phase): ${chalk.yellow(result.maxParallelAdSets)}`);
  console.log(`  * Max Parallel Creative Variations: ${chalk.yellow(result.maxVariantsInParallel)}`);
  console.log(`  * Recommended Daily Budget / Ad Set: ${chalk.cyan("$" + result.recommendedDailyBudgetPerAdSet)}`);
  console.log(`  * Minimum Test Run Duration for Significance: ${chalk.cyan(result.minTestingDaysForConfidence + " days")}`);
  console.log();

  console.log(chalk.bold(`Recommended 70/30 Angle Budget Allocation:`));
  result.angleAllocations.forEach((a) => {
    const roleTag = a.role === "scale_winner" ? chalk.green("[PROVEN 70%]") : chalk.yellow("[EXPLORE 30%]");
    console.log(`  ${roleTag} ${chalk.bold(a.label)} (${a.sharePercentage}%)`);
    console.log(`    Budget: $${a.weeklyBudget}/wk ($${a.dailyBudget}/day) -> ~${a.estimatedInstallsWeekly} installs`);
  });
  console.log();

  console.log(chalk.bold(`UA Strategic Guidelines:`));
  result.strategicAdvice.forEach((adv, idx) => {
    console.log(`  ${idx + 1}. ${chalk.white(adv)}`);
  });
  console.log();
}
