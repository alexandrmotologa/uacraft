import { AngleType, CreativePackage } from "../../types";

export interface MatrixVariant {
  variantId: string;
  taxonomyName: string;
  angle: AngleType;
  visualAction: string;
  textOverlay: string;
  audioDirection: string;
  callToAction: string;
  aspectRatio: "9:16" | "1:1";
  utmCampaign: string;
  utmContent: string;
}

function cleanTag(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 10);
}

export function generateCombinatorialMatrix(
  pkg: CreativePackage,
  options: { maxPerAngle?: number; aspectRatio?: "9:16" | "1:1" } = {}
): MatrixVariant[] {
  const maxPerAngle = options.maxPerAngle || 12;
  const ratio = options.aspectRatio || "9:16";
  const gameTag = cleanTag(pkg.gameTitle);

  const matrix: MatrixVariant[] = [];

  for (const angle of pkg.anglesGenerated) {
    const angleHooks = pkg.hooks.filter((h) => h.angle === angle);
    const angleCopies = pkg.copies.filter((c) => c.angle === angle);

    const ctas = Array.from(new Set(angleCopies.map((c) => c.callToAction)));
    if (ctas.length === 0) ctas.push("Play Game", "Install Now");

    let angleCount = 0;

    for (let hIdx = 0; hIdx < angleHooks.length; hIdx++) {
      const hook = angleHooks[hIdx];

      for (let cIdx = 0; cIdx < ctas.length; cIdx++) {
        if (angleCount >= maxPerAngle) break;

        const cta = ctas[cIdx];
        const angleTag = cleanTag(angle);
        const hookTag = `H${String(hIdx + 1).padStart(2, "0")}`;
        const ctaTag = cleanTag(cta);
        const ratioTag = ratio.toUpperCase().replace(":", "X");

        const variantId = `${pkg.gameId}-${angle}-var${String(angleCount + 1).padStart(2, "0")}`;
        const taxonomyName = `${gameTag}_${angleTag}_${hookTag}_${ctaTag}_${ratioTag}`;
        const utmCampaign = `ua_${gameTag.toLowerCase()}_${angle.replace("-", "_")}`;
        const utmContent = taxonomyName.toLowerCase();

        matrix.push({
          variantId,
          taxonomyName,
          angle,
          visualAction: hook.visualAction,
          textOverlay: hook.textOverlay,
          audioDirection: hook.audioDirection,
          callToAction: cta,
          aspectRatio: ratio,
          utmCampaign,
          utmContent,
        });

        angleCount++;
      }
    }
  }

  return matrix;
}

export function exportMatrixCsv(matrix: MatrixVariant[]): string {
  const headers = [
    "Variant ID",
    "Taxonomy Ad Name",
    "Angle Category",
    "0-3s Visual Scene",
    "Text Overlay",
    "Audio Cue",
    "Call To Action",
    "Aspect Ratio",
    "UTM Campaign",
    "UTM Content",
  ];

  const escape = (val: string) => {
    if (val.includes('"') || val.includes(",") || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return `"${val}"`;
  };

  const rows = [headers.join(",")];

  matrix.forEach((m) => {
    rows.push(
      [
        escape(m.variantId),
        escape(m.taxonomyName),
        escape(m.angle),
        escape(m.visualAction),
        escape(m.textOverlay),
        escape(m.audioDirection),
        escape(m.callToAction),
        escape(m.aspectRatio),
        escape(m.utmCampaign),
        escape(m.utmContent),
      ].join(",")
    );
  });

  return rows.join("\n");
}
