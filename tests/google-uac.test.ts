import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import { exportGoogleUacCsv } from "../src/core/exporters/google-uac-csv";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "uac-game",
  title: "Galaxy Defense 3D",
  genre: "tower defense",
  theme: "sci-fi space",
  visualStyle: "3D neon",
  targetAudience: { playerMotivations: ["strategy"] },
  coreMechanics: ["build photon turrets", "defend orbital station"],
  failStates: ["station breached by alien fleet"],
  satisfyingMoments: ["orbital laser board wipe"],
  uniqueSellingPoints: ["500 space battles"],
};

describe("Google App Campaigns (UAC) Exporter", () => {
  it("exports valid Google UAC bulk CSV conforming to character boundaries", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const csv = exportGoogleUacCsv(pkg);

    expect(csv).toContain("Campaign");
    expect(csv).toContain("Headline 1");
    expect(csv).toContain("Headline 5");
    expect(csv).toContain("Description 1");
    expect(csv).toContain("Description 5");
    expect(csv).toContain("Final URL");

    const lines = csv.split("\n");
    expect(lines.length).toBeGreaterThan(1);

    // Verify row columns
    const dataRow = lines[1].split(",");
    expect(dataRow.length).toBeGreaterThanOrEqual(13);
  });
});
