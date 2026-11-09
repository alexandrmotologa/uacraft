import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import { exportAppLovinSpec, exportAppLovinJson } from "../src/core/exporters/applovin-export";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "applovin-game",
  title: "Idle Knight Quest",
  genre: "rpg",
  theme: "medieval fantasy",
  visualStyle: "3D stylized",
  targetAudience: { playerMotivations: ["progression"] },
  coreMechanics: ["upgrade legendary sword", "slay dungeon dragons"],
  failStates: ["dragon fire defeats knight"],
  satisfyingMoments: ["level 100 sword evolution"],
  uniqueSellingPoints: ["infinite dungeon loot"],
};

describe("AppLovin & Unity Ads Exporter", () => {
  it("exports valid AppLovin creative spec and MRAID v3 endcards", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const spec = exportAppLovinSpec(pkg);

    expect(spec.gameTitle).toBe("Idle Knight Quest");
    expect(spec.mraidVersion).toBe("3.0");
    expect(spec.targetNetworks).toContain("AppLovin");
    expect(spec.targetNetworks).toContain("Unity Ads");
    expect(spec.creatives.length).toBeGreaterThan(0);

    const first = spec.creatives[0];
    expect(first.mraidSnippet).toContain("mraid.open");
    expect(first.mraidSnippet).toContain("Idle Knight Quest");

    const json = exportAppLovinJson(pkg);
    const parsed = JSON.parse(json);
    expect(parsed.creatives).toHaveLength(spec.creatives.length);
  });
});
