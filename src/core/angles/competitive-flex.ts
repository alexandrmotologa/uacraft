import { AngleDefinition } from "./base";
import { GameProfile } from "../../types";

export const competitiveFlexAngle: AngleDefinition = {
  angle: "competitive-flex",
  label: "Competitive Flex & Mastery",
  driver: "Skill expression, progression flex, status dominance, and mastery benchmarking",
  thumbstopFormula: "Split screen displaying 'Level 1 Noob' struggling at 0.5x speed vs 'Level 999 God' executing pixel-perfect combos with flashing multiplier text",
  targetPsychology: "Taps into mastery desire, status seeking, and the dopamine rush of seeing elite high-skill execution",

  hookActions: (game: GameProfile) => [
    `Split screen showing 'Level 1 Amateur' failing instantly vs 'Level 99 Master' executing ${game.coreMechanics[0] || "moves"} at lightning speed with a x50 multiplier combo.`,
    `A world ranking leaderboard popping onto screen showing the player dethroning the #1 global champion with a last-second clutch play.`,
    `A flawless speedrun sequence where every move in ${game.title} is executed within 0.1s tolerance without a single wasted frame.`,
    `A massive 100x combo meter filling the screen with golden particle fireworks and an announcer shouting 'UNSTOPPABLE!'.`,
  ],

  textOverlays: (game: GameProfile) => [
    "Top 0.1% speedrun pace",
    "Noob vs Pro vs GOD",
    "NEW SERVER RECORD!",
    "Can you beat my combo score?",
    "Level 100 gameplay hits different",
  ],

  audioDirections: (game: GameProfile) => [
    "High-energy electronic drum and bass beat building up to an explosive bass drop at the 50x combo moment.",
    "Classic arcade announcer voice: 'COMBO!', 'MEGA WIN!', 'UNSTOPPABLE!', 'GODLIKE!'.",
    "Rapid rhythmic laser/whoosh sounds on every swipe, sounding like a precision rhythm game.",
    "Triumphant victory fanfare with stadium cheering and fireworks sound effects.",
  ],

  headlineFormulas: (game: GameProfile) => [
    `Are You in the Top 1% of ${game.title}?`,
    `Climb the World Leaderboard in ${game.title}`,
    `Master the Combo Mechanics in ${game.title}`,
    `Prove Your Gaming Skills: Play ${game.title}`,
  ],

  primaryTextsShort: (game: GameProfile) => [
    `Think your reflexes are fast? Compete against real players and claim rank #1 in ${game.title}.`,
    `Only 0.1% of players have ever pulled off this 50x combo. Test your speed in ${game.title} free.`,
    `From rookie moves to god-tier combos. Download ${game.title} and conquer the global leaderboard.`,
  ],

  primaryTextsLong: (game: GameProfile) => [
    `Easy to learn, nearly impossible to truly master.\n\n` +
      `${game.title} is built for players who pride themselves on speed, precision, and tactical execution.\n\n` +
      `* Real-time global leaderboards and seasonal tournaments\n` +
      `* Frame-precise controls and unlimited combo ceilings\n` +
      `* Hundreds of skill-testing levels that never insult your intelligence\n\n` +
      `Do you have what it takes to break the server record? Tap Install Now and claim your spot at the top.`,
  ],

  scriptArchetypes: {
    duration15s: {
      logline: (game: GameProfile) =>
        `A 15-second high-adrenaline montage comparing sluggish rookie play against godly combo mastery in ${game.title}.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Split screen: Top half labeled 'NOOB' moving at a crawl and triggering ${game.failStates[0] || "a trap"}. Bottom half labeled 'GOD' moving at supersonic speed with neon trails.`,
          textOverlay: "NOOB vs PRO vs GOD",
          voiceover: "There are two types of players in this game.",
          audioSFX: "Sluggish vinyl scratch on top, high-bpm synth arpeggio on bottom.",
        },
        {
          timestamp: "00:03 - 00:08",
          durationSec: 5,
          segment: "setup",
          visualScene: `Full screen switches to the God player. Fingers executing a rapid 10-hit combo sequence of ${game.coreMechanics[0] || "actions"}. Combo counter jumps 10x, 25x, 50x.`,
          textOverlay: "50x COMBO MULTIPLIER!",
          voiceover: "The ones who tap randomly... and the ones who see the matrix.",
          audioSFX: "Rapid laser swipes and escalating combo hit sounds.",
        },
        {
          timestamp: "00:08 - 00:12",
          durationSec: 4,
          segment: "climax_or_fail",
          visualScene: `Level cleared in 4.2 seconds! Global leaderboard pops up: '#1 Global Champion' with player avatar glowing with golden laurel wreaths.`,
          textOverlay: "NEW WORLD RECORD: 4.2s",
          voiceover: "Number one in the world. Bet you can't beat that time.",
          audioSFX: "Explosive stadium cheer and gold medal chime.",
        },
        {
          timestamp: "00:12 - 00:15",
          durationSec: 3,
          segment: "cta_endcard",
          visualScene: `Metallic high-contrast end card: 'Challenge the Leaderboard'. Pulsing download button and app store rating 4.8 stars.`,
          textOverlay: `Install ${game.title} - Free Competition`,
          voiceover: "Tap Install to see where you rank.",
          audioSFX: "Punchy synth bass hit.",
        },
      ],
    },
    duration30s: {
      logline: (game: GameProfile) =>
        `A 30-second progression journey showing a player leveling up from rank 1 to champion in ${game.title}, concluding with a clutch tournament victory.`,
      beats: (game: GameProfile) => [
        {
          timestamp: "00:00 - 00:03",
          durationSec: 3,
          segment: "hook",
          visualScene: `Over-the-shoulder shot of a competitive mobile gamer in a gaming chair with high intensity lighting. Screen shows a nail-biting 1v1 arena match in ${game.title}.`,
          textOverlay: "FINAL ROUND: Match Point",
          voiceover: "Down by 200 points in the tournament finals.",
          audioSFX: "Crowd murmuring with deep tension heartbeat.",
        },
        {
          timestamp: "00:03 - 00:10",
          durationSec: 7,
          segment: "setup",
          visualScene: `Opponent rushes ahead with standard strategy. Our player waits calmly, identifying an advanced route using ${game.coreMechanics[0] || "core mechanics"}.`,
          textOverlay: "Opponent took the bait...",
          voiceover: "Everyone takes the middle path. Big mistake.",
          audioSFX: "Whoosh sound and tactical ping sound.",
        },
        {
          timestamp: "00:10 - 00:18",
          durationSec: 8,
          segment: "escalation",
          visualScene: `Player executes a high-speed flanking combination. Every move triggers a burst of ${game.satisfyingMoments[0] || "particle effects"}. Combo multiplier spikes into the red zone.`,
          textOverlay: "UNSTOPPABLE COMBO x100",
          voiceover: "Trigger the double boost, chain the three corners, and activate the overdrive.",
          audioSFX: "Heavy EDM drop with rapid arcade laser taps.",
        },
        {
          timestamp: "00:18 - 00:25",
          durationSec: 7,
          segment: "climax_or_fail",
          visualScene: `With 0.5 seconds remaining on the clock, player crosses the finish line ahead of the opponent. Screen explodes with 'VICTORY' and rank elevation to Grandmaster.`,
          textOverlay: "NEW RANK: GRANDMASTER #1",
          voiceover: "First place in the region. That is how a real gamer plays.",
          audioSFX: "Massive stadium roar and celebratory fireworks explosions.",
        },
        {
          timestamp: "00:25 - 00:30",
          durationSec: 5,
          segment: "cta_endcard",
          visualScene: `Store download card with tournament badge and prompt: 'Join Season 1 Tournament Now'.`,
          textOverlay: `Download ${game.title} - Climb The Ranks Free`,
          voiceover: "Download now and prove your skills in Season 1.",
          audioSFX: "Crisp triumphant fanfare.",
        },
      ],
    },
  },

  visualAssetPrompts: (game: GameProfile) => [
    {
      assetType: "hero_character",
      prompt: `Electrifying futuristic gaming champion avatar in ${game.visualStyle} style, wearing high-tech holographic headset, intense focused expression, blue and magenta neon rim lighting, golden championship laurel wreath, octane render 8k --ar 1:1`,
      negativePrompt: "sleepy, relaxed, blurry, dark, low quality, flat texture",
      aspectRatio: "1:1",
      designNotes: "Competitive avatar for leaderboard ads and hero banners.",
    },
    {
      assetType: "gameplay_background",
      prompt: `High-octane competitive cyber arena backdrop for ${game.title}, theme ${game.theme}, neon velocity lines, holographic score counters, crowd silhouette in background, volumetric lighting, unreal engine 5 --ar 9:16`,
      negativePrompt: "peaceful, pastel, dull, empty, low resolution",
      aspectRatio: "9:16",
      designNotes: "High-energy vertical background for speedrun and combo ads.",
    },
    {
      assetType: "end_card_cta",
      prompt: `Mobile game victory screen end card for ${game.title}, massive golden trophy cup with confetti bursts, 'CHAMPION' banner in bold metallic 3D letters, app store download buttons, high gloss finish --ar 9:16`,
      negativePrompt: "defeat, plain, muted, low resolution",
      aspectRatio: "9:16",
      designNotes: "End screen celebrating competitive achievement.",
    },
  ],
};
