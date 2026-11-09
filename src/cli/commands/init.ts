import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import { GameProfile } from "../../types";

export const PRESET_PROFILES: Record<string, GameProfile> = {
  puzzle: {
    id: "puzzle-pins",
    title: "Pin Rescue & Treasure",
    genre: "puzzle",
    subgenre: "pin-puller",
    theme: "ancient ruins and lava vaults",
    visualStyle: "3D stylized cartoon with warm lighting",
    targetAudience: {
      demographics: "Broad casual, 25-54, male and female",
      playerMotivations: ["problem-solving", "relaxation", "clever logic expression"],
    },
    coreMechanics: [
      "pull pins in strategic order",
      "redirect lava away from treasure",
      "pour water over magma to create safe stone",
    ],
    failStates: [
      "lava touches hero",
      "lava burns the treasure chest",
      "running out of moves before unlocking vault",
    ],
    satisfyingMoments: [
      "water splashing into lava creating a solid stone walkway",
      "massive cascade of golden coins pouring into chest",
      "celebratory victory fanfare with dancing mascot",
    ],
    uniqueSellingPoints: [
      "over 500 hand-crafted physics puzzles",
      "fluid lava and water physics simulation",
      "zero forced ads between stages",
    ],
    historicalData: {
      winningHooks: ["Why did he pull the red pin first?!", "Don't let them burn!"],
      fatiguedAngles: ["story-drama"],
      topCtrHeadlines: ["Only 1% Can Solve Level 12", "Oddly Satisfying Pin Pull"],
      targetNetworks: ["meta", "tiktok", "google"],
      historicalCpiAverage: 1.85,
      historicalCtrAverage: 2.4,
    },
  },
  runner: {
    id: "runner-merge-rush",
    title: "Merge Rush 3D",
    genre: "hypercasual",
    subgenre: "gate runner",
    theme: "neon futuristic velocity highway",
    visualStyle: "bright high-saturation low poly 3D",
    targetAudience: {
      demographics: "Youth to casual adults, 16-35, fast reflex seekers",
      playerMotivations: ["adrenaline", "rapid progression", "visual spectacle"],
    },
    coreMechanics: [
      "swipe to steer army through multiplier gates (+5, x2)",
      "dodge circular saw hazard obstacles",
      "overwhelm final castle boss with massive troop count",
    ],
    failStates: [
      "hitting saw blade reducing troop count to zero",
      "entering red negative divider gate (-20)",
      "insufficient troops to defeat final boss",
    ],
    satisfyingMoments: [
      "passing through x5 gate and multiplying into 200 glowing units",
      "giant boss toppling in slow-motion explosion",
      "frenzy coin shower at finish line",
    ],
    uniqueSellingPoints: [
      "smooth 60fps horde physics",
      "unlimited weapon upgrades and skins",
      "instant restart with zero loading screens",
    ],
    historicalData: {
      winningHooks: ["Noob vs Pro Gate Strategy", "Watch the troop counter explode!"],
      fatiguedAngles: ["challenge-fail"],
      topCtrHeadlines: ["Can You Reach 500 Troops?", "Oddly Satisfying Crowd Multiplier"],
      targetNetworks: ["tiktok", "meta"],
      historicalCpiAverage: 0.95,
      historicalCtrAverage: 3.1,
    },
  },
};

export async function initCommand(
  targetFile?: string,
  options: { preset?: string; force?: boolean } = {}
): Promise<void> {
  const filePath = path.resolve(process.cwd(), targetFile || "game-profile.json");

  if (fs.existsSync(filePath) && !options.force) {
    console.error(
      chalk.red(`Error: File already exists at ${filePath}. Use --force to overwrite.`)
    );
    process.exit(1);
  }

  const presetKey = options.preset?.toLowerCase() || "puzzle";
  const profile = PRESET_PROFILES[presetKey] || PRESET_PROFILES.puzzle;

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(profile, null, 2) + "\n", "utf8");

  console.log(chalk.green(`✓ Initialized new game profile at:`));
  console.log(chalk.cyan(`  ${filePath}`));
  console.log(chalk.gray(`  Preset used: ${presetKey} (${profile.title})`));
  console.log();
  console.log(chalk.white(`Next steps:`));
  console.log(chalk.yellow(`  npx uacraft generate --game-profile ${path.basename(filePath)}`));
}
