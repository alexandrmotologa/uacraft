import { describe, it, expect } from "vitest";
import {
  performHookSwap,
  mutateHeadline,
  mutateCopySet,
} from "../src/core/mutator/variant-mutator";
import { generateScriptsForAngle } from "../src/core/generator/script-writer";
import { generateCopyForAngle } from "../src/core/generator/copy-generator";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "test-game",
  title: "Blast Kingdom",
  genre: "match-3",
  theme: "royal castle",
  visualStyle: "3D polished",
  targetAudience: {
    playerMotivations: ["progression"],
  },
  coreMechanics: ["swap crowns"],
  failStates: ["out of moves"],
  satisfyingMoments: ["royal chest blast"],
  uniqueSellingPoints: ["1000 levels"],
};

describe("Variant Mutator", () => {
  it("performs hook swaps replacing opening beat with a different angle", () => {
    const baseScript = generateScriptsForAngle(mockGame, "asmr-satisfying", [15])[0];
    const swapped = performHookSwap(baseScript, mockGame, "challenge-fail");

    expect(swapped.newAngle).toBe("challenge-fail");
    expect(swapped.mutatedScript.angle).toBe("challenge-fail");
    expect(swapped.mutatedScript.beats[0].visualScene).toBe(swapped.swappedHook.visualAction);
    expect(swapped.mutatedScript.beats.length).toBe(baseScript.beats.length);
  });

  it("mutates headlines into multiple psychological angles", () => {
    const mutations = mutateHeadline("Oddly Satisfying Blast Kingdom", "Blast Kingdom");
    expect(mutations.variations.questionChallenge).toContain("Blast Kingdom");
    expect(mutations.variations.curiosityMystery).toContain("Blast Kingdom");
    expect(mutations.variations.socialProof).toContain("Blast Kingdom");
    expect(mutations.variations.directImperative).toContain("Blast Kingdom");
  });

  it("mutates copy sets into multiple ad variations", () => {
    const baseCopy = generateCopyForAngle(mockGame, "asmr-satisfying", 1)[0];
    const variants = mutateCopySet(baseCopy, "Blast Kingdom");
    expect(variants).toHaveLength(4);
    expect(variants.some((v) => v.id.includes("challenge"))).toBe(true);
    expect(variants.some((v) => v.id.includes("social"))).toBe(true);
  });
});
