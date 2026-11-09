import {
  AdCopyVariation,
  AdHook,
  AngleType,
  GameProfile,
  VideoScript,
  VideoScriptBeat,
} from "../../types";
import { getAngleDefinition } from "../angles";
import { generateHooksForAngle } from "../generator/hook-generator";

export interface MutatedHookVariant {
  baseScriptId: string;
  newAngle: AngleType;
  swappedHook: AdHook;
  mutatedScript: VideoScript;
}

export function performHookSwap(
  baseScript: VideoScript,
  game: GameProfile,
  targetAngle: AngleType
): MutatedHookVariant {
  const newHooks = generateHooksForAngle(game, targetAngle, 1);
  const swappedHook = newHooks[0];

  const targetAngleDef = getAngleDefinition(targetAngle);

  // Replace beat 0 (0-3s hook) with new angle's hook
  const updatedBeats: VideoScriptBeat[] = [
    {
      timestamp: "00:00 - 00:03",
      durationSec: 3,
      segment: "hook",
      visualScene: swappedHook.visualAction,
      textOverlay: swappedHook.textOverlay,
      voiceover: targetAngleDef.scriptArchetypes.duration15s.beats(game)[0].voiceover,
      audioSFX: swappedHook.audioDirection,
    },
    ...baseScript.beats.slice(1),
  ];

  const totalWords = updatedBeats.reduce((sum, beat) => {
    return sum + beat.voiceover.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  const mutatedScript: VideoScript = {
    ...baseScript,
    id: `${baseScript.id}-mutated-${targetAngle}`,
    angle: targetAngle,
    title: `${baseScript.title} (Hook Swap: ${targetAngleDef.label})`,
    logline: `Mutated variant of ${baseScript.title} using ${targetAngleDef.label} 0-3s hook.`,
    beats: updatedBeats,
    totalWordCount: totalWords,
    estimatedWpm: Math.round((totalWords / baseScript.durationSec) * 60),
  };

  return {
    baseScriptId: baseScript.id,
    newAngle: targetAngle,
    swappedHook,
    mutatedScript,
  };
}

export interface HeadlineMutationSet {
  originalHeadline: string;
  variations: {
    questionChallenge: string;
    curiosityMystery: string;
    socialProof: string;
    directImperative: string;
  };
}

export function mutateHeadline(headline: string, gameTitle: string): HeadlineMutationSet {
  const cleanTitle = gameTitle.trim();
  return {
    originalHeadline: headline,
    variations: {
      questionChallenge: `Can you actually solve ${cleanTitle}?`,
      curiosityMystery: `The hidden mechanic in ${cleanTitle}`,
      socialProof: `Why 500,000+ players love ${cleanTitle}`,
      directImperative: `Stop scrolling and try ${cleanTitle}`,
    },
  };
}

export function mutateCopySet(
  baseCopy: AdCopyVariation,
  gameTitle: string
): AdCopyVariation[] {
  const mutations = mutateHeadline(baseCopy.headline, gameTitle);
  const variants: AdCopyVariation[] = [];

  const types: Array<{
    suffix: string;
    headline: string;
    cta: string;
  }> = [
    {
      suffix: "challenge",
      headline: mutations.variations.questionChallenge,
      cta: "Play Game",
    },
    {
      suffix: "curiosity",
      headline: mutations.variations.curiosityMystery,
      cta: "Discover Free",
    },
    {
      suffix: "social",
      headline: mutations.variations.socialProof,
      cta: "Join Millions",
    },
    {
      suffix: "direct",
      headline: mutations.variations.directImperative,
      cta: "Install Now",
    },
  ];

  for (const t of types) {
    variants.push({
      ...baseCopy,
      id: `${baseCopy.id}-mutated-${t.suffix}`,
      headline: t.headline.length > 40 ? t.headline.substring(0, 37) + "..." : t.headline,
      callToAction: t.cta,
    });
  }

  return variants;
}
