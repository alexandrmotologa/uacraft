import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import {
  lintCreativePackage,
  autoFixCreativePackage,
} from "../src/core/validator/policy-linter";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "lint-game",
  title: "Test Game",
  genre: "puzzle",
  theme: "abstract",
  visualStyle: "flat",
  targetAudience: { playerMotivations: ["fun"] },
  coreMechanics: ["tap screen"],
  failStates: ["fall"],
  satisfyingMoments: ["win"],
  uniqueSellingPoints: ["USP"],
};

describe("Ad Policy & Claim Linter", () => {
  it("scores clean packages with high policy score", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const report = lintCreativePackage(pkg);

    expect(report.policyScore).toBeGreaterThanOrEqual(80);
    expect(report.errorCount).toBe(0);
  });

  it("detects prohibited money claims and punctuation spam", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    // Inject violation
    pkg.copies[0].headline = "WIN REAL MONEY NOW!!!!";
    pkg.copies[0].primaryTextShort = "Guaranteed cash prize payout inside!!!";

    const report = lintCreativePackage(pkg);
    expect(report.errorCount).toBeGreaterThan(0);
    expect(report.warningCount).toBeGreaterThan(0);
    expect(report.findings.some((f) => f.rule === "PROHIBITED_FINANCIAL_CLAIM")).toBe(true);
    expect(report.findings.some((f) => f.rule === "PUNCTUATION_SPAM")).toBe(true);
  });

  it("auto-fixes policy violations and character boundaries", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    pkg.copies[0].headline = "WIN REAL MONEY IN THIS AWESOME PUZZLE GAME!!!!";

    const { fixedPackage, fixCount } = autoFixCreativePackage(pkg);
    expect(fixCount).toBeGreaterThan(0);
    expect(fixedPackage.copies[0].headline).not.toContain("WIN REAL MONEY");
    expect(fixedPackage.copies[0].headline).not.toContain("!!!!");
  });
});
