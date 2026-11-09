import { AngleType, GameProfile, VisualAssetPrompt } from "../../types";
import { getAngleDefinition } from "../angles";

function deterministicSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 899999) + 100000;
}

export function generatePromptsForAngle(
  game: GameProfile,
  angle: AngleType
): VisualAssetPrompt[] {
  const angleDef = getAngleDefinition(angle);
  const promptArchetypes = angleDef.visualAssetPrompts(game);

  return promptArchetypes.map((p, index) => {
    return {
      id: `${game.id}-prompt-${angle}-${index + 1}`,
      angle,
      assetType: p.assetType,
      prompt: p.prompt,
      negativePrompt: p.negativePrompt,
      aspectRatio: p.aspectRatio,
      parameters: {
        stylize: 250,
        model: "v6.0",
        seed: deterministicSeed(`${game.id}-${angle}-${index}`),
      },
      designNotes: p.designNotes,
    };
  });
}

export function generateAllPrompts(
  game: GameProfile,
  angles: AngleType[]
): VisualAssetPrompt[] {
  const allPrompts: VisualAssetPrompt[] = [];
  for (const angle of angles) {
    allPrompts.push(...generatePromptsForAngle(game, angle));
  }
  return allPrompts;
}
