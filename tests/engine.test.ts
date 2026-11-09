import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import { GameProfile } from "../src/types";

const validProfile: GameProfile = {
  id: "hero-clash",
  title: "Hero Clash RPG",
  genre: "rpg",
  theme: "dark fantasy",
  visualStyle: "realistic stylized",
  targetAudience: {
    playerMotivations: ["competition", "progression"],
  },
  coreMechanics: ["summon heroes", "cast ultimate spells"],
  failStates: ["party wiped by dragon"],
  satisfyingMoments: ["boss defeated with critical hit"],
  uniqueSellingPoints: ["100 legendary heroes"],
};

describe("Creative Engine Orchestrator", () => {
  it("generates a complete valid CreativePackage in offline mode", async () => {
    const pkg = await generateCreativePackage(validProfile, {
      offline: true,
      countPerAngle: 2,
      durations: [15, 30],
    });

    expect(pkg.gameId).toBe(validProfile.id);
    expect(pkg.gameTitle).toBe(validProfile.title);
    expect(pkg.providerUsed).toBe("built-in-heuristic-engine");
    expect(pkg.anglesGenerated.length).toBe(5);

    // 5 angles * 2 hooks = 10 hooks
    expect(pkg.hooks).toHaveLength(10);
    // 5 angles * 2 copies = 10 copies
    expect(pkg.copies).toHaveLength(10);
    // 5 angles * 2 scripts = 10 scripts
    expect(pkg.scripts).toHaveLength(10);
    // 5 angles * 3 prompts = 15 prompts
    expect(pkg.visualPrompts).toHaveLength(15);

    expect(pkg.summary.totalHooks).toBe(10);
    expect(pkg.summary.totalCopies).toBe(10);
    expect(pkg.summary.totalScripts).toBe(10);
    expect(pkg.summary.totalPrompts).toBe(15);
  });

  it("throws validation error for invalid game profile", async () => {
    const invalid = { id: "" };
    await expect(generateCreativePackage(invalid as any)).rejects.toThrow();
  });

  it("supports selective angle filtering", async () => {
    const pkg = await generateCreativePackage(validProfile, {
      offline: true,
      angles: ["curiosity-gap", "story-drama"],
      countPerAngle: 1,
    });

    expect(pkg.anglesGenerated).toEqual(["curiosity-gap", "story-drama"]);
    expect(pkg.hooks).toHaveLength(2);
    expect(pkg.copies).toHaveLength(2);
  });
});
