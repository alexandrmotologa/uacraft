import { CreativePackage } from "../../types";

function escapeCsvField(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportAirtableCsv(pkg: CreativePackage): string {
  const headers = [
    "Task ID",
    "Creative Title",
    "Angle Category",
    "Status",
    "Target Duration",
    "0-3s Visual Hook",
    "Text Overlay",
    "Audio & SFX Cue",
    "Headline Copy",
    "Midjourney Prompt Recipe",
    "Designer Notes",
  ];

  const rows: string[] = [headers.join(",")];

  pkg.scripts.forEach((script) => {
    const matchingHook = pkg.hooks.find((h) => h.angle === script.angle);
    const matchingCopy = pkg.copies.find((c) => c.angle === script.angle);
    const matchingPrompt = pkg.visualPrompts.find((p) => p.angle === script.angle);

    const hookScene = script.beats[0] ? script.beats[0].visualScene : "";
    const hookText = script.beats[0] ? script.beats[0].textOverlay : "";
    const hookAudio = script.beats[0] ? script.beats[0].audioSFX : "";

    const row = [
      escapeCsvField(script.id),
      escapeCsvField(script.title),
      escapeCsvField(script.angle),
      escapeCsvField("Ready for Motion Production"),
      escapeCsvField(`${script.durationSec}s`),
      escapeCsvField(hookScene || (matchingHook ? matchingHook.visualAction : "")),
      escapeCsvField(hookText || (matchingHook ? matchingHook.textOverlay : "")),
      escapeCsvField(hookAudio || (matchingHook ? matchingHook.audioDirection : "")),
      escapeCsvField(matchingCopy ? matchingCopy.headline : ""),
      escapeCsvField(matchingPrompt ? matchingPrompt.prompt : ""),
      escapeCsvField(matchingPrompt ? matchingPrompt.designNotes : ""),
    ];

    rows.push(row.join(","));
  });

  return rows.join("\n");
}

export function exportAirtableJson(pkg: CreativePackage): string {
  const records = pkg.scripts.map((script) => {
    const matchingHook = pkg.hooks.find((h) => h.angle === script.angle);
    const matchingCopy = pkg.copies.find((c) => c.angle === script.angle);
    const matchingPrompt = pkg.visualPrompts.find((p) => p.angle === script.angle);

    return {
      fields: {
        "Task ID": script.id,
        "Creative Title": script.title,
        "Angle Category": script.angle,
        Status: "Ready for Motion Production",
        "Target Duration": `${script.durationSec}s`,
        "0-3s Visual Hook": script.beats[0]?.visualScene || matchingHook?.visualAction || "",
        "Text Overlay": script.beats[0]?.textOverlay || matchingHook?.textOverlay || "",
        "Audio & SFX Cue": script.beats[0]?.audioSFX || matchingHook?.audioDirection || "",
        Headline: matchingCopy?.headline || "",
        "Script Beats": JSON.stringify(script.beats, null, 2),
        "Prompt Recipe": matchingPrompt?.prompt || "",
        "Designer Notes": matchingPrompt?.designNotes || "",
      },
    };
  });

  return JSON.stringify({ records }, null, 2);
}
