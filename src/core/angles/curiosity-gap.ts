import { AngleDefinition } from "./base";
import { GameProfile } from "../../types";

export const curiosityGapAngle: AngleDefinition = {
  angle: "curiosity-gap",
  label: "Curiosity Gap & Inverted Logic",
  driver: "Information gap theory, paradoxical setups, unexpected mechanics, and discovery",
  thumbstopFormula: "A bizarre or seemingly counter-intuitive setup presented within 1 second that defies normal game expectations",
  targetPsychology: "Leverages Lowenstein's information gap theory: the brain cannot tolerate incomplete logic loops and demands resolution",

  hookActions: (game: GameProfile) => [
    `A player doing the exact opposite of what instructions say: instead of dodging hazards, they funnel all hazards into the goal, triggering an unexpected golden reaction.`,
    `A strange, locked secret chamber with glowing runes in ${game.title} that none of the tutorial videos ever revealed.`,
    `Testing a viral rumor: 'What happens if you combine ${game.coreMechanics[0] || "mechanic A"} with ${game.coreMechanics[1] || "mechanic B"}?'`,
    `An impossible-looking level layout where every apparent exit is sealed, until an unusual tap reveals a hidden pathway.`,
  ],

  textOverlays: (game: GameProfile) => [
    "Wait, that actually works?!",
    "Nobody told me about this secret trick",
    "Is this a glitch or intended?",
    "What happens when you do this?",
    "I tested the viral level 50 myth",
  ],

  audioDirections: (game: GameProfile) => [
    "Mysterious high-pass synthesizer riser that suddenly cuts out into dead silence right before the reveal.",
    "Curious xylophone and plucked cello arpeggio building an atmosphere of playful intrigue.",
    "Dramatic reality show sound cue: deep bass drop followed by an eerie reversed cymbal crash.",
    "Voiceover whispering conspiratorially: 'Almost nobody knows you can do this...'",
  ],

  headlineFormulas: (game: GameProfile) => [
    `The Hidden Trick in ${game.title}`,
    `Did the Developers Hide This on Purpose?`,
    `The Secret Strategy in ${game.title}`,
    `Why Everyone Is Playing ${game.title} Backwards`,
  ],

  primaryTextsShort: (game: GameProfile) => [
    `Most people play this game forward. Watch what happens when you flip the strategy in ${game.title}.`,
    `The developers never advertised this hidden mechanic. Discover it in ${game.title} today.`,
    `Is level 30 really impossible, or are you just using the wrong logic? Try ${game.title} free.`,
  ],

  primaryTextsLong: (game: GameProfile) => [
    `There is a reason why millions of puzzle fans are debating this level.\n\n` +
      `At first glance, ${game.title} looks like standard ${game.genre}. But once you unlock the inverted physics mechanics, everything changes.\n\n` +
      `* Hidden easter eggs in every chapter\n` +
      `* Multi-solution puzzle design that rewards out-of-the-box thinking\n` +
      `* Over 200 branching puzzle outcomes\n\n` +
      `Can you spot the solution before the video loops? Download free now on mobile.`,
  ],

  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) =>
        `A 15-second discovery hook revealing an unorthodox trick that completely bypasses a known difficult level in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Close up on a complex level in ${game.title}. On-screen text: 'The secret trick devs tried to patch'. Finger taps an obscure background element instead of the main hazard.`,
          textOverlay: "Wait, that actually works?!",
          voiceover: "I swear 99% of people have no idea you can do this.",
          audioSFX: "Subtle electronic glissando and curious mystery bell.",
        },
        {
          timestamp: "00:03 - 00:08",
          durationSec: 5,
          segment: "setup",
          visualScene: `The hidden element triggers a chain reaction: ${game.coreMechanics[0] || "the main pieces"} rearrange themselves into an instant shortcut.`,
          textOverlay: "Watch the secret path open...",
          voiceover: "Instead of fighting the hazards, tap the corner three times.",
          audioSFX: "Mechanical clockwork gears clicking and unlocking chime.",
        },
        {
          timestamp: "00:08 - 00:12",
          durationSec: 4,
          segment: "climax_or_fail",
          visualScene: `Level clears instantly with 3 golden stars and a bonus secret reward chest opening with a rare animation.`,
          textOverlay: "Instant 3-Star Clear!",
          voiceover: "Boom. Solved in three seconds flat.",
          audioSFX: "Magical chest opening sparkle burst and crowd applause.",
        },
        {
          timestamp: "00:12 - 00:15",
          durationSec: 3,
          segment: "cta_endcard",
          visualScene: `End card displaying ${game.title} with prompt: 'Test it yourself on Level 12'. Install button pulsing.`,
          textOverlay: `Try The Glitch in ${game.title} - Download Free`,
          voiceover: "Download now and try it before it gets patched.",
          audioSFX: "Crisp phone notification tap.",
        },
      ],
    },
    duration30s: {
      logline: (game: GameProfile) =>
        `A 30-second investigative format debunking whether the hardest puzzle in ${game.title} is genuinely impossible.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `A forum screenshot claiming 'Level 40 cannot be beaten without paying'. Game screen shows the intimidating level layout.`,
          textOverlay: "Is Level 40 a scam?",
          voiceover: "Everyone on Reddit said Level 40 was impossible without paying.",
          audioSFX: "Dramatic documentary suspense drone.",
        },
        {
          timestamp: "00:03 - 00:10",
          durationSec: 7,
          segment: "setup",
          visualScene: `The player tests the standard obvious path: moves ${game.coreMechanics[0] || "the first unit"} directly forward. Result: blocked by heavy gates.`,
          textOverlay: "Standard attempt: BLOCKED",
          voiceover: "When you try the standard strategy, you get walled off every single time.",
          audioSFX: "Heavy iron door slamming shut with low bass echo.",
        },
        {
          timestamp: "00:10 - 00:18",
          durationSec: 8,
          segment: "escalation",
          visualScene: `The player pauses. They study the environment, noticing a subtle visual hint in ${game.visualStyle} artwork. They trigger ${game.coreMechanics[1] || "the secondary mechanic"} in reverse.`,
          textOverlay: "Notice the subtle clue?",
          voiceover: "Look at the lighting in the top corner. What happens if we reverse the flow?",
          audioSFX: "Mysterious wind chime and rising tension harmonic tone.",
        },
        {
          timestamp: "00:18 - 00:25",
          durationSec: 7,
          segment: "climax_or_fail",
          visualScene: `The reverse flow bypasses the wall entirely, triggering ${game.satisfyingMoments[0] || "a massive chain reaction"} that wins the level without a single penny spent.`,
          textOverlay: "SOLVED WITH ZERO SPEND!",
          voiceover: "It wasn't pay-to-win at all. It was just a brilliant hidden puzzle.",
          audioSFX: "Triumphant fanfare with cascading coin showers.",
        },
        {
          timestamp: "00:25 - 00:30",
          durationSec: 5,
          segment: "cta_endcard",
          visualScene: `App showcase with challenge prompt: 'Can you solve Chapters 1-5?'`,
          textOverlay: `Play ${game.title} Free on iOS & Android`,
          voiceover: "Download now and test your wits against the secret levels.",
          audioSFX: "Cheerful app store confirmation sound.",
        },
      ],
    },
  },

  visualAssetPrompts: (game: GameProfile) => [
    {
      assetType: "gameplay_background",
      prompt: `Intriguing mysterious temple vault for ${game.title}, theme ${game.theme}, ancient glowing mechanisms, mystical fog, cinematic lighting, hidden doors slightly ajar with golden light leaking out, octane render, 8k --ar 9:16`,
      negativePrompt: "low detail, flat 2d, watermark, blurry, overexposed",
      aspectRatio: "9:16",
      designNotes: "Visual backdrop for curiosity and secret trick hooks.",
    },
    {
      assetType: "hero_character",
      prompt: `3D stylized character in ${game.visualStyle} inspecting an ancient glowing riddle with a magnifying glass, thoughtful curious expression, vibrant colors, ray traced reflections --ar 1:1`,
      negativePrompt: "angry, low quality, dark, scary, horror, photorealistic",
      aspectRatio: "1:1",
      designNotes: "Curiosity avatar for thumbnails and ads.",
    },
    {
      assetType: "app_icon_variant",
      prompt: `App icon design for ${game.title}, featuring a glowing golden puzzle key unlocking a mysterious vault door, vibrant saturated colors, glossy 3D mobile game icon style, rounded corners --ar 1:1`,
      negativePrompt: "flat, low detail, text, noisy background",
      aspectRatio: "1:1",
      designNotes: "High-CTR icon variant testing secret and discovery themes.",
    },
  ],
};
