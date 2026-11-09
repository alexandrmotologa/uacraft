import { CreativePackage } from "../../types";

function escapeCsvField(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportTikTokAdsCsv(pkg: CreativePackage): string {
  const headers = [
    "Campaign",
    "Ad Group",
    "Ad Name",
    "Ad Text",
    "Call To Action",
    "Video Code / Asset ID",
    "Landing Page URL",
    "Angle",
    "Duration Sec",
  ];

  const rows: string[] = [headers.join(",")];
  const campaign = `TT_${pkg.gameTitle.replace(/\s+/g, "_")}_Hooks`;

  pkg.copies.forEach((copy, idx) => {
    const matchingScript = pkg.scripts.find((s) => s.angle === copy.angle) || pkg.scripts[0];
    const adGroup = `AG_${copy.angle}_Gaming_Interests`;
    const adName = `TT_${copy.angle}_${idx + 1}`;
    const landingPage = `https://apps.apple.com/app/id${pkg.gameId}`;

    // TikTok ad texts work best between 12 and 100 characters
    const adText = copy.primaryTextShort.length > 100
      ? copy.primaryTextShort.substring(0, 97) + "..."
      : copy.primaryTextShort;

    const row = [
      escapeCsvField(campaign),
      escapeCsvField(adGroup),
      escapeCsvField(adName),
      escapeCsvField(adText),
      escapeCsvField(copy.callToAction),
      escapeCsvField(matchingScript ? matchingScript.id : `VIDEO_${idx + 1}`),
      escapeCsvField(landingPage),
      escapeCsvField(copy.angle),
      escapeCsvField(matchingScript ? matchingScript.durationSec : 15),
    ];

    rows.push(row.join(","));
  });

  return rows.join("\n");
}
