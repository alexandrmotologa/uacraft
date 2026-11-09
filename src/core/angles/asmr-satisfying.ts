import { AngleDefinition } from "./base";
import { GameProfile } from "../../types";

export const asmrSatisfyingAngle: AngleDefinition = {
  angle: "asmr-satisfying",
  label: "ASMR & Tactile Satisfaction",
  driver: "Sensory gratification, visual symmetry, clean audio feedback, and stress relief",
  thumbstopFormula: "Instant visual order emerging from chaos within the first 1.2 seconds, accompanied by crisp tactile audio clicks",
  targetPsychology: "Triggers ASMR tingling and relaxation response by resolving visual clutter into flawless alignment",

  hookActions: (game: GameProfile) => [
    `Extreme close-up of ${game.coreMechanics[0] || "elements"} sliding with silky-smooth 60fps physics into a perfect geometric lock.`,
    `A screen packed with disordered items, cleared in a single continuous satisfying sweep that triggers a soft glowing ripple.`,
    `A single piece dropping into place, triggering a domino chain reaction across the entire board with sparkling particle feedback.`,
    `Fluid physics demonstration where contrasting elements flow smoothly without a single hitch or collision error.`,
  ],

  textOverlays: (game: GameProfile) => [
    "Oddly satisfying to watch...",
    "My brain needed this today",
    "Don't blink at 0:04",
    "Wait for the chain reaction",
    "100% pure satisfaction",
  ],

  audioDirections: (game: GameProfile) => [
    "Crisp tactile wood/crystal click sounds on every contact, backed by a gentle lo-fi synth chord progression.",
    "Soft ASMR popping bubbles synchronized to every element clearing, zero harsh treble.",
    "Gentle water droplet resonance followed by a low-frequency hum of completion.",
    "Binaural spatial clicks moving left-to-right across stereo channels.",
  ],

  headlineFormulas: (game: GameProfile) => [
    `Oddly Satisfying ${game.title}`,
    `The Most Relaxing Game on iOS & Android`,
    `Pure Sensory Flow: ${game.title}`,
    `Unwind in 60 Seconds with ${game.title}`,
  ],

  primaryTextsShort: (game: GameProfile) => [
    `No timers. No stress. Just pure satisfying mechanics. Try ${game.title} today.`,
    `Clear the board, hear the clicks, feel the stress melt away in ${game.title}.`,
    `The smoothest mobile physics you will play all week. Download free now.`,
  ],

  primaryTextsLong: (game: GameProfile) => [
    `Looking for a game that actually relaxes your mind? ${game.title} brings sensory physics and clean tactile satisfaction straight to your phone.\n\n` +
      `* Silky smooth 60 FPS gameplay\n` +
      `* Haptic feedback on every satisfying move\n` +
      `* Zero intrusive pressure or impossible paywalls\n\n` +
      `Tap Install Now to experience pure visual flow.`,
  ],

  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) =>
        `A 15-second visual meditation starting with tangled clutter and finishing with a flawless board sweep.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Macro shot: Cluttered board where a finger initiates ${game.coreMechanics[0] || "the main action"}. The first three items snap with tactile precision.`,
          textOverlay: "Oddly satisfying...",
          voiceover: "Ever watched something so smooth your brain just unclenches?",
          audioSFX: "High-definition mechanical clicks with soft stereo panning.",
        },
        {
          timestamp: "00:03 - 00:08",
          durationSec: 5,
          segment: "setup",
          visualScene: `Camera pulls back slightly to show rapid, rhythmic execution of ${game.satisfyingMoments[0] || "the core puzzle loop"}. Every snap emits a clean harmonic tone.`,
          textOverlay: "Keep watching...",
          voiceover: "No timers. No rush. Just pure alignment.",
          audioSFX: "Ascending pentatonic chimes layered over relaxing lofi chords.",
        },
        {
          timestamp: "00:08 - 00:12",
          durationSec: 4,
          segment: "escalation",
          visualScene: `The final golden piece slides effortlessly into the remaining slot. The whole screen pulses with a soft bioluminescent wave.`,
          textOverlay: "Wait for the clear!",
          voiceover: "That final piece feeling.",
          audioSFX: "Deep resonant bass drop followed by crystalline sparkle sweep.",
        },
        {
          timestamp: "00:12 - 00:15",
          durationSec: 3,
          segment: "cta_endcard",
          visualScene: `Elegant end card showing ${game.title} logo, app store rating badge, and an animated 'Play Now' button pulsing softly.`,
          textOverlay: `Download ${game.title} Free`,
          voiceover: "Tap Install to unwind now.",
          audioSFX: "Gentle chime chord and soft haptic vibration sound.",
        },
      ],
    },
    duration30s: {
      logline: (game: GameProfile) =>
        `A 30-second pacing journey taking the player through three progressive levels of escalating sensory satisfaction in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Tangled items on screen. A hand draws a smooth curve, instantly magnetizing 12 items into a perfect row.`,
          textOverlay: "Turn your sound on",
          voiceover: "Put on headphones for this one.",
          audioSFX: "Binaural crisp mechanical snaps, zero background noise.",
        },
        {
          timestamp: "00:03 - 00:09",
          durationSec: 6,
          segment: "setup",
          visualScene: `Level 1 walkthrough: Demonstrating ${game.coreMechanics[0] || "core interaction"} with zero friction. Each move clears a color quadrant.`,
          textOverlay: "Level 1: Easy flow",
          voiceover: "Start simple. Notice how every contact has custom haptic audio.",
          audioSFX: "Rhythmic percussive pops matching every finger tap.",
        },
        {
          timestamp: "00:09 - 00:17",
          durationSec: 8,
          segment: "escalation",
          visualScene: `Level 25 showcase: Intricate multi-layer layout. The player triggers a cascade where five distinct reactions trigger sequentially.`,
          textOverlay: "Level 25: The cascade",
          voiceover: "When you build up the board, a single move clears thirty pieces at once.",
          audioSFX: "Accelerating water droplet chime sequence building into warm synth chord.",
        },
        {
          timestamp: "00:17 - 00:24",
          durationSec: 7,
          segment: "climax_or_fail",
          visualScene: `Level 50 grand master board. The player executes ${game.satisfyingMoments[0] || "the ultimate clear"}. The entire arena dissolves into golden particles.`,
          textOverlay: "Pure visual zen",
          voiceover: "Over 500 levels designed specifically to relax your mind.",
          audioSFX: "Full orchestral chime swell with warm sub-bass release.",
        },
        {
          timestamp: "00:24 - 00:30",
          durationSec: 6,
          segment: "cta_endcard",
          visualScene: `Smooth 3D render of the game phone screen transitioning to the app icon and store buttons with a 'Play Free' prompt.`,
          textOverlay: `Install ${game.title} on iOS & Android`,
          voiceover: "Join 100,000+ players unwinding every evening. Tap to download free.",
          audioSFX: "Calm closing acoustic strum and subtle bubble pop.",
        },
      ],
    },
  },

  visualAssetPrompts: (game: GameProfile) => [
    {
      assetType: "gameplay_background",
      prompt: `Clean minimalist zen aesthetic gameplay background for ${game.title}, theme ${game.theme}, soft pastel color palette, warm volumetric lighting, octane render, 8k resolution, serene atmosphere, empty center for UI placement --ar 9:16`,
      negativePrompt: "cluttered, harsh shadows, dark gloomy atmosphere, text, watermark, blurry",
      aspectRatio: "9:16",
      designNotes: "Use as vertical backdrop for motion designer to animate game physics over.",
    },
    {
      assetType: "hero_character",
      prompt: `Close-up expressive 3D character for ${game.title} in ${game.visualStyle} style, peaceful relaxed expression, eyes half-closed in sensory bliss, holding a glowing puzzle piece, cinematic studio lighting, shallow depth of field --ar 1:1`,
      negativePrompt: "angry, stressed, deformed hands, ugly face, low quality, artifacting",
      aspectRatio: "1:1",
      designNotes: "Thumbstop avatar or app icon variant targeting relaxation audience.",
    },
    {
      assetType: "end_card_cta",
      prompt: `App store banner end card for mobile game ${game.title}, glowing golden stars, clean download button, cozy ambient atmosphere, ultra high fidelity UI art --ar 9:16`,
      negativePrompt: "messy, low resolution, broken text, illegible shapes",
      aspectRatio: "9:16",
      designNotes: "Last 3-second call to action screen backdrop.",
    },
  ],
};
