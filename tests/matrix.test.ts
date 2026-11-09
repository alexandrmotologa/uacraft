import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import {
  generateCombinatorialMatrix,
  exportMatrixCsv,
} from "../src/core/mutator/matrix-generator";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "matrix-game",
  title: "Blast Kingdom 3D",
  genre: "puzzle",
  theme: "royal gems",
  visualStyle: "3D polished",
  targetAudience: { playerMotivations: ["relaxation"] },
  coreMechanics: ["swap royal gems"],
  failStates: ["out of moves"],
  satisfyingMoments: ["board wipe sparkle"],
  uniqueSellingPoints: ["1000 levels"],
};

describe("A/B Combinatorial Matrix Engine", () => {
  it("generates factorial matrix combinations with standard taxonomy names", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true, countPerAngle: 2 });
    const matrix = generateCombinatorialMatrix(pkg, { maxPerAngle: 6, aspectRatio: "9:16" });

    expect(matrix.length).toBeGreaterThan(5);
    matrix.forEach((item) => {
      expect(item.taxonomyName).toContain("BLASTKINGD");
      expect(item.taxonomyName).toContain("9X16");
      expect(item.utmCampaign).toBeTruthy();
      expect(item.utmContent).toBeTruthy();
      expect(item.callToAction).toBeTruthy();
    });

    const csv = exportMatrixCsv(matrix);
    expect(csv).toContain("Taxonomy Ad Name");
    expect(csv).toContain("UTM Campaign");
  });
});
