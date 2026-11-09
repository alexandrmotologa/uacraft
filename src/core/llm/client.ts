import {
  AngleType,
  CreativePackage,
  GameProfile,
  AdHook,
  AdCopyVariation,
  VideoScript,
  VisualAssetPrompt,
} from "../../types";
import { buildGenerationPrompt, buildSystemPrompt } from "./prompts";

export interface LlmClientOptions {
  provider?: "gemini" | "openai" | "anthropic" | "custom";
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
}

export function detectProvider(options: LlmClientOptions): {
  provider: "gemini" | "openai" | "anthropic" | "custom" | "none";
  apiKey: string;
  baseUrl?: string;
} {
  if (options.apiKey) {
    return {
      provider: options.provider || "openai",
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
    };
  }

  if (process.env.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      apiKey: process.env.GEMINI_API_KEY,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return {
      provider: "anthropic",
      apiKey: process.env.ANTHROPIC_API_KEY,
    };
  }

  return { provider: "none", apiKey: "" };
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

export async function callLlmProvider(
  prompt: string,
  systemPrompt: string,
  options: LlmClientOptions
): Promise<string> {
  const { provider, apiKey, baseUrl } = detectProvider(options);

  if (provider === "none" || !apiKey) {
    throw new Error("No API key available for LLM generation");
  }

  const timeout = options.timeoutMs || 30000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    if (provider === "gemini") {
      const model = options.model || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as any;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Empty response received from Gemini API");
      }
      return text;
    }

    if (provider === "anthropic") {
      const model = options.model || "claude-3-5-sonnet-20241022";
      const url = "https://api.anthropic.com/v1/messages";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Anthropic API error (${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as any;
      const text = data.content?.[0]?.text;
      if (!text) {
        throw new Error("Empty response from Anthropic API");
      }
      return text;
    }

    // OpenAI and Custom / OpenAI-compatible
    const host = baseUrl || "https://api.openai.com/v1";
    const url = `${host.replace(/\/$/, "")}/chat/completions`;
    const model = options.model || "gpt-4o-mini";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`LLM provider error (${res.status}): ${errorText}`);
    }

    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Empty content received from LLM provider");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateWithLlm(
  game: GameProfile,
  angles: AngleType[],
  durations: Array<15 | 30>,
  options: LlmClientOptions
): Promise<{
  hooks: AdHook[];
  copies: AdCopyVariation[];
  scripts: VideoScript[];
  visualPrompts: VisualAssetPrompt[];
}> {
  const prompt = buildGenerationPrompt(game, angles, durations);
  const systemPrompt = buildSystemPrompt();

  const rawJson = await callLlmProvider(prompt, systemPrompt, options);
  const cleaned = cleanJsonString(rawJson);
  const parsed = JSON.parse(cleaned);

  const hooks: AdHook[] = (parsed.hooks || []).map((h: any, i: number) => ({
    id: `${game.id}-llm-hook-${h.angle || "hook"}-${i + 1}`,
    angle: h.angle as AngleType,
    headline: h.headline || `${game.title} Hook`,
    visualAction: h.visualAction || "Fast gameplay action",
    textOverlay: h.textOverlay || "Watch this move",
    audioDirection: h.audioDirection || "Sound effect cue",
    psychologyBreakdown: h.psychologyBreakdown || "Scroll-stopping hook",
    thumbstopScoreEstimate: Number(h.thumbstopScoreEstimate) || 82,
  }));

  const copies: AdCopyVariation[] = (parsed.copies || []).map(
    (c: any, i: number) => ({
      id: `${game.id}-llm-copy-${c.angle || "copy"}-${i + 1}`,
      angle: c.angle as AngleType,
      headline: c.headline || game.title,
      primaryTextShort: c.primaryTextShort || `Play ${game.title} today!`,
      primaryTextLong: c.primaryTextLong || `Download ${game.title} free.`,
      callToAction: c.callToAction || "Play Game",
      targetNetwork: c.targetNetwork || "universal",
    })
  );

  const scripts: VideoScript[] = (parsed.scripts || []).map(
    (s: any, i: number) => {
      const beats = (s.beats || []).map((b: any) => ({
        timestamp: b.timestamp || "00:00 - 00:03",
        durationSec: Number(b.durationSec) || 3,
        segment: b.segment || "hook",
        visualScene: b.visualScene || "Gameplay scene",
        textOverlay: b.textOverlay || "Watch now",
        voiceover: b.voiceover || "",
        audioSFX: b.audioSFX || "Audio cue",
      }));
      const words = beats.reduce(
        (sum: number, b: any) =>
          sum + (b.voiceover ? b.voiceover.split(/\s+/).filter(Boolean).length : 0),
        0
      );
      const duration = Number(s.durationSec) === 30 ? 30 : 15;
      return {
        id: `${game.id}-llm-script-${s.angle || "ad"}-${duration}s-${i + 1}`,
        angle: s.angle as AngleType,
        durationSec: duration as 15 | 30,
        title: s.title || `${game.title} ${duration}s Ad`,
        logline: s.logline || `Video ad script for ${game.title}`,
        beats,
        totalWordCount: words,
        estimatedWpm: Math.round((words / duration) * 60),
      };
    }
  );

  const visualPrompts: VisualAssetPrompt[] = (parsed.visualPrompts || []).map(
    (p: any, i: number) => ({
      id: `${game.id}-llm-prompt-${p.angle || "prompt"}-${i + 1}`,
      angle: p.angle as AngleType,
      assetType: p.assetType || "gameplay_background",
      prompt: p.prompt || `3D render for ${game.title}`,
      negativePrompt: p.negativePrompt || "low quality, blur",
      aspectRatio: p.aspectRatio || "9:16",
      parameters: { stylize: 250, model: "v6.0" },
      designNotes: p.designNotes || "Concept art asset",
    })
  );

  return { hooks, copies, scripts, visualPrompts };
}
