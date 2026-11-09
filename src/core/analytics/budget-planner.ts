import { AngleType, AngleTypeLabels } from "../../types";

export interface BudgetPlanInput {
  weeklyBudget: number;
  targetCpi: number;
  platform?: "meta" | "tiktok" | "google";
  minConversionsForLearning?: number; // default: 50 for Meta/TikTok
  confidenceSampleInstalls?: number; // default: 100 for A/B confidence
}

export interface AngleAllocation {
  angle: AngleType;
  label: string;
  sharePercentage: number;
  weeklyBudget: number;
  dailyBudget: number;
  estimatedInstallsWeekly: number;
  role: "scale_winner" | "explore_new";
}

export interface BudgetPlanResult {
  weeklyBudget: number;
  dailyBudget: number;
  targetCpi: number;
  platform: string;
  totalEstimatedInstallsWeekly: number;
  maxParallelAdSets: number;
  maxVariantsInParallel: number;
  recommendedDailyBudgetPerAdSet: number;
  minTestingDaysForConfidence: number;
  angleAllocations: AngleAllocation[];
  warnings: string[];
  strategicAdvice: string[];
}

export function calculateBudgetPlan(input: BudgetPlanInput): BudgetPlanResult {
  const weeklyBudget = input.weeklyBudget;
  const targetCpi = Math.max(0.1, input.targetCpi);
  const platform = input.platform || "meta";
  const minConversions = input.minConversionsForLearning || 50;
  const confidenceSample = input.confidenceSampleInstalls || 100;

  const dailyBudget = Math.round((weeklyBudget / 7) * 100) / 100;
  const totalEstimatedInstallsWeekly = Math.floor(weeklyBudget / targetCpi);

  // Minimum weekly spend required per ad set to exit learning phase = 50 * targetCpi
  const minWeeklySpendPerAdSet = minConversions * targetCpi;

  // Max ad sets that can exit learning phase without getting stuck in Learning Limited
  const maxParallelAdSets = Math.max(
    1,
    Math.floor(weeklyBudget / minWeeklySpendPerAdSet)
  );

  // Each ad set can test 2-3 creative variations before delivery skews 100% to one
  const maxVariantsInParallel = maxParallelAdSets * 3;

  const recommendedDailyBudgetPerAdSet = Math.max(
    Math.round((minWeeklySpendPerAdSet / 7) * 100) / 100,
    Math.round((dailyBudget / maxParallelAdSets) * 100) / 100
  );

  // Days needed to get 100 installs per test variant
  const dailyInstallsPerVariant = Math.max(
    1,
    (recommendedDailyBudgetPerAdSet / targetCpi) / 2
  );
  const minTestingDaysForConfidence = Math.min(
    14,
    Math.max(4, Math.ceil(confidenceSample / dailyInstallsPerVariant))
  );

  const warnings: string[] = [];
  if (weeklyBudget < minWeeklySpendPerAdSet) {
    warnings.push(
      `Weekly budget ($${weeklyBudget}) is below the platform threshold ($${minWeeklySpendPerAdSet.toFixed(
        2
      )}) needed for even ONE ad set to exit the ${platform.toUpperCase()} Learning Phase (requires ${minConversions} installs @ $${targetCpi}).`
    );
  }

  // 70/30 Budget allocation rule: 70% on proven angles, 30% on exploratory angles
  const angleAllocations: AngleAllocation[] = [
    {
      angle: "asmr-satisfying",
      label: AngleTypeLabels["asmr-satisfying"],
      sharePercentage: 35,
      weeklyBudget: Math.round(weeklyBudget * 0.35),
      dailyBudget: Math.round((weeklyBudget * 0.35) / 7),
      estimatedInstallsWeekly: Math.floor((weeklyBudget * 0.35) / targetCpi),
      role: "scale_winner",
    },
    {
      angle: "challenge-fail",
      label: AngleTypeLabels["challenge-fail"],
      sharePercentage: 35,
      weeklyBudget: Math.round(weeklyBudget * 0.35),
      dailyBudget: Math.round((weeklyBudget * 0.35) / 7),
      estimatedInstallsWeekly: Math.floor((weeklyBudget * 0.35) / targetCpi),
      role: "scale_winner",
    },
    {
      angle: "curiosity-gap",
      label: AngleTypeLabels["curiosity-gap"],
      sharePercentage: 10,
      weeklyBudget: Math.round(weeklyBudget * 0.1),
      dailyBudget: Math.round((weeklyBudget * 0.1) / 7),
      estimatedInstallsWeekly: Math.floor((weeklyBudget * 0.1) / targetCpi),
      role: "explore_new",
    },
    {
      angle: "story-drama",
      label: AngleTypeLabels["story-drama"],
      sharePercentage: 10,
      weeklyBudget: Math.round(weeklyBudget * 0.1),
      dailyBudget: Math.round((weeklyBudget * 0.1) / 7),
      estimatedInstallsWeekly: Math.floor((weeklyBudget * 0.1) / targetCpi),
      role: "explore_new",
    },
    {
      angle: "competitive-flex",
      label: AngleTypeLabels["competitive-flex"],
      sharePercentage: 10,
      weeklyBudget: Math.round(weeklyBudget * 0.1),
      dailyBudget: Math.round((weeklyBudget * 0.1) / 7),
      estimatedInstallsWeekly: Math.floor((weeklyBudget * 0.1) / targetCpi),
      role: "explore_new",
    },
  ];

  const strategicAdvice: string[] = [
    `Limit active ad sets to maximum ${maxParallelAdSets} simultaneously. Spreading budget across more than ${maxParallelAdSets} ad sets risks trapping campaigns in "Learning Limited".`,
    `Do not add more than 3 active creative variations into the same ad set. Meta's delivery algorithm allocates 85%+ of spend to the first winner within 48 hours.`,
    `Allow each creative test to run for at least ${minTestingDaysForConfidence} full days before making pausing or scaling decisions. Pausing earlier introduces day-of-week conversion bias.`,
    `Follow the 70/30 rule: allocate 70% ($${Math.round(
      weeklyBudget * 0.7
    )}) to proven low-CPI angles, and 30% ($${Math.round(
      weeklyBudget * 0.3
    )}) to test new creative angles.`,
  ];

  return {
    weeklyBudget,
    dailyBudget,
    targetCpi,
    platform: platform.toUpperCase(),
    totalEstimatedInstallsWeekly,
    maxParallelAdSets,
    maxVariantsInParallel,
    recommendedDailyBudgetPerAdSet,
    minTestingDaysForConfidence,
    angleAllocations,
    warnings,
    strategicAdvice,
  };
}
