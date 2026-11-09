import { AngleType, GameProfile } from "../../types";
import { getAngleDefinition } from "../angles";

export function buildSystemPrompt(): string {
  return `You are UACraft, a top-tier mobile User Acquisition (UA) creative strategist and copywriter.
You understand the psychology of mobile game marketing across Meta Ads, TikTok Ads, AppLovin, and Google App Campaigns.
Your job is to generate high-performing ad creative briefs, thumbstop video hooks, high-converting ad copy variations, timed 15s/30s video scripts, and image prompts for motion designers.

Strict rules:
1. Always output strictly valid JSON matching the requested schema. Do not wrap output in markdown code fences unless specifically requested.
2. Character limits: Headlines must be <= 40 characters. Short primary text must be <= 125 characters.
3. Be specific, punchy, and grounded in the game's actual mechanics.
4. Avoid generic filler words or overused AI tropes. Focus on concrete visuals, sound cues, and player psychology.`;
}

export function buildGenerationPrompt(
  game: GameProfile,
  angles: AngleType[],
  durations: Array<15 | 30> = [15, 30]
): string {
  const angleDetails = angles.map((a) => {
    const def = getAngleDefinition(a);
    return `- ${a} (${def.label}): ${def.driver}`;
  });

  return `Generate a comprehensive ad creative package for the following game:

Game Profile:
- Title: ${game.title}
- Genre: ${game.genre} (${game.subgenre || "Standard"})
- Theme: ${game.theme}
- Visual Style: ${game.visualStyle}
- Core Mechanics: ${game.coreMechanics.join(", ")}
- Fail States: ${game.failStates.join(", ")}
- Satisfying Moments: ${game.satisfyingMoments.join(", ")}
- USPs: ${game.uniqueSellingPoints.join(", ")}

Target Angles:
${angleDetails.join("\n")}

Durations to generate: ${durations.map((d) => `${d}s`).join(", ")}

Respond with a JSON object containing:
{
  "hooks": [
    {
      "angle": "one of the requested angles",
      "headline": "punchy short title (<= 40 chars)",
      "visualAction": "precise description of what happens on screen in 0-3 seconds",
      "textOverlay": "exact on-screen text overlay",
      "audioDirection": "sound effects and music cues",
      "psychologyBreakdown": "why this hooks the viewer",
      "thumbstopScoreEstimate": 85
    }
  ],
  "copies": [
    {
      "angle": "one of the requested angles",
      "headline": "headline max 40 chars",
      "primaryTextShort": "short caption max 125 chars",
      "primaryTextLong": "longer copy with bullet points and clear CTA",
      "callToAction": "Play Game | Install Now | Download Free",
      "targetNetwork": "meta | tiktok | google | universal"
    }
  ],
  "scripts": [
    {
      "angle": "one of the requested angles",
      "durationSec": 15,
      "title": "script title",
      "logline": "1-sentence summary",
      "beats": [
        {
          "timestamp": "00:00 - 00:03",
          "durationSec": 3,
          "segment": "hook | setup | escalation | climax_or_fail | cta_endcard",
          "visualScene": "action description",
          "textOverlay": "screen text",
          "voiceover": "spoken narration",
          "audioSFX": "sound cues"
        }
      ]
    }
  ],
  "visualPrompts": [
    {
      "angle": "one of the requested angles",
      "assetType": "hero_character | gameplay_background | fail_screen_overlay | end_card_cta | app_icon_variant",
      "prompt": "detailed Midjourney v6 / Flux prompt",
      "negativePrompt": "negative prompt items",
      "aspectRatio": "9:16 | 1:1 | 16:9",
      "designNotes": "instructions for the motion designer"
    }
  ]
}`;
}
