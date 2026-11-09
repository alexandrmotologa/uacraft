import { AngleType, GameProfile, VideoScript } from "../../types";
import { getAngleDefinition } from "../angles";

export function generateScriptsForAngle(
  game: GameProfile,
  angle: AngleType,
  durations: Array<15 | 30> = [15, 30]
): VideoScript[] {
  const angleDef = getAngleDefinition(angle);
  const scripts: VideoScript[] = [];

  for (const duration of durations) {
    const archetype =
      duration === 15
        ? angleDef.scriptArchetypes.duration15s
        : angleDef.scriptArchetypes.duration30s;

    const logline = archetype.logline(game);
    const rawBeats = archetype.beats(game);

    // Calculate word count from voiceover lines
    const totalWords = rawBeats.reduce((sum, beat) => {
      const words = beat.voiceover.trim().split(/\s+/).filter(Boolean).length;
      return sum + words;
    }, 0);

    // Estimated WPM = (words / durationSec) * 60
    const estimatedWpm = Math.round((totalWords / duration) * 60);

    scripts.push({
      id: `${game.id}-script-${angle}-${duration}s`,
      angle,
      durationSec: duration,
      title: `${angleDef.label} - ${duration}s Ad Script`,
      logline,
      beats: rawBeats,
      totalWordCount: totalWords,
      estimatedWpm,
    });
  }

  return scripts;
}

export function generateAllScripts(
  game: GameProfile,
  angles: AngleType[],
  durations: Array<15 | 30> = [15, 30]
): VideoScript[] {
  const allScripts: VideoScript[] = [];
  for (const angle of angles) {
    allScripts.push(...generateScriptsForAngle(game, angle, durations));
  }
  return allScripts;
}
