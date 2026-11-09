import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { CreativePackage, AngleType } from "../../types";
import { performHookSwap, mutateCopySet } from "../../core/mutator/variant-mutator";
import { PRESET_PROFILES } from "./init";

export interface MutateCommandOptions {
  input: string;
  angle?: string;
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

  const targetAngle: AngleType = (options.angle as AngleType) || "challenge-fail";

  console.log(chalk.bold.cyan(`\n=== UACraft Mutation Engine ===`));
  console.log(chalk.gray(`Mutating scripts with target angle: ${targetAngle}`));

  // Perform hook swaps on each script
  const dummyProfile = PRESET_PROFILES.puzzle;
  dummyProfile.id = pkg.gameId;
  dummyProfile.title = pkg.gameTitle;

  const mutatedScripts = pkg.scripts.map((s) => {
    const swap = performHookSwap(s, dummyProfile, targetAngle);
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
