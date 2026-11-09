import { CreativePackage, VideoScript } from "../../types";

export interface AppLovinCreativeSpec {
  campaign: string;
  gameId: string;
  gameTitle: string;
  creativeType: "video_with_interactive_endcard";
  targetNetworks: string[];
  mraidVersion: "3.0";
  creatives: Array<{
    adId: string;
    angle: string;
    durationSec: number;
    videoAssetId: string;
    endCardTitle: string;
    endCardSubtitle: string;
    callToAction: string;
    orientation: "portrait" | "landscape" | "responsive";
    mraidSnippet: string;
  }>;
}

export function generateMraidEndCardHtml(
  gameTitle: string,
  cta: string,
  headline: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="mraid.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 24px;
    }
    .app-icon {
      width: 96px;
      height: 96px;
      border-radius: 22px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    h1 { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
    p { font-size: 15px; color: #94a3b8; margin-bottom: 28px; max-width: 280px; }
    .stars { color: #fbbf24; font-size: 18px; margin-bottom: 20px; letter-spacing: 2px; }
    .cta-btn {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      text-decoration: none;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 48px;
      border-radius: 40px;
      box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
      display: inline-block;
      animation: pulse 1.8s infinite ease-in-out;
      cursor: pointer;
      border: none;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>
</head>
<body>
  <div class="app-icon">🎮</div>
  <h1>${gameTitle}</h1>
  <div class="stars">★★★★★</div>
  <p>${headline}</p>
  <button class="cta-btn" onclick="handleClick()">${cta}</button>

  <script>
    function handleClick() {
      var clickUrl = "https://play.google.com/store";
      if (typeof mraid !== "undefined" && mraid.open) {
        mraid.open(clickUrl);
      } else {
        window.open(clickUrl, "_blank");
      }
    }
  </script>
</body>
</html>`;
}

export function exportAppLovinSpec(pkg: CreativePackage): AppLovinCreativeSpec {
  const creatives = pkg.scripts.map((script) => {
    const matchingCopy = pkg.copies.find((c) => c.angle === script.angle) || pkg.copies[0];
    const cta = matchingCopy ? matchingCopy.callToAction : "Install Free";
    const headline = matchingCopy ? matchingCopy.headline : `Play ${pkg.gameTitle}`;

    return {
      adId: `AL_${script.id}`,
      angle: script.angle,
      durationSec: script.durationSec,
      videoAssetId: `${script.id}.mp4`,
      endCardTitle: pkg.gameTitle,
      endCardSubtitle: headline,
      callToAction: cta,
      orientation: "portrait" as const,
      mraidSnippet: generateMraidEndCardHtml(pkg.gameTitle, cta, headline),
    };
  });

  return {
    campaign: `AL_${pkg.gameTitle.replace(/\s+/g, "_")}_Network`,
    gameId: pkg.gameId,
    gameTitle: pkg.gameTitle,
    creativeType: "video_with_interactive_endcard",
    targetNetworks: ["AppLovin", "Mintegral", "Unity Ads", "IronSource"],
    mraidVersion: "3.0",
    creatives,
  };
}

export function exportAppLovinJson(pkg: CreativePackage): string {
  const spec = exportAppLovinSpec(pkg);
  return JSON.stringify(spec, null, 2);
}
