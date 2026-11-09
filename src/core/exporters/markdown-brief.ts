import { CreativePackage, VideoScript } from "../../types";
import { AngleTypeLabels } from "../../types";

export function exportMarkdownBrief(pkg: CreativePackage): string {
  const lines: string[] = [];

  lines.push(`# Creative Production Brief: ${pkg.gameTitle}`);
  lines.push("");
  lines.push(`Generated: ${pkg.generatedAt}`);
  lines.push(`Engine Version: ${pkg.engineVersion}`);
  lines.push(`Provider: ${pkg.providerUsed}`);
  lines.push("");
  lines.push("## Summary Metrics");
  lines.push("");
  lines.push(`* Total 3-Second Hooks: ${pkg.summary.totalHooks}`);
  lines.push(`* Total Copy Variations: ${pkg.summary.totalCopies}`);
  lines.push(`* Total Video Scripts: ${pkg.summary.totalScripts}`);
  lines.push(`* Total Asset Prompt Recipes: ${pkg.summary.totalPrompts}`);
  lines.push(`* Estimated Testing Window: ${pkg.summary.estimatedTestingDurationDays} days`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Group by angle
  for (const angle of pkg.anglesGenerated) {
    const label = AngleTypeLabels[angle] || angle;
    lines.push(`## Angle: ${label}`);
    lines.push("");

    // Hooks
    const angleHooks = pkg.hooks.filter((h) => h.angle === angle);
    if (angleHooks.length > 0) {
      lines.push("### 3-Second Opening Hooks");
      lines.push("");
      angleHooks.forEach((hook, idx) => {
        lines.push(`#### Hook ${idx + 1}: ${hook.headline}`);
        lines.push(`* Visual Action: ${hook.visualAction}`);
        lines.push(`* Text Overlay: "${hook.textOverlay}"`);
        lines.push(`* Audio & SFX: ${hook.audioDirection}`);
        lines.push(`* Psychological Trigger: ${hook.psychologyBreakdown}`);
        lines.push(`* Estimated Thumbstop Rating: ${hook.thumbstopScoreEstimate}/100`);
        lines.push("");
      });
    }

    // Ad Copies
    const angleCopies = pkg.copies.filter((c) => c.angle === angle);
    if (angleCopies.length > 0) {
      lines.push("### Ad Copy Variations");
      lines.push("");
      angleCopies.forEach((copy, idx) => {
        lines.push(`#### Variation ${idx + 1} (${copy.targetNetwork.toUpperCase()})`);
        lines.push(`* Headline: ${copy.headline}`);
        lines.push(`* Primary Text (Short): ${copy.primaryTextShort}`);
        lines.push(`* Call to Action: ${copy.callToAction}`);
        lines.push("* Primary Text (Long):");
        lines.push("```");
        lines.push(copy.primaryTextLong);
        lines.push("```");
        lines.push("");
      });
    }

    // Video Scripts
    const angleScripts = pkg.scripts.filter((s) => s.angle === angle);
    if (angleScripts.length > 0) {
      lines.push("### Video Production Scripts");
      lines.push("");
      angleScripts.forEach((script) => {
        lines.push(`#### Script: ${script.title} (${script.durationSec}s)`);
        lines.push(`* Logline: ${script.logline}`);
        lines.push(`* Word Count: ${script.totalWordCount} words (~${script.estimatedWpm} WPM)`);
        lines.push("");
        lines.push("| Timestamp | Segment | Visual Scene | Text Overlay | Voiceover | Audio SFX |");
        lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
        script.beats.forEach((b) => {
          const scene = b.visualScene.replace(/\|/g, "\\|");
          const text = b.textOverlay.replace(/\|/g, "\\|");
          const vo = b.voiceover.replace(/\|/g, "\\|");
          const sfx = b.audioSFX.replace(/\|/g, "\\|");
          lines.push(`| ${b.timestamp} | ${b.segment} | ${scene} | ${text} | ${vo} | ${sfx} |`);
        });
        lines.push("");
      });
    }

    // Visual Asset Prompts
    const anglePrompts = pkg.visualPrompts.filter((p) => p.angle === angle);
    if (anglePrompts.length > 0) {
      lines.push("### Concept Art & Background Prompts");
      lines.push("");
      anglePrompts.forEach((p, idx) => {
        lines.push(`#### Prompt ${idx + 1}: ${p.assetType.toUpperCase()} (${p.aspectRatio})`);
        lines.push(`* Prompt: \`${p.prompt}\``);
        lines.push(`* Negative Prompt: \`${p.negativePrompt}\``);
        lines.push(`* Designer Guidance: ${p.designNotes}`);
        lines.push("");
      });
    }

    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}
