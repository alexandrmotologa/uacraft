import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { CreativePackage, AngleType, GameProfile, GameProfileSchema } from "../../types";
import { performHookSwap, mutateCopySet } from "../../core/mutator/variant-mutator";

export interface MutateCommandOptions {
  input: string;
  angle?: string;
  profile?: string;
  output?: string;
}

export async function mutateCommand(options: MutateCommandOptions): Promise<void> {
  const inputPath = path.resolve(process.cwd(), options.input);

  if (!fs.existsSync(inputPath)) {
    console.error(chalk.red(`Error: Input file not found at ${inputPath}`));
    process.exit(1);
  }

  let pkg: CreativePackage;
  try {
    pkg = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (err: any) {
    console.error(chalk.red(`Error reading package: ${err.message}`));
    process.exit(1);
  }

  // Resolve authentic game profile
  let activeProfile: GameProfile | undefined = pkg.gameProfile;

  if (options.profile) {
    const customProfilePath = path.resolve(process.cwd(), options.profile);
    if (fs.existsSync(customProfilePath)) {
      try {
        activeProfile = GameProfileSchema.parse(
          JSON.parse(fs.readFileSync(customProfilePath, "utf8"))
        );
      } catch (err: any) {
        console.error(chalk.red(`Error parsing profile: ${err.message}`));
        process.exit(1);
      }
    }
  }

  if (!activeProfile) {
    const defaultProfilePath = path.resolve(process.cwd(), "game-profile.json");
    if (fs.existsSync(defaultProfilePath)) {
      try {
        activeProfile = GameProfileSchema.parse(
          JSON.parse(fs.readFileSync(defaultProfilePath, "utf8"))
        );
      } catch {
        // continue to check fallback
      }
    }
  }

  if (!activeProfile) {
    console.error(
      chalk.red(
        "Error: Game profile not found. Please provide --profile <file> or ensure the package contains gameProfile data."
      )
    );
    process.exit(1);
  }

  const targetAngle: AngleType = (options.angle as AngleType) || "challenge-fail";

  console.log(chalk.bold.cyan(`\n=== UACraft Mutation Engine ===`));
  console.log(chalk.gray(`Mutating scripts for: ${activeProfile.title} using target angle: ${targetAngle}`));

  // Perform hook swaps using the real game profile
  const mutatedScripts = pkg.scripts.map((s) => {
    const swap = performHookSwap(s, activeProfile!, targetAngle);
    return swap.mutatedScript;
  });

  // Mutate copies
  const mutatedCopies = pkg.copies.flatMap((c) =>
    mutateCopySet(c, pkg.gameTitle)
  );

  const mutatedPackage: CreativePackage = {
    ...pkg,
    generatedAt: new Date().toISOString(),
    providerUsed: `${pkg.providerUsed}-mutated`,
    scripts: [...pkg.scripts, ...mutatedScripts],
    copies: [...pkg.copies, ...mutatedCopies],
    summary: {
      ...pkg.summary,
      totalScripts: pkg.scripts.length + mutatedScripts.length,
      totalCopies: pkg.copies.length + mutatedCopies.length,
    },
  };

  const outPath = path.resolve(
    process.cwd(),
    options.output || `./output/${pkg.gameId}_mutated_package.json`
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(mutatedPackage, null, 2) + "\n", "utf8");

  console.log(chalk.green(`\n✓ Creative mutation complete!`));
  console.log(`  Added ${chalk.cyan(mutatedScripts.length)} hook-swapped video scripts.`);
  console.log(`  Added ${chalk.cyan(mutatedCopies.length)} mutated copy variations.`);
  console.log(`  Saved to: ${chalk.yellow(outPath)}\n`);
}
