import { AdHook, AngleType, GameProfile } from "../../types";
import { getAngleDefinition } from "../angles";

export interface HookGeneratorOptions {
  countPerAngle?: number;
}

export function generateHooksForAngle(
  game: GameProfile,
  angle: AngleType,
  count: number = 2
): AdHook[] {
  const angleDef = getAngleDefinition(angle);
  const actions = angleDef.hookActions(game);
  const overlays = angleDef.textOverlays(game);
  const audios = angleDef.audioDirections(game);
  const headlines = angleDef.headlineFormulas(game);

  const hooks: AdHook[] = [];

  for (let i = 0; i < count; i++) {
    const action = actions[i % actions.length];
    const textOverlay = overlays[i % overlays.length];
    const audio = audios[i % audios.length];
    const headline = headlines[i % headlines.length];

    // Compute realistic thumbstop score estimate based on hook attributes
    const baseScore = 78;
    const lengthPenalty = textOverlay.length > 35 ? -3 : 4;
    const urgencyBonus = textOverlay.includes("!") || textOverlay.includes("?") ? 6 : 2;
    const score = Math.min(98, Math.max(65, baseScore + lengthPenalty + urgencyBonus + ((i * 3) % 7)));

    hooks.push({
      id: `${game.id}-hook-${angle}-${i + 1}`,
      angle,
      headline,
      visualAction: action,
      textOverlay,
      audioDirection: audio,
      psychologyBreakdown: angleDef.driver,
      thumbstopScoreEstimate: score,
    });
  }

  return hooks;
}

export function generateAllHooks(
  game: GameProfile,
  angles: AngleType[],
  countPerAngle: number = 2
): AdHook[] {
  const allHooks: AdHook[] = [];
  for (const angle of angles) {
    allHooks.push(...generateHooksForAngle(game, angle, countPerAngle));
  }
  return allHooks;
}
