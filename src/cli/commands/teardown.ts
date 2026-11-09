import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { GameProfileSchema } from "../../types";
import { teardownCompetitorAd } from "../../core/mutator/competitor-teardown";

export interface TeardownCommandOptions {
  adText: string;
  profile?: string;
  output?: string;
}

export async function teardownCommand(options: TeardownCommandOptions): Promise<void> {
  const profilePath = path.resolve(
    process.cwd(),
    options.profile || "game-profile.json"
  );

  let gameProfile: any;
  if (fs.existsSync(profilePath)) {
    try {
      gameProfile = GameProfileSchema.parse(
        JSON.parse(fs.readFileSync(profilePath, "utf8"))
      );
    } catch (err: any) {
      console.error(chalk.red(`Error parsing game profile at ${profilePath}: ${err.message}`));
      process.exit(1);
    }
  } else {
    // Check if sample exists in examples/
    const samplePath = path.resolve(__dirname, "../../../examples/puzzle-pin-pull.json");
    if (fs.existsSync(samplePath)) {
      try {
        gameProfile = GameProfileSchema.parse(
          JSON.parse(fs.readFileSync(samplePath, "utf8"))
        );
      } catch {
        // proceed
      }
    }
  }

  if (!gameProfile) {
    console.error(
      chalk.red(
        "Error: Game profile not found. Please provide --profile <file> or run 'uacraft init' first."
      )
    );
    process.exit(1);
  }

  console.log(chalk.bold.cyan(`\n=== UACraft Competitor Ad Teardown & Counter-Strategy ===`));
  console.log(chalk.gray(`Analyzing competitor ad input for counter-positioning ${gameProfile.title}...\n`));

  const teardown = teardownCompetitorAd(options.adText, gameProfile);

  console.log(chalk.bold(`Competitor Diagnosis:`));
  console.log(`  * Detected Strategy: ${chalk.yellow(teardown.detectedAngle)}`);
  console.log(`  * Core Mechanism:    ${teardown.primaryMechanism}`);
  console.log(`  * Hook Tactics:      ${teardown.hookTactics.join(", ")}`);
  console.log();

  console.log(chalk.bold(`Fatigue Vulnerabilities Identified:`));
  teardown.fatigueVulnerabilities.forEach((v, idx) => {
    console.log(`  ${idx + 1}. ${chalk.white(v)}`);
  });
  console.log();

  console.log(chalk.bold.green(`High-Impact Counter-Angle Strategies:`));
  teardown.counterAngleStrategies.forEach((strat, idx) => {
    console.log(`\n  ${chalk.cyan(`[Strategy ${idx + 1}]`)} ${chalk.bold(strat.strategyTitle)} (${strat.targetAngle})`);
    console.log(`    Rationale:    ${strat.rationale}`);
    console.log(`    Headline:     "${chalk.bold(strat.counterHook.headline)}"`);
    console.log(`    Visual Scene: ${strat.counterHook.visualAction}`);
    console.log(`    On-Screen:    "${chalk.yellow(strat.counterHook.textOverlay)}"`);
    console.log(`    Audio SFX:    ${strat.counterHook.audioDirection}`);
    console.log(`    Thumbstop:    ${chalk.green(strat.counterHook.thumbstopScoreEstimate + "/100")}`);
  });

  if (options.output) {
    const outPath = path.resolve(process.cwd(), options.output);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(teardown, null, 2) + "\n", "utf8");
    console.log(chalk.green(`\n✓ Counter-strategy brief saved to: ${chalk.yellow(outPath)}`));
  }
  console.log();
}
