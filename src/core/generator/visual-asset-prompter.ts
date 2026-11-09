import { AngleType, GameProfile, VisualAssetPrompt } from "../../types";
import { getAngleDefinition } from "../angles";

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
        seed: Math.floor(100000 + Math.random() * 900000),
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
