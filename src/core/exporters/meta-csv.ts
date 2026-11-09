import { CreativePackage } from "../../types";

function escapeCsvField(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field);
  // If field contains quote, comma, or newline, escape it
  if (str.includes('"') || str.includes(",") || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportMetaAdsCsv(pkg: CreativePackage): string {
  const headers = [
    "Campaign Name",
    "Ad Set Name",
    "Ad Name",
    "Primary Text",
    "Headline",
    "Description",
    "Call to Action",
    "Link URL",
    "Angle Category",
    "Hook Text Overlay",
    "Target Script ID",
  ];

  const rows: string[] = [headers.join(",")];

  const campaignName = `UA_${pkg.gameTitle.replace(/\s+/g, "_")}_Testing`;

  // Pair each copy with matching angle hooks and scripts
  pkg.copies.forEach((copy, idx) => {
    const matchingHook = pkg.hooks.find((h) => h.angle === copy.angle) || pkg.hooks[0];
    const matchingScript = pkg.scripts.find((s) => s.angle === copy.angle) || pkg.scripts[0];

    const adSetName = `AS_${copy.angle.toUpperCase()}_Broad`;
    const adName = `AD_${copy.angle}_var${idx + 1}`;
    const linkUrl = `https://store.google.com/details?id=com.${pkg.gameId}.game`;
    const description = `Download ${pkg.gameTitle} free today`;

    const row = [
      escapeCsvField(campaignName),
      escapeCsvField(adSetName),
      escapeCsvField(adName),
      escapeCsvField(copy.primaryTextShort),
      escapeCsvField(copy.headline),
      escapeCsvField(description),
      escapeCsvField(copy.callToAction),
      escapeCsvField(linkUrl),
      escapeCsvField(copy.angle),
      escapeCsvField(matchingHook ? matchingHook.textOverlay : ""),
      escapeCsvField(matchingScript ? matchingScript.id : ""),
    ];

    rows.push(row.join(","));
  });

  return rows.join("\n");
}
