import { CreativePackage } from "../../types";

function escapeCsvField(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function truncateTo(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 3).trim() + "...";
}

export function exportGoogleUacCsv(pkg: CreativePackage): string {
  const headers = [
    "Campaign",
    "Ad Group",
    "Headline 1",
    "Headline 2",
    "Headline 3",
    "Headline 4",
    "Headline 5",
    "Description 1",
    "Description 2",
    "Description 3",
    "Description 4",
    "Description 5",
    "Final URL",
  ];

  const rows: string[] = [headers.join(",")];
  const campaign = `G_UAC_${pkg.gameTitle.replace(/\s+/g, "_")}_Global`;
  const finalUrl = `https://play.google.com/store/apps/details?id=com.${pkg.gameId}.game`;

  // Group copies by angle to generate targeted Google UAC Ad Groups
  for (const angle of pkg.anglesGenerated) {
    const angleCopies = pkg.copies.filter((c) => c.angle === angle);
    const angleHooks = pkg.hooks.filter((h) => h.angle === angle);

    const headlines: string[] = [];
    const descriptions: string[] = [];

    // Collect and format headlines (Max 30 chars each)
    angleCopies.forEach((c) => {
      headlines.push(truncateTo(c.headline, 30));
    });
    angleHooks.forEach((h) => {
      if (headlines.length < 5) {
        headlines.push(truncateTo(h.headline, 30));
      }
    });

    // Fill up to 5 headlines if needed
    while (headlines.length < 5) {
      const idx = headlines.length + 1;
      headlines.push(truncateTo(`Play ${pkg.gameTitle} Free #${idx}`, 30));
    }

    // Collect descriptions (Max 90 chars each)
    angleCopies.forEach((c) => {
      descriptions.push(truncateTo(c.primaryTextShort, 90));
    });
    angleHooks.forEach((h) => {
      if (descriptions.length < 5) {
        descriptions.push(truncateTo(h.visualAction, 90));
      }
    });

    // Fill up to 5 descriptions
    while (descriptions.length < 5) {
      descriptions.push(
        truncateTo(
          `Experience satisfying gameplay in ${pkg.gameTitle}. Download free on mobile today.`,
          90
        )
      );
    }

    const adGroup = `AG_${angle.toUpperCase()}_TextAssets`;

    const row = [
      escapeCsvField(campaign),
      escapeCsvField(adGroup),
      escapeCsvField(headlines[0]),
      escapeCsvField(headlines[1]),
      escapeCsvField(headlines[2]),
      escapeCsvField(headlines[3]),
      escapeCsvField(headlines[4]),
      escapeCsvField(descriptions[0]),
      escapeCsvField(descriptions[1]),
      escapeCsvField(descriptions[2]),
      escapeCsvField(descriptions[3]),
      escapeCsvField(descriptions[4]),
      escapeCsvField(finalUrl),
    ];

    rows.push(row.join(","));
  }

  return rows.join("\n");
}
