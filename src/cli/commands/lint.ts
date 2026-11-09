import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { CreativePackage } from "../../types";
import {
  lintCreativePackage,
  autoFixCreativePackage,
} from "../../core/validator/policy-linter";

export interface LintCommandOptions {
  package: string;
  fix?: boolean;
  output?: string;
}

export async function lintCommand(options: LintCommandOptions): Promise<void> {
  const packagePath = path.resolve(process.cwd(), options.package);

  if (!fs.existsSync(packagePath)) {
    console.error(chalk.red(`Error: Package not found at ${packagePath}`));
    process.exit(1);
  }

  let pkg: CreativePackage;
  try {
    pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  } catch (err: any) {
    console.error(chalk.red(`Error parsing JSON: ${err.message}`));
    process.exit(1);
  }

  console.log(chalk.bold.cyan(`\n=== UACraft Ad Policy & Guidelines Linter ===`));
  console.log(chalk.gray(`Auditing creative assets for: ${pkg.gameTitle}\n`));

  let report = lintCreativePackage(pkg);

  // Print findings
  report.findings.forEach((f) => {
    let tag = chalk.cyan("[INFO]");
    if (f.severity === "error") tag = chalk.red("[ERROR]");
    if (f.severity === "warning") tag = chalk.yellow("[WARNING]");

    console.log(`  ${tag} ${chalk.bold(f.rule)} on ${f.targetId} (${f.field})`);
    console.log(`    Current: "${chalk.gray(f.currentText)}"`);
    console.log(`    Issue:   ${f.reason}`);
    if (f.suggestedFix) {
      console.log(`    Fix:     "${chalk.green(f.suggestedFix)}"`);
    }
    console.log();
  });

  console.log(chalk.bold(`Audit Summary:`));
  console.log(`  * Total checks executed: ${report.totalChecks}`);
  console.log(`  * Errors: ${report.errorCount > 0 ? chalk.red(report.errorCount) : chalk.green(0)}`);
  console.log(`  * Warnings: ${report.warningCount > 0 ? chalk.yellow(report.warningCount) : chalk.green(0)}`);
  
  let scoreColor = chalk.green;
  if (report.policyScore < 60) scoreColor = chalk.red;
  else if (report.policyScore < 85) scoreColor = chalk.yellow;
  
  console.log(`  * Policy Health Score: ${scoreColor(report.policyScore + "/100")}\n`);

  if (options.fix) {
    const { fixedPackage, fixCount } = autoFixCreativePackage(pkg);
    const dest = options.output
      ? path.resolve(process.cwd(), options.output)
      : packagePath;

    fs.writeFileSync(dest, JSON.stringify(fixedPackage, null, 2) + "\n", "utf8");
    console.log(chalk.green(`✓ Applied ${fixCount} automatic policy fixes! Saved to: ${dest}\n`));
  } else if (report.findings.length > 0) {
    console.log(chalk.cyan(`Tip: Run "uacraft lint -k ${options.package} --fix" to automatically apply suggested fixes.\n`));
  }
}
