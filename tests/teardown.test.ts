import { describe, it, expect } from "vitest";
import { teardownCompetitorAd } from "../src/core/mutator/competitor-teardown";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "hero-rescue",
  title: "Hero Rescue 3D",
  genre: "puzzle",
  theme: "medieval dungeon",
  visualStyle: "3D stylized",
  targetAudience: { playerMotivations: ["logic"] },
  coreMechanics: ["pull pins to solve puzzles"],
  failStates: ["lava reaches hero"],
  satisfyingMoments: ["water turns lava to stone"],
  uniqueSellingPoints: ["100% real puzzles"],
};

describe("Competitor Ad Teardown & Counter-Strategy", () => {
  it("detects story drama angle and generates 3 counter-angle strategies", () => {
    const competitorAd =
      "Mother and crying baby freezing in a blizzard cabin, broken windows, user chooses blowtorch and burns the house down.";
    const teardown = teardownCompetitorAd(competitorAd, mockGame);

    expect(teardown.detectedAngle).toBe("story-drama");
    expect(teardown.fatigueVulnerabilities.length).toBeGreaterThan(0);
    expect(teardown.counterAngleStrategies).toHaveLength(3);

    teardown.counterAngleStrategies.forEach((strat) => {
      expect(strat.counterHook.headline).toBeTruthy();
      expect(strat.counterHook.visualAction).toBeTruthy();
      expect(strat.counterHook.textOverlay).toBeTruthy();
      expect(strat.counterHook.thumbstopScoreEstimate).toBeGreaterThanOrEqual(80);
    });
  });

  it("detects competitive flex or rage bait from competitor text", () => {
    const competitorAd = "Noob vs Pro vs God, Level 1 vs Level 100 high score combo!";
    const teardown = teardownCompetitorAd(competitorAd, mockGame);

    expect(teardown.detectedAngle).toBe("competitive-flex");
  });
});
