import { AdCopyVariation, AngleType, GameProfile } from "../../types";
import { getAngleDefinition } from "../angles";

export function generateCopyForAngle(
  game: GameProfile,
  angle: AngleType,
  count: number = 2
): AdCopyVariation[] {
  const angleDef = getAngleDefinition(angle);
  const headlines = angleDef.headlineFormulas(game);
  const shortTexts = angleDef.primaryTextsShort(game);
  const longTexts = angleDef.primaryTextsLong(game);

  const ctaOptions = ["Play Game", "Install Now", "Download Free", "Try Today"];
  const networks: Array<"meta" | "tiktok" | "google" | "universal"> = [
    "meta",
    "tiktok",
    "universal",
    "google",
  ];

  const copies: AdCopyVariation[] = [];

  for (let i = 0; i < count; i++) {
    const rawHeadline = headlines[i % headlines.length];
    // Ensure headline is within 40-50 chars for mobile ad networks
    const headline =
      rawHeadline.length > 40
        ? rawHeadline.substring(0, 37).trim() + "..."
        : rawHeadline;

    const rawShort = shortTexts[i % shortTexts.length];
    const primaryTextShort =
      rawShort.length > 125
        ? rawShort.substring(0, 122).trim() + "..."
        : rawShort;

    const primaryTextLong = longTexts[i % longTexts.length];
    const cta = ctaOptions[i % ctaOptions.length];
    const network = networks[i % networks.length];

    copies.push({
      id: `${game.id}-copy-${angle}-${i + 1}`,
      angle,
      headline,
      primaryTextShort,
      primaryTextLong,
      callToAction: cta,
      targetNetwork: network,
    });
  }

  return copies;
}

export function generateAllCopies(
  game: GameProfile,
  angles: AngleType[],
  countPerAngle: number = 2
): AdCopyVariation[] {
  const allCopies: AdCopyVariation[] = [];
  for (const angle of angles) {
    allCopies.push(...generateCopyForAngle(game, angle, countPerAngle));
  }
  return allCopies;
}
