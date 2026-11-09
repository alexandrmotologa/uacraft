import { describe, it, expect } from "vitest";
import { generateCreativePackage } from "../src/core/engine";
import { exportMetaAdsCsv } from "../src/core/exporters/meta-csv";
import { exportTikTokAdsCsv } from "../src/core/exporters/tiktok-csv";
import { exportAirtableCsv, exportAirtableJson } from "../src/core/exporters/airtable-export";
import { exportMarkdownBrief } from "../src/core/exporters/markdown-brief";
import { exportHtmlStoryboard } from "../src/core/exporters/html-preview";
import { GameProfile } from "../src/types";

const mockGame: GameProfile = {
  id: "test-game",
  title: "Idle Tower Defense",
  genre: "tower defense",
  theme: "steampunk",
  visualStyle: "isometric 3D",
  targetAudience: {
    playerMotivations: ["strategy", "mastery"],
  },
  coreMechanics: ["place turrets", "upgrade gears"],
  failStates: ["core breached by waves"],
  satisfyingMoments: ["tesla coil storm wipe"],
  uniqueSellingPoints: ["infinite tower waves"],
};

describe("Ad Network Exporters", () => {
  it("exports valid Meta Ads Manager bulk CSV", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const csv = exportMetaAdsCsv(pkg);

    expect(csv).toContain("Campaign Name");
    expect(csv).toContain("Ad Set Name");
    expect(csv).toContain("Primary Text");
    expect(csv).toContain("Headline");
    expect(csv).toContain("Call to Action");

    const lines = csv.split("\n");
    expect(lines.length).toBeGreaterThan(5);
  });

  it("exports valid TikTok Ads Manager bulk CSV", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const csv = exportTikTokAdsCsv(pkg);

    expect(csv).toContain("Campaign");
    expect(csv).toContain("Ad Group");
    expect(csv).toContain("Ad Text");
    expect(csv).toContain("Call To Action");
  });

  it("exports valid Airtable CSV and JSON", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const csv = exportAirtableCsv(pkg);
    const json = exportAirtableJson(pkg);

    expect(csv).toContain("Task ID");
    expect(csv).toContain("Status");

    const parsed = JSON.parse(json);
    expect(parsed.records).toBeInstanceOf(Array);
    expect(parsed.records.length).toBeGreaterThan(0);
    expect(parsed.records[0].fields["Task ID"]).toBeTruthy();
  });

  it("exports Markdown briefs without em dashes and adhering to humanizer guidelines", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const md = exportMarkdownBrief(pkg);

    expect(md).toContain(`# Creative Production Brief: ${mockGame.title}`);
    expect(md).toContain("## Angle:");
    expect(md).toContain("### 3-Second Opening Hooks");
    // Verify no em/en dashes
    expect(md).not.toContain("—");
    expect(md).not.toContain("–");
  });

  it("exports self-contained HTML storyboard with timeline player", async () => {
    const pkg = await generateCreativePackage(mockGame, { offline: true });
    const html = exportHtmlStoryboard(pkg);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>UACraft Storyboard");
    expect(html).toContain("playBtn");
    expect(html).toContain("progressBar");
  });
});
