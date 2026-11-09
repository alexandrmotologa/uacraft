import {
  AngleType,
  CreativePackage,
  CreativePackageSchema,
  GameProfile,
  GameProfileSchema,
} from "../types";
import { getAllAngleTypes } from "./angles";
import { generateAllHooks } from "./generator/hook-generator";
import { generateAllCopies } from "./generator/copy-generator";
import { generateAllScripts } from "./generator/script-writer";
import { generateAllPrompts } from "./generator/visual-asset-prompter";
import { generateWithLlm, detectProvider, LlmClientOptions } from "./llm/client";

export interface EngineGenerateOptions extends LlmClientOptions {
  angles?: AngleType[];
  countPerAngle?: number;
  durations?: Array<15 | 30>;
  offline?: boolean;
}

export const ENGINE_VERSION = "1.0.0";

export async function generateCreativePackage(
  rawGameProfile: unknown,
  options: EngineGenerateOptions = {}
): Promise<CreativePackage> {
  // Validate game profile schema
  const game = GameProfileSchema.parse(rawGameProfile);

  const selectedAngles = options.angles && options.angles.length > 0
    ? options.angles
    : getAllAngleTypes();

  const durations: Array<15 | 30> = options.durations && options.durations.length > 0
    ? options.durations
    : [15, 30];

  const countPerAngle = options.countPerAngle || 2;

  let providerUsed = "offline-heuristic-engine";
  let hooks = [];
  let copies = [];
  let scripts = [];
  let visualPrompts = [];

  const providerCheck = detectProvider(options);
  const shouldAttemptLlm = !options.offline && providerCheck.provider !== "none";

  if (shouldAttemptLlm) {
    try {
      const llmResult = await generateWithLlm(
        game,
        selectedAngles,
        durations,
        options
      );
      hooks = llmResult.hooks;
      copies = llmResult.copies;
      scripts = llmResult.scripts;
      visualPrompts = llmResult.visualPrompts;
      providerUsed = `llm-${providerCheck.provider}`;
    } catch (err: any) {
      // Fallback cleanly to heuristic synthesis engine if LLM call fails
      hooks = generateAllHooks(game, selectedAngles, countPerAngle);
      copies = generateAllCopies(game, selectedAngles, countPerAngle);
      scripts = generateAllScripts(game, selectedAngles, durations);
      visualPrompts = generateAllPrompts(game, selectedAngles);
      providerUsed = `fallback-heuristic (llm error: ${err.message || "failed"})`;
    }
  } else {
    // Built-in rule-based synthesis engine
    hooks = generateAllHooks(game, selectedAngles, countPerAngle);
    copies = generateAllCopies(game, selectedAngles, countPerAngle);
    scripts = generateAllScripts(game, selectedAngles, durations);
    visualPrompts = generateAllPrompts(game, selectedAngles);
    providerUsed = "built-in-heuristic-engine";
  }

  // Estimated testing duration: 50 variants tested over ~14 days for statistical significance
  const totalVariants = hooks.length + copies.length + scripts.length;
  const estimatedDays = Math.max(7, Math.round(totalVariants / 3));

  const creativePackage: CreativePackage = {
    gameId: game.id,
    gameTitle: game.title,
    generatedAt: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
    providerUsed,
    anglesGenerated: selectedAngles,
    hooks,
    copies,
    scripts,
    visualPrompts,
    summary: {
      totalHooks: hooks.length,
      totalCopies: copies.length,
      totalScripts: scripts.length,
      totalPrompts: visualPrompts.length,
      estimatedTestingDurationDays: estimatedDays,
    },
  };

  return CreativePackageSchema.parse(creativePackage);
}
