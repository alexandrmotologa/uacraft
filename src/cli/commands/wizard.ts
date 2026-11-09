import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import chalk from "chalk";
import { GameProfile, GameProfileSchema } from "../../types";
import { generateCommand } from "./generate";

function askQuestion(rl: readline.Interface, query: string, defaultVal: string): Promise<string> {
  return new Promise((resolve) => {
    const prompt = defaultVal ? `${query} ${chalk.gray(`[${defaultVal}]`)}: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

export async function wizardCommand(): Promise<void> {
  console.log(chalk.bold.cyan(`\n=== UACraft Interactive Creative Setup Wizard ===`));
  console.log(chalk.gray(`Answer 8 quick questions to scaffold your game profile and generate your creative package.\n`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const title = await askQuestion(rl, "1. Game Title", "Magic Merge Garden");
    const genre = await askQuestion(rl, "2. Genre", "puzzle");
    const theme = await askQuestion(rl, "3. Theme / Setting", "cozy enchanted garden");
    const visualStyle = await askQuestion(rl, "4. Visual Style", "3D stylized cartoon with soft lighting");
    const mechanic = await askQuestion(rl, "5. Core Mechanic (e.g. merge items, pull pins)", "drag and merge identical flowers");
    const failState = await askQuestion(rl, "6. Key Fail State (e.g. running out of space)", "board overfills with weeds");
    const satisfyingMoment = await askQuestion(rl, "7. Most Satisfying Moment", "giant golden blossom blooming with sparkle burst");
    const usp = await askQuestion(rl, "8. Unique Selling Point (USP)", "1000 relaxing levels with zero stress");

    const gameId = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const profile: GameProfile = {
      id: gameId || "custom-game",
      title,
      genre,
      theme,
      visualStyle,
      targetAudience: {
        playerMotivations: ["relaxation", "progression"],
      },
      coreMechanics: [mechanic],
      failStates: [failState],
      satisfyingMoments: [satisfyingMoment],
      uniqueSellingPoints: [usp],
    };

    GameProfileSchema.parse(profile);

    const outPath = path.resolve(process.cwd(), `${profile.id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(profile, null, 2) + "\n", "utf8");

    console.log(chalk.green(`\n✓ Game profile created and validated successfully at:`));
    console.log(chalk.yellow(`  ${outPath}`));

    const runGen = await askQuestion(rl, "\nGenerate ad creative package now? (Y/n)", "Y");
    rl.close();

    if (runGen.toLowerCase() === "y" || runGen.toLowerCase() === "yes") {
      await generateCommand({
        gameProfile: outPath,
        outputDir: `./output/${profile.id}`,
        offline: true,
      });
    } else {
      console.log(chalk.gray(`\nYou can generate creatives anytime with:`));
      console.log(chalk.cyan(`  uacraft generate --game-profile ${path.basename(outPath)}\n`));
    }
  } catch (err: any) {
    rl.close();
    console.error(chalk.red(`\nWizard error: ${err.message}`));
    process.exit(1);
  }
}
