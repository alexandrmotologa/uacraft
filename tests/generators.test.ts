import { describe, it, expect } from "vitest";
import { generateAllHooks, generateHooksForAngle } from "../src/core/generator/hook-generator";
import { generateAllCopies, generateCopyForAngle } from "../src/core/generator/copy-generator";
import { generateAllScripts, generateScriptsForAngle } from "../src/core/generator/script-writer";
import { generateAllPrompts, generatePromptsForAngle } from "../src/core/generator/visual-asset-prompter";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "test-runner",
  title: "Neon Runner 3D",
  genre: "runner",
  theme: "cyberpunk",
  visualStyle: "low-poly neon",
  targetAudience: {
    playerMotivations: ["reflexes", "adrenaline"],
  },
  coreMechanics: ["swipe to dodge", "gather power-ups"],
  failStates: ["crash into barrier"],
  satisfyingMoments: ["hyper-speed boost"],
  uniqueSellingPoints: ["unlimited running"],
};

describe("Generators", () => {
  it("generates hooks with appropriate thumbstop scores and valid structure", () => {
    const hooks = generateHooksForAngle(mockGame, "challenge-fail", 3);
    expect(hooks).toHaveLength(3);
    hooks.forEach((h) => {
      expect(h.angle).toBe("challenge-fail");
      expect(h.headline).toBeTruthy();
      expect(h.visualAction).toBeTruthy();
      expect(h.textOverlay).toBeTruthy();
      expect(h.audioDirection).toBeTruthy();
      expect(h.thumbstopScoreEstimate).toBeGreaterThanOrEqual(60);
      expect(h.thumbstopScoreEstimate).toBeLessThanOrEqual(100);
    });

    const allHooks = generateAllHooks(mockGame, ["asmr-satisfying", "curiosity-gap"], 2);
    expect(allHooks).toHaveLength(4);
  });

  it("generates copy variations adhering to ad network character limits", () => {
    const copies = generateCopyForAngle(mockGame, "story-drama", 3);
    expect(copies).toHaveLength(3);
    copies.forEach((c) => {
      expect(c.angle).toBe("story-drama");
      expect(c.headline.length).toBeLessThanOrEqual(45);
      expect(c.primaryTextShort.length).toBeLessThanOrEqual(135);
      expect(c.primaryTextLong).toBeTruthy();
      expect(c.callToAction).toBeTruthy();
    });

    const allCopies = generateAllCopies(mockGame, ["competitive-flex"], 2);
    expect(allCopies).toHaveLength(2);
  });

  it("generates timed scripts with WPM metrics", () => {
    const scripts = generateScriptsForAngle(mockGame, "competitive-flex", [15, 30]);
    expect(scripts).toHaveLength(2);

    const script15 = scripts.find((s) => s.durationSec === 15);
    expect(script15).toBeDefined();
    expect(script15?.beats.length).toBeGreaterThan(0);
    expect(script15?.estimatedWpm).toBeGreaterThan(0);

    const script30 = scripts.find((s) => s.durationSec === 30);
    expect(script30).toBeDefined();
    expect(script30?.beats.length).toBeGreaterThan(0);
  });

  it("generates visual asset prompts for Midjourney and Flux", () => {
    const prompts = generatePromptsForAngle(mockGame, "asmr-satisfying");
    expect(prompts.length).toBeGreaterThan(0);
    prompts.forEach((p) => {
      expect(p.prompt).toContain("Neon Runner 3D");
      expect(p.negativePrompt).toBeTruthy();
      expect(["9:16", "1:1", "16:9"]).toContain(p.aspectRatio);
      expect(p.designNotes).toBeTruthy();
    });
  });
});
