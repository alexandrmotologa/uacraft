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
});
