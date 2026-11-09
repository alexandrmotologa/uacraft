import { z } from "zod";

export const AngleTypeSchema = z.enum([
  "asmr-satisfying",
  "challenge-fail",
  "curiosity-gap",
  "story-drama",
  "competitive-flex",
]);

export type AngleType = z.infer<typeof AngleTypeSchema>;

export const AngleTypeLabels: Record<AngleType, string> = {
  "asmr-satisfying": "ASMR & Tactile Satisfaction",
  "challenge-fail": "Challenge & Rage Bait (Deliberate Fail)",
  "curiosity-gap": "Curiosity Gap & Inverted Logic",
  "story-drama": "Storyline & Character Dilemma",
  "competitive-flex": "Competitive Flex & Mastery",
};

export const GameProfileSchema = z.object({
  id: z.string().min(1, "Game ID is required"),
  title: z.string().min(1, "Game title is required"),
  genre: z.string().min(1, "Genre is required"),
  subgenre: z.string().optional(),
  theme: z.string().min(1, "Theme is required"),
  visualStyle: z.string().min(1, "Visual style is required"),
  targetAudience: z.object({
    demographics: z.string().optional(),
    playerMotivations: z.array(z.string()).min(1, "At least one player motivation is required"),
  }),
  coreMechanics: z.array(z.string()).min(1, "At least one core mechanic is required"),
  failStates: z.array(z.string()).min(1, "At least one fail state is required"),
  satisfyingMoments: z.array(z.string()).min(1, "At least one satisfying moment is required"),
  uniqueSellingPoints: z.array(z.string()).min(1, "At least one USP is required"),
  historicalData: z
    .object({
      winningHooks: z.array(z.string()).optional(),
      fatiguedAngles: z.array(z.string()).optional(),
      topCtrHeadlines: z.array(z.string()).optional(),
      targetNetworks: z
        .array(z.enum(["meta", "tiktok", "google", "applovin", "unity"]))
        .optional(),
      historicalCpiAverage: z.number().optional(),
      historicalCtrAverage: z.number().optional(),
    })
    .optional(),
});

export type GameProfile = z.infer<typeof GameProfileSchema>;

export const AdHookSchema = z.object({
  id: z.string(),
  angle: AngleTypeSchema,
  headline: z.string(),
  visualAction: z.string(),
  textOverlay: z.string(),
  audioDirection: z.string(),
  psychologyBreakdown: z.string(),
  thumbstopScoreEstimate: z.number().min(1).max(100),
});

export type AdHook = z.infer<typeof AdHookSchema>;

export const AdCopyVariationSchema = z.object({
  id: z.string(),
  angle: AngleTypeSchema,
  headline: z.string().max(60),
  primaryTextShort: z.string().max(160),
  primaryTextLong: z.string(),
  callToAction: z.string(),
  targetNetwork: z.enum(["meta", "tiktok", "google", "universal"]),
});

export type AdCopyVariation = z.infer<typeof AdCopyVariationSchema>;

export const VideoScriptBeatSchema = z.object({
  timestamp: z.string(),
  durationSec: z.number().positive(),
  segment: z.enum(["hook", "setup", "escalation", "climax_or_fail", "cta_endcard"]),
  visualScene: z.string(),
  textOverlay: z.string(),
  voiceover: z.string(),
  audioSFX: z.string(),
});

export type VideoScriptBeat = z.infer<typeof VideoScriptBeatSchema>;

export const VideoScriptSchema = z.object({
  id: z.string(),
  angle: AngleTypeSchema,
  durationSec: z.union([z.literal(15), z.literal(30)]),
  title: z.string(),
  logline: z.string(),
  beats: z.array(VideoScriptBeatSchema),
  totalWordCount: z.number(),
  estimatedWpm: z.number(),
});

export type VideoScript = z.infer<typeof VideoScriptSchema>;

export const VisualAssetPromptSchema = z.object({
  id: z.string(),
  angle: AngleTypeSchema,
  assetType: z.enum([
    "hero_character",
    "gameplay_background",
    "fail_screen_overlay",
    "end_card_cta",
    "app_icon_variant",
  ]),
  prompt: z.string(),
  negativePrompt: z.string(),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]),
  parameters: z.object({
    stylize: z.number().optional(),
    seed: z.number().optional(),
    model: z.string().optional(),
  }),
  designNotes: z.string(),
});

export type VisualAssetPrompt = z.infer<typeof VisualAssetPromptSchema>;

export const CreativePackageSchema = z.object({
  gameId: z.string(),
  gameTitle: z.string(),
  generatedAt: z.string(),
  engineVersion: z.string(),
  providerUsed: z.string(),
  anglesGenerated: z.array(AngleTypeSchema),
  hooks: z.array(AdHookSchema),
  copies: z.array(AdCopyVariationSchema),
  scripts: z.array(VideoScriptSchema),
  visualPrompts: z.array(VisualAssetPromptSchema),
  summary: z.object({
    totalHooks: z.number(),
    totalCopies: z.number(),
    totalScripts: z.number(),
    totalPrompts: z.number(),
    estimatedTestingDurationDays: z.number(),
  }),
});

export type CreativePackage = z.infer<typeof CreativePackageSchema>;

export const PerformanceMetricRecordSchema = z.object({
  adId: z.string(),
  adName: z.string(),
  angle: AngleTypeSchema,
  spend: z.number(),
  impressions: z.number(),
  clicks: z.number(),
  installs: z.number(),
  thumbstopRate3s: z.number(), // percentage 0-100
  completionRateVideo: z.number(), // percentage 0-100
  cpi: z.number(),
  ctr: z.number(), // percentage 0-100
  daysActive: z.number(),
});

export type PerformanceMetricRecord = z.infer<typeof PerformanceMetricRecordSchema>;

export interface FatigueAngleStatus {
  angle: AngleType;
  label: string;
  adCount: number;
  totalSpend: number;
  averageCtr: number;
  averageHookRate: number;
  averageCpi: number;
  fatigueScore: number; // 0 (fresh) to 100 (heavily fatigued)
  status: "fresh" | "healthy" | "warning" | "fatigued";
  reason: string;
}

export interface FatigueAnalysisResult {
  analyzedAt: string;
  totalAdsAnalyzed: number;
  totalSpend: number;
  angleBreakdown: Record<AngleType, FatigueAngleStatus>;
  fatiguedAngles: AngleType[];
  recommendedAnglesToScale: AngleType[];
  recommendedAnglesToProduce: AngleType[];
  actionItems: string[];
}
