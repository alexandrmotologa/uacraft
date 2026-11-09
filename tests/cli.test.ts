import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const cliPath = path.resolve(__dirname, "../bin/uacraft.js");
const outputDir = path.resolve(__dirname, "test-output");

describe("CLI Commands", () => {
  it("runs init command and creates a profile", () => {
    const target = path.join(outputDir, "cli-test-game.json");
    if (fs.existsSync(target)) fs.unlinkSync(target);

    execSync(`node "${cliPath}" init "${target}" --preset puzzle`, { encoding: "utf8" });
    expect(fs.existsSync(target)).toBe(true);

    const content = JSON.parse(fs.readFileSync(target, "utf8"));
    expect(content.title).toBe("Pin Rescue & Treasure");
  });

  it("runs validate command on generated profile", () => {
    const target = path.join(outputDir, "cli-test-game.json");
    const out = execSync(`node "${cliPath}" validate --profile "${target}"`, {
      encoding: "utf8",
    });
    expect(out).toContain("conforms strictly to specification");
  });

  it("runs generate command in offline mode and exports all formats", () => {
    const profile = path.resolve(__dirname, "../examples/puzzle-pin-pull.json");
    const out = execSync(
      `node "${cliPath}" generate --game-profile "${profile}" --output-dir "${outputDir}" --offline --count 1`,
      { encoding: "utf8" }
    );
    expect(out).toContain("Creative generation complete");

    expect(fs.existsSync(path.join(outputDir, "pin-pull-rescue_creative_package.json"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "pin-pull-rescue_meta_ads_bulk.csv"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "pin-pull-rescue_tiktok_ads_bulk.csv"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "pin-pull-rescue_CREATIVE_BRIEFS.md"))).toBe(true);
    expect(fs.existsSync(path.join(outputDir, "pin-pull-rescue_storyboard.html"))).toBe(true);
  });

  it("runs analyze command on sample metrics", () => {
    const metrics = path.resolve(__dirname, "../examples/historical-metrics-sample.json");
    const out = execSync(`node "${cliPath}" analyze --metrics "${metrics}"`, {
      encoding: "utf8",
    });
    expect(out).toContain("UACraft Creative Fatigue Diagnosis");
    expect(out).toContain("Actionable Recommendations");
  });

  it("runs matrix command and exports A/B testing matrix CSV", () => {
    const pkg = path.join(outputDir, "pin-pull-rescue_creative_package.json");
    const matrixOut = path.join(outputDir, "cli_matrix_test.csv");
    const out = execSync(`node "${cliPath}" matrix --input "${pkg}" --output "${matrixOut}"`, {
      encoding: "utf8",
    });
    expect(out).toContain("A/B Combinatorial Matrix Engine");
    expect(fs.existsSync(matrixOut)).toBe(true);
  });

  it("runs lint command to audit advertising policy compliance", () => {
    const pkg = path.join(outputDir, "pin-pull-rescue_creative_package.json");
    const out = execSync(`node "${cliPath}" lint --package "${pkg}"`, {
      encoding: "utf8",
    });
    expect(out).toContain("Ad Policy & Guidelines Linter");
    expect(out).toContain("Policy Health Score");
  });

  it("runs plan command to calculate budget testing limits", () => {
    const out = execSync(`node "${cliPath}" plan --budget 3000 --cpi 1.80 --platform meta`, {
      encoding: "utf8",
    });
    expect(out).toContain("Media Buying & Testing Budget Planner");
    expect(out).toContain("Campaign Mathematical Bounds");
  });

  it("runs teardown command on competitor ad copy", () => {
    const out = execSync(
      `node "${cliPath}" teardown --ad-text "Mother and baby freezing in cabin, player pulls wrong pin and burns cabin"`,
      { encoding: "utf8" }
    );
    expect(out).toContain("Competitor Ad Teardown & Counter-Strategy");
    expect(out).toContain("High-Impact Counter-Angle Strategies");
  });
});
