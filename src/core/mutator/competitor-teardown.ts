import { AngleType, GameProfile, AdHook } from "../../types";

export interface CompetitorDeconstruction {
  competitorAdDescription: string;
  detectedAngle: AngleType;
  primaryMechanism: string;
  hookTactics: string[];
  fatigueVulnerabilities: string[];
  counterAngleStrategies: Array<{
    strategyTitle: string;
    targetAngle: AngleType;
    rationale: string;
    counterHook: AdHook;
  }>;
}

export function teardownCompetitorAd(
  competitorText: string,
  game: GameProfile
): CompetitorDeconstruction {
  const lower = competitorText.toLowerCase();

  // Detect dominant angle in competitor ad
  let detectedAngle: AngleType = "challenge-fail";
  let mechanism = "Deliberate rookie blunder prompting audience irritation";

  if (lower.includes("freeze") || lower.includes("cold") || lower.includes("baby") || lower.includes("save") || lower.includes("help")) {
    detectedAngle = "story-drama";
    mechanism = "Emotional jeopardy / survival dilemma";
  } else if (lower.includes("oddly satisfying") || lower.includes("relax") || lower.includes("clean") || lower.includes("asmr") || lower.includes("smooth")) {
    detectedAngle = "asmr-satisfying";
    mechanism = "Sensory gratification and visual flow";
  } else if (lower.includes("secret") || lower.includes("glitch") || lower.includes("trick") || lower.includes("why") || lower.includes("myth")) {
    detectedAngle = "curiosity-gap";
    mechanism = "Information gap and paradoxical logic";
  } else if (lower.includes("noob") || lower.includes("god") || lower.includes("combo") || lower.includes("rank") || lower.includes("record")) {
    detectedAngle = "competitive-flex";
    mechanism = "High skill display and leaderboard benchmarking";
  }

  const fatigueVulnerabilities: string[] = [
    `Audiences rapidly develop banner blindness to standard ${detectedAngle} tropes after 7-10 days of heavy impression frequency.`,
    "High thumbstop drop-off occurs if the opening 3 seconds feel like generic stock advertising.",
    "Viewer skepticism is elevated: users expect fake gameplay and distrust the ad claims.",
  ];

  // Generate 3 Counter-Angle Strategies for user's game
  const counterAngleStrategies = [
    {
      strategyTitle: "The Subversion Reversal",
      targetAngle: "curiosity-gap" as AngleType,
      rationale:
        "Directly subverts the competitor's opening frame. Starts like their cliché, but instantly pivots to a clever, surprising trick.",
      counterHook: {
        id: `${game.id}-counter-curiosity-01`,
        angle: "curiosity-gap" as AngleType,
        headline: `Stop Falling For The Level 4 Cliché`,
        visualAction: `Opens identical to the competitor's scenario, then a hand swipes backward, completely bypassing the trap and uncovering a hidden golden chamber in ${game.title}.`,
        textOverlay: "You are playing it all wrong...",
        audioDirection: "Suspense riser that reverses into a crystalline secret unlock chime.",
        psychologyBreakdown: "Exploits existing competitor ad familiarity, then subverts it.",
        thumbstopScoreEstimate: 92,
      },
    },
    {
      strategyTitle: "The Pure Zen Antidote",
      targetAngle: "asmr-satisfying" as AngleType,
      rationale:
        "Competitors rely on high-stress rage bait. Counter-position by offering effortless, smooth visual satisfaction.",
      counterHook: {
        id: `${game.id}-counter-asmr-02`,
        angle: "asmr-satisfying" as AngleType,
        headline: `The Relaxing Alternative to Bad Gameplay`,
        visualAction: `Clean, soothing 60 FPS alignment where ${game.coreMechanics[0]} connects with zero friction, followed by a sparkling board clear.`,
        textOverlay: "No rage bait. Just pure satisfaction.",
        audioDirection: "Binaural wood and bubble pops with gentle lofi piano.",
        psychologyBreakdown: "Appeals to tired viewers exhausted by stressful fail ads.",
        thumbstopScoreEstimate: 88,
      },
    },
    {
      strategyTitle: "The Authentic Skill Flex",
      targetAngle: "competitive-flex" as AngleType,
      rationale:
        "Expose the competitor's fake gameplay by showcasing genuine high-dexterity mechanics in your game.",
      counterHook: {
        id: `${game.id}-counter-flex-03`,
        angle: "competitive-flex" as AngleType,
        headline: `Real Physics, Real Leaderboards`,
        visualAction: `Split screen showing the competitor's sluggish blunder on top labeled 'Fake Ads' vs genuine fast combo execution on bottom labeled 'Actual Gameplay in ${game.title}'.`,
        textOverlay: "What if mobile games were actually good?",
        audioDirection: "Record scratch on top followed by an aggressive EDM bass drop on bottom.",
        psychologyBreakdown: "Honesty bias: validates player cynicism towards fake ads.",
        thumbstopScoreEstimate: 95,
      },
    },
  ];

  return {
    competitorAdDescription: competitorText,
    detectedAngle,
    primaryMechanism: mechanism,
    hookTactics: [
      "Rapid visual conflict in first 1.2s",
      "Exaggerated emotional contrast",
      "Immediate call to download to fix the mistake",
    ],
    fatigueVulnerabilities,
    counterAngleStrategies,
  };
}
