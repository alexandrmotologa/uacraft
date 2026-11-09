import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { GameProfileSchema, CreativePackageSchema } from "../../types";

export interface ValidateCommandOptions {
  profile?: string;
  package?: string;
}

export async function validateCommand(options: ValidateCommandOptions): Promise<void> {
  console.log(chalk.bold.cyan(`\n=== UACraft Ad Specification & Policy Validator ===\n`));

  let errors = 0;
  let warnings = 0;

  if (options.profile) {
    const profilePath = path.resolve(process.cwd(), options.profile);
    if (!fs.existsSync(profilePath)) {
      console.error(chalk.red(`Error: Profile not found at ${profilePath}`));
      process.exit(1);
    }

    try {
      const data = JSON.parse(fs.readFileSync(profilePath, "utf8"));
      GameProfileSchema.parse(data);
      console.log(chalk.green(`✓ Game Profile [${path.basename(profilePath)}] conforms strictly to specification.`));
    } catch (err: any) {
      errors++;
      console.log(chalk.red(`✗ Game Profile validation failed:`));
      if (err.issues) {
        err.issues.forEach((issue: any) => {
          console.log(chalk.red(`  - ${issue.path.join(".")}: ${issue.message}`));
        });
      } else {
        console.log(chalk.red(`  - ${err.message}`));
      }
    }
  }

  if (options.package) {
    const packagePath = path.resolve(process.cwd(), options.package);
    if (!fs.existsSync(packagePath)) {
      console.error(chalk.red(`Error: Package not found at ${packagePath}`));
      process.exit(1);
    }

    try {
      const data = JSON.parse(fs.readFileSync(packagePath, "utf8"));
      const pkg = CreativePackageSchema.parse(data);
      console.log(chalk.green(`✓ Creative Package [${pkg.gameTitle}] structure is valid.`));

      // Check ad network constraints
      pkg.copies.forEach((copy, idx) => {
        if (copy.headline.length > 40) {
          warnings++;
          console.log(
            chalk.yellow(
              `  ! Warning: Copy #${idx + 1} (${copy.angle}) headline length ${copy.headline.length} > 40 chars (may truncate on mobile).`
            )
          );
        }
        if (copy.primaryTextShort.length > 125) {
          warnings++;
          console.log(
            chalk.yellow(
              `  ! Warning: Copy #${idx + 1} (${copy.angle}) primary text length ${copy.primaryTextShort.length} > 125 chars (may truncate before CTA).`
            )
          );
        }
      });

      // Check script pacing
      pkg.scripts.forEach((script) => {
        if (script.estimatedWpm > 175) {
          warnings++;
          console.log(
            chalk.yellow(
              `  ! Warning: Script "${script.title}" has ${script.estimatedWpm} WPM. Voiceover may sound rushed (>175 WPM).`
            )
          );
        }
      });
    } catch (err: any) {
      errors++;
      console.log(chalk.red(`✗ Creative Package validation failed:`));
      if (err.issues) {
        err.issues.forEach((issue: any) => {
          console.log(chalk.red(`  - ${issue.path.join(".")}: ${issue.message}`));
        });
      } else {
        console.log(chalk.red(`  - ${err.message}`));
      }
    }
  }

  if (!options.profile && !options.package) {
    console.log(chalk.yellow("Please provide --profile <file> or --package <file> to validate."));
    console.log(chalk.gray("Example: uacraft validate --profile game-profile.json"));
  } else {
    console.log();
    if (errors === 0) {
      console.log(
        chalk.green(
          `Validation finished successfully with 0 errors and ${warnings} warnings.\n`
        )
      );
    } else {
      console.log(
        chalk.red(`Validation finished with ${errors} errors and ${warnings} warnings.\n`)
      );
      process.exit(1);
    }
  }
}
