import { AngleType } from "../../types";
import { AngleDefinition } from "./base";
import { asmrSatisfyingAngle } from "./asmr-satisfying";
import { challengeFailAngle } from "./challenge-fail";
import { curiosityGapAngle } from "./curiosity-gap";
import { storyDramaAngle } from "./story-drama";
import { competitiveFlexAngle } from "./competitive-flex";

export * from "./base";
export * from "./asmr-satisfying";
export * from "./challenge-fail";
export * from "./curiosity-gap";
export * from "./story-drama";
export * from "./competitive-flex";

export const ALL_ANGLES: Record<AngleType, AngleDefinition> = {
  "asmr-satisfying": asmrSatisfyingAngle,
  "challenge-fail": challengeFailAngle,
  "curiosity-gap": curiosityGapAngle,
  "story-drama": storyDramaAngle,
  "competitive-flex": competitiveFlexAngle,
};

export function getAngleDefinition(angle: AngleType): AngleDefinition {
  const def = ALL_ANGLES[angle];
  if (!def) {
    throw new Error(`Unknown angle type: ${angle}`);
  }
  return def;
}

export function getAllAngleTypes(): AngleType[] {
  return [
    "asmr-satisfying",
    "challenge-fail",
    "curiosity-gap",
    "story-drama",
    "competitive-flex",
  ];
}
