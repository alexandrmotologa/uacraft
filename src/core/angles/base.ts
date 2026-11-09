import { AngleType, GameProfile } from "../../types";

export interface AngleDefinition {
  angle: AngleType;
  label: string;
  driver: string;
  thumbstopFormula: string;
  targetPsychology: string;
  hookActions: (game: GameProfile) => string[];
  textOverlays: (game: GameProfile) => string[];
  audioDirections: (game: GameProfile) => string[];
  headlineFormulas: (game: GameProfile) => string[];
  primaryTextsShort: (game: GameProfile) => string[];
  primaryTextsLong: (game: GameProfile) => string[];
  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) => string;
      beats: (game: GameProfile) => Array<{
        segment: "hook" | "setup" | "escalation" | "climax_or_fail" | "cta_endcard";
        visualScene: string;
        textOverlay: string;
        voiceover: string;
        audioSFX: string;
        durationSec: number;
        timestamp: string;
      }>;
    };
    duration30s: {
      logline: (game: GameProfile) => string;
      beats: (game: GameProfile) => Array<{
        segment: "hook" | "setup" | "escalation" | "climax_or_fail" | "cta_endcard";
        visualScene: string;
        textOverlay: string;
        voiceover: string;
        audioSFX: string;
        durationSec: number;
        timestamp: string;
      }>;
    };
  };
  visualAssetPrompts: (game: GameProfile) => Array<{
    assetType: "hero_character" | "gameplay_background" | "fail_screen_overlay" | "end_card_cta" | "app_icon_variant";
    prompt: string;
    negativePrompt: string;
    aspectRatio: "9:16" | "1:1" | "16:9";
    designNotes: string;
  }>;
}
