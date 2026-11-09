import { AngleDefinition } from "./base";
import { GameProfile } from "../../types";

export const challengeFailAngle: AngleDefinition = {
  angle: "challenge-fail",
  label: "Challenge & Rage Bait (Deliberate Fail)",
  driver: "Cognitive itch to correct an obvious mistake, ego activation, and competitive defiance",
  thumbstopFormula: "A player hesitating between two obvious choices and selecting the catastrophic one within 1.5 seconds, triggering an immediate buzzer fail sound",
  targetPsychology: "Creates mild irritation and intellectual superiority in the viewer, compelling them to download the game to prove they can easily solve it",

  hookActions: (game: GameProfile) => [
    `Hand hovering over two paths: the correct path is flashing green, but the player inexplicably taps the flaming hazard, causing ${game.failStates[0] || "immediate catastrophe"}.`,
    `Player is one single move away from winning level 12, then pulls the wrong element and dumps all progress into a pit.`,
    `Split screen comparison labeled 'My Mom (IQ 140)' solving cleanly vs 'Me (IQ 60)' creating an immediate fiery disaster.`,
    `Countdown timer ticking from 03 to 00 while the player frantically swipes in the exact opposite direction of safety.`,
  ],

  textOverlays: (game: GameProfile) => [
    "WHY did he pull that one?!",
    "99% fail on level 4",
    "My brain actually hurts watching this",
    "Bro had ONE job...",
    "Bet you can't solve this on first try",
  ],

  audioDirections: (game: GameProfile) => [
    "Sharp comic record scratch at the blunder, followed by a loud double buzzer sound 'WOMP WOMP'.",
    "Ticking bomb heartbeat sound accelerating rapidly, ending in a dramatic shattering glass crash.",
    "Comedic fail flute / sad trombone glissando synced to the fail screen splash.",
    "Voiceover gasping with genuine exasperation: 'Wait wait no, not that one!'",
  ],

  headlineFormulas: (game: GameProfile) => [
    `Can You Beat Level 5 in ${game.title}?`,
    `Only 1% Can Reach Stage 10`,
    `Stop Making This Rookie Mistake in ${game.title}`,
    `Prove You Have 120+ IQ: Play ${game.title}`,
  ],

  primaryTextsShort: (game: GameProfile) => [
    `Think you can do better than this gameplay? Put your logic to the test in ${game.title}.`,
    `99% of people fail before level 7. Download free and prove you are in the top 1%.`,
    `Don't pull the wrong pin! Test your problem solving skills in ${game.title} today.`,
  ],

  primaryTextsLong: (game: GameProfile) => [
    `Most players fail this exact challenge within their first three minutes.\n\n` +
      `${game.title} looks deceptively simple, but one wrong move triggers ${game.failStates[0] || "total chaos"}.\n\n` +
      `* Over 300 logic-bending puzzles\n` +
      `* Real consequences for reckless swipes\n` +
      `* No fake levels: what you see is what you play\n\n` +
      `Think you can outsmart level 5? Tap Install and show everyone how it is done.`,
  ],

  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) =>
        `A 15-second rage-inducing gameplay clip where a glaringly obvious win is ruined by a last-second foolish move.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Level 8 board in ${game.title}. The solution is 99% complete. A hand pointer hesitates, then deliberately triggers ${game.failStates[0] || "the worst hazard"}.`,
          textOverlay: "WHY WOULD YOU DO THAT?!",
          voiceover: "No no no! Not the left one!",
          audioSFX: "Urgent ticking clock followed by screeching brakes SFX.",
        },
        {
          timestamp: "00:03 - 00:08",
          durationSec: 5,
          segment: "setup",
          visualScene: `Slow motion replay of the disaster unfolding. Lava or hazards cascade everywhere while an avatar makes a comically crying face.`,
          textOverlay: "Level 8 FAILED",
          voiceover: "Every single time my brother plays, he picks the hazard.",
          audioSFX: "Double game-over buzzer and clown horn.",
        },
        {
          timestamp: "00:08 - 00:12",
          durationSec: 4,
          segment: "climax_or_fail",
          visualScene: `Hand restarts level, demonstrates the obvious, smooth, single-swipe winning move that clears the board in half a second.`,
          textOverlay: "It was literally THIS easy...",
          voiceover: "It is so simple! How do people mess this up?",
          audioSFX: "Satisfying ding and triumphant trumpet note.",
        },
        {
          timestamp: "00:12 - 00:15",
          durationSec: 3,
          segment: "cta_endcard",
          visualScene: `Dynamic end screen: 'Can you reach level 20?' with animated finger pointing to the Install button.`,
          textOverlay: `Play ${game.title} Free - Prove You Can Win`,
          voiceover: "Tap to download and show us how you solve it.",
          audioSFX: "Upbeat arcade jingle.",
        },
      ],
    },
    duration30s: {
      logline: (game: GameProfile) =>
        `A 30-second escalating challenge showcase comparing novice mistakes against the true pro solution across three puzzles in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Side-by-side gameplay: 'Boyfriend (IQ 75)' vs 'Girlfriend (IQ 140)'. Boyfriend immediately causes an explosion.`,
          textOverlay: "Who played worse?",
          voiceover: "My boyfriend claimed this game was impossible.",
          audioSFX: "Loud fail buzzer and laugh track snippet.",
        },
        {
          timestamp: "00:03 - 00:10",
          durationSec: 7,
          segment: "setup",
          visualScene: `Breakdown of Level 14: He tries ${game.coreMechanics[0] || "the first mechanic"} without checking the traps. Result: ${game.failStates[0] || "immediate defeat"}.`,
          textOverlay: "Mistake #1: Rushing the timer",
          voiceover: "He rushed right in and didn't even notice the trapdoor.",
          audioSFX: "Cartoon slipping sound and crash cymbal.",
        },
        {
          timestamp: "00:10 - 00:18",
          durationSec: 8,
          segment: "escalation",
          visualScene: `Girlfriend takes the screen. She tactically sequences ${game.coreMechanics[0] || "actions"} and redirects hazards away from the objective.`,
          textOverlay: "The Pro Strategy",
          voiceover: "Watch this. Clear the hazard first, then release the reward.",
          audioSFX: "Swift whoosh sounds and ascending positive chime bells.",
        },
        {
          timestamp: "00:18 - 00:25",
          durationSec: 7,
          segment: "climax_or_fail",
          visualScene: `Sudden Level 20 cliffhanger: Huge puzzle with multi-tier chambers and five seconds on the clock. Finger stops right before the final decision.`,
          textOverlay: "Left or Right? 99% get this wrong",
          voiceover: "Now level 20... which one would you pull right here?",
          audioSFX: "Heartbeat thumping with rising tension Shepard tone.",
        },
        {
          timestamp: "00:25 - 00:30",
          durationSec: 5,
          segment: "cta_endcard",
          visualScene: `Store download card with app store rating stars and high score challenge badge.`,
          textOverlay: `Install ${game.title} - Free on Mobile`,
          voiceover: "Tap Install now and see if your logic holds up.",
          audioSFX: "Crisp confirmation chime.",
        },
      ],
    },
  },

  visualAssetPrompts: (game: GameProfile) => [
    {
      assetType: "fail_screen_overlay",
      prompt: `Mobile game dramatic defeat screen in ${game.visualStyle} style, bold red typography 'DEFEAT' with glowing warning lights, comic smoke puffs, comedic disappointed character avatar facepalm, crisp 3D asset render on dark gradient --ar 9:16`,
      negativePrompt: "low quality, dull colors, realistic blood, gore, depressing, photo",
      aspectRatio: "9:16",
      designNotes: "Overlaid at the climax beat when the deliberate mistake occurs.",
    },
    {
      assetType: "hero_character",
      prompt: `3D character mascot for ${game.title} expressing extreme comic shock and panic, eyes wide, mouth open, hands on head, high saturation vibrant cartoon style, cinematic lighting --ar 1:1`,
      negativePrompt: "calm, normal, realistic, muted colors, dark",
      aspectRatio: "1:1",
      designNotes: "Reaction avatar for split-screen comparison ads.",
    },
    {
      assetType: "end_card_cta",
      prompt: `Aggressive competitive end card graphic for mobile game ${game.title}, red vs blue contrast, large golden trophy, bold text banner 'CAN YOU BEAT THIS?', app store badges --ar 9:16`,
      negativePrompt: "subtle, sleepy, plain background, blurry text",
      aspectRatio: "9:16",
      designNotes: "End screen prompting competitive download.",
    },
  ],
};
