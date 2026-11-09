import { AngleDefinition } from "./base";
import { GameProfile } from "../../types";

export const storyDramaAngle: AngleDefinition = {
  angle: "story-drama",
  label: "Storyline & Character Dilemma",
  driver: "Emotional empathy, rescue stakes, dramatic dilemmas, and urgent consequence timers",
  thumbstopFormula: "A character shivering in distress or facing imminent betrayal with a 5-second countdown timer and two life-altering choices",
  targetPsychology: "Activates maternal/paternal protection instinct and emotional investment through relatable dramatic jeopardy",

  hookActions: (game: GameProfile) => [
    `A shivering mother and child huddled in a rundown cabin with broken windows, blizzard winds howling inside while a fireplace is blocked by ${game.coreMechanics[0] || "puzzles"}.`,
    `A sudden wedding disaster scene: the bride discovers a betrayal on her phone and flees into a stormy forest where she must solve puzzles to find shelter.`,
    `Dramatic countdown timer: 00:05... 00:04... while the hero is trapped in a rising chamber with water or frost closing in fast.`,
    `A helpless pet or cute sidekick trapped behind complex barriers, looking tearfully into the camera as hazards approach.`,
  ],

  textOverlays: (game: GameProfile) => [
    "Help them survive the night!",
    "Choice A or Choice B?",
    "Worst mistake of her life...",
    "Don't let them freeze!",
    "Only 5 seconds to decide!",
  ],

  audioDirections: (game: GameProfile) => [
    "Howling winter blizzard winds mixed with the urgent, heavy acoustic rhythm of a ticking grandfather clock.",
    "Dramatic cinematic cello and piano chords with a sudden thunderclap accentuating the dilemma.",
    "Heart monitor beeping rapidly, flatlining if the incorrect choice is previewed.",
    "Voiceover pleading with emotional urgency: 'Hurry, she can't hold on much longer!'",
  ],

  headlineFormulas: (game: GameProfile) => [
    `Can You Save Them in ${game.title}?`,
    `Make the Right Choice in ${game.title}`,
    `Their Survival Depends on You: ${game.title}`,
    `Choose Their Fate: Play ${game.title} Free`,
  ],

  primaryTextsShort: (game: GameProfile) => [
    `Every choice has a consequence. Will you save them or make things worse in ${game.title}?`,
    `A frozen cabin, broken windows, zero warmth. Test your wits to fix their home in ${game.title}.`,
    `Help rebuild their lives one puzzle at a time. Play ${game.title} free on mobile today.`,
  ],

  primaryTextsLong: (game: GameProfile) => [
    `They were left with nothing in the freezing cold.\n\n` +
      `In ${game.title}, every puzzle you solve brings shelter, warmth, and hope back to their world.\n\n` +
      `* Deep emotional storyline with branching outcomes\n` +
      `* Hundreds of home renovation and survival puzzles\n` +
      `* Meaningful choices that change how the story unfolds\n\n` +
      `Will you leave them in the storm, or guide them to safety? Tap Install Now to begin their journey.`,
  ],

  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) =>
        `A 15-second survival rescue hook showing an urgent choice between two tools to save characters from freezing temperatures in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Dilapidated room in ${game.theme} setting. Frost creeping up the walls. Characters huddled shivering under a thin blanket. Giant prompt: 'Fix window or light fire?'`,
          textOverlay: "HELP THEM BEFORE THEY FREEZE!",
          voiceover: "It is minus twenty degrees outside and the window just shattered.",
          audioSFX: "Violent wind howling and teeth chattering sounds.",
        },
        {
          timestamp: "00:03 - 00:08",
          durationSec: 5,
          segment: "setup",
          visualScene: `Player selects 'Light Fire' with a blowtorch, but uses it recklessly, catching the sofa on fire. Room turns from ice to smoke disaster.`,
          textOverlay: "NO! Wrong tool!",
          voiceover: "Wait, you were supposed to fix the glass first!",
          audioSFX: "Fire whoosh, smoke alarm, and comedic panicking squeaks.",
        },
        {
          timestamp: "00:08 - 00:12",
          durationSec: 4,
          segment: "climax_or_fail",
          visualScene: `Quick rewind animation! Player correctly selects wooden planks, hammers them over the window with 3 crisp rhythmic taps, then gently lights a safe hearth.`,
          textOverlay: "Warmth Restored!",
          voiceover: "That is how you save a family.",
          audioSFX: "Clean hammer strikes, crackling warm fire, and relieved sigh.",
        },
        {
          timestamp: "00:12 - 00:15",
          durationSec: 3,
          segment: "cta_endcard",
          visualScene: `Happy characters smiling by the fire in a cozy renovated room. App logo with 'Save Them Now' download button.`,
          textOverlay: `Download ${game.title} Free`,
          voiceover: "Tap Install to help rebuild their story.",
          audioSFX: "Warm closing harp arpeggio.",
        },
      ],
    },
    duration30s: {
      logline: (game: GameProfile) =>
        `A 30-second dramatic makeover and puzzle journey tracking an abandoned character turning a ruined ruin into a thriving sanctuary in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Dramatic rain pouring. Character holding a soaked suitcase at the doorstep of a crumbling manor. Letter in hand says 'Eviction Notice'.`,
          textOverlay: "She was left with NOTHING...",
          voiceover: "She lost everything in one single afternoon.",
          audioSFX: "Heavy thunderclap and melancholic piano progression.",
        },
        {
          timestamp: "00:03 - 00:10",
          durationSec: 7,
          segment: "setup",
          visualScene: `Inside the manor: spiderwebs, broken floorboards, leaking roof. Player must solve ${game.coreMechanics[0] || "first puzzle"} to clear the entrance.`,
          textOverlay: "Chapter 1: Clear the debris",
          voiceover: "To clean the entrance, she has to solve the old mansion locks.",
          audioSFX: "Wood creaking, spider scuttle, and crisp puzzle solving clicks.",
        },
        {
          timestamp: "00:10 - 00:18",
          durationSec: 8,
          segment: "escalation",
          visualScene: `Rapid montage of progression: solving ${game.coreMechanics[0] || "puzzles"} unlocks paints, carpets, and grand chandeliers. Room transforms before our eyes.`,
          textOverlay: "Room by room renovation!",
          voiceover: "Each stage you complete unlocks designer furniture and new story chapters.",
          audioSFX: "Sparkling transformation magic swooshes and upbeat acoustic music.",
        },
        {
          timestamp: "00:18 - 00:25",
          durationSec: 7,
          segment: "climax_or_fail",
          visualScene: `Sudden knock at the door! The ex-partner who abandoned her arrives, looking shocked at the gorgeous luxury estate. A choice appears: 'Forgive or Slam Door?'`,
          textOverlay: "Forgive or Revenge?",
          voiceover: "Now he wants back in... What would you choose?",
          audioSFX: "Dramatic soap opera brass hit and suspense string tremolo.",
        },
        {
          timestamp: "00:25 - 00:30",
          durationSec: 5,
          segment: "cta_endcard",
          visualScene: `Interactive hand hovering over 'Slam Door'. Download card with high rating score and app buttons.`,
          textOverlay: `Play ${game.title} - Your Choices Matter`,
          voiceover: "Download free and decide her fate for yourself.",
          audioSFX: "Door slamming sound followed by celebratory fanfare.",
        },
      ],
    },
  },

  visualAssetPrompts: (game: GameProfile) => [
    {
      assetType: "hero_character",
      prompt: `Dramatic 3D character in ${game.visualStyle} style, shivering in a thin coat during a blizzard, expressive tearful eyes, holding a lantern, cinematic emotional lighting, high emotional engagement, unreal engine 5 render --ar 1:1`,
      negativePrompt: "happy, smiling, deformed limbs, low quality, flat texture",
      aspectRatio: "1:1",
      designNotes: "Thumbstop avatar or icon targeting high emotional empathy audiences.",
    },
    {
      assetType: "gameplay_background",
      prompt: `Dilapidated rustic room in freezing winter for ${game.title}, theme ${game.theme}, broken glass windows with frost patterns, snow accumulating on wooden floor, cold blue volumetric fog, dramatic cinematic mood --ar 9:16`,
      negativePrompt: "sunny, warm, modern, clean, plain background",
      aspectRatio: "9:16",
      designNotes: "Survival stage background for motion designers.",
    },
    {
      assetType: "end_card_cta",
      prompt: `Cozy glowing fireplace in a luxury renovated room, golden light, festive garlands, before-and-after split banner, download button 'Rescue Now', high quality mobile game ad asset --ar 9:16`,
      negativePrompt: "ugly, cold, dark, low resolution, messy text",
      aspectRatio: "9:16",
      designNotes: "Reward end screen for emotional satisfaction payoff.",
    },
  ],
};
