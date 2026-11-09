import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { CreativePackage } from "../../types";
import {
  generateCombinatorialMatrix,
  exportMatrixCsv,
} from "../../core/mutator/matrix-generator";

export interface MatrixCommandOptions {
  input: string;
  output?: string;
  maxPerAngle?: string;
  ratio?: "9:16" | "1:1";
}

export async function matrixCommand(options: MatrixCommandOptions): Promise<void> {
  const inputPath = path.resolve(process.cwd(), options.input);

  if (!fs.existsSync(inputPath)) {
    console.error(chalk.red(`Error: Input package file not found at ${inputPath}`));
    process.exit(1);
  }

  let pkg: CreativePackage;
  try {
    pkg = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (err: any) {
    console.error(chalk.red(`Error reading package: ${err.message}`));
    process.exit(1);
  }

  const maxPerAngle = options.maxPerAngle ? parseInt(options.maxPerAngle, 10) : 12;
  const ratio = options.ratio || "9:16";

  console.log(chalk.bold.cyan(`\n=== UACraft A/B Combinatorial Matrix Engine ===`));
  console.log(chalk.gray(`Generating testing matrix for ${pkg.gameTitle} (${ratio})\n`));

  const matrix = generateCombinatorialMatrix(pkg, { maxPerAngle, aspectRatio: ratio });
  const csv = exportMatrixCsv(matrix);

  const baseDir = path.dirname(inputPath);
  const outPath = options.output
    ? path.resolve(process.cwd(), options.output)
    : path.join(baseDir, `${pkg.gameId}_ab_matrix.csv`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, csv, "utf8");

  console.log(chalk.green(`✓ Generated ${chalk.bold(matrix.length)} discrete testable creative variants!`));
  console.log(chalk.gray(`Sample Taxonomy Ad Names:`));
  matrix.slice(0, 4).forEach((m) => {
    console.log(`  • ${chalk.yellow(m.taxonomyName)} (${m.angle})`);
  });
  if (matrix.length > 4) {
    console.log(chalk.gray(`  ... and ${matrix.length - 4} more variants`));
  }

  console.log(chalk.green(`\n✓ Batch-rendering sheet saved to: ${chalk.yellow(outPath)}\n`));
}
