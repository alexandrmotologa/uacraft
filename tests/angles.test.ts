import { describe, it, expect } from "vitest";
import { ALL_ANGLES, getAngleDefinition, getAllAngleTypes } from "../src/core/angles";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "test-game",
  title: "Gem Blitz 3D",
  genre: "puzzle",
  theme: "crystal mines",
  visualStyle: "3D stylized",
  targetAudience: {
    playerMotivations: ["relaxation", "logic"],
  },
  coreMechanics: ["swap gems", "trigger cascade"],
  failStates: ["run out of moves"],
  satisfyingMoments: ["board wipe sparkle"],
  uniqueSellingPoints: ["500 levels"],
};

describe("Psychological Angles", () => {
  it("should have all 5 mobile gaming psychological angles registered", () => {
    const angles = getAllAngleTypes();
    expect(angles).toHaveLength(5);
    expect(angles).toContain("asmr-satisfying");
    expect(angles).toContain("challenge-fail");
    expect(angles).toContain("curiosity-gap");
    expect(angles).toContain("story-drama");
    expect(angles).toContain("competitive-flex");
  });

  it("should retrieve valid angle definitions for each angle", () => {
    for (const angle of getAllAngleTypes()) {
      const def = getAngleDefinition(angle);
      expect(def.angle).toBe(angle);
      expect(def.label).toBeTruthy();
      expect(def.driver).toBeTruthy();

      const hooks = def.hookActions(mockGame);
      expect(hooks.length).toBeGreaterThan(0);

      const overlays = def.textOverlays(mockGame);
      expect(overlays.length).toBeGreaterThan(0);

      const headlines = def.headlineFormulas(mockGame);
      expect(headlines.length).toBeGreaterThan(0);

      const beats15s = def.scriptArchetypes.duration15s.beats(mockGame);
      expect(beats15s.length).toBeGreaterThan(0);

      const beats30s = def.scriptArchetypes.duration30s.beats(mockGame);
      expect(beats30s.length).toBeGreaterThan(0);

      const prompts = def.visualAssetPrompts(mockGame);
      expect(prompts.length).toBeGreaterThan(0);
    }
  });

  it("should throw error for unknown angle", () => {
    expect(() => getAngleDefinition("unknown-angle" as any)).toThrow();
  });
});
