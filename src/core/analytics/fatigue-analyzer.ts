import {
  AngleType,
  AngleTypeLabels,
  FatigueAnalysisResult,
  FatigueAngleStatus,
  PerformanceMetricRecord,
  PerformanceMetricRecordSchema,
} from "../../types";
import { getAllAngleTypes } from "../angles";

export interface FatigueThresholds {
  minThumbstopRate?: number; // e.g. 24%
  minCtr?: number; // e.g. 1.8%
  maxCpi?: number; // e.g. $2.80
  fatigueDaysThreshold?: number; // e.g. 12 days
}

export function analyzeCreativeFatigue(
  records: unknown[],
  thresholds: FatigueThresholds = {}
): FatigueAnalysisResult {
  const minThumbstop = thresholds.minThumbstopRate ?? 24;
  const minCtr = thresholds.minCtr ?? 1.8;
  const maxCpi = thresholds.maxCpi ?? 2.8;
  const maxDays = thresholds.fatigueDaysThreshold ?? 12;

  // Validate incoming records
  const validatedRecords: PerformanceMetricRecord[] = records.map((r) =>
    PerformanceMetricRecordSchema.parse(r)
  );

  const totalAdsAnalyzed = validatedRecords.length;
  const totalSpend = validatedRecords.reduce((sum, r) => sum + r.spend, 0);

  const angleMap: Record<AngleType, PerformanceMetricRecord[]> = {
    "asmr-satisfying": [],
    "challenge-fail": [],
    "curiosity-gap": [],
    "story-drama": [],
    "competitive-flex": [],
  };

  validatedRecords.forEach((r) => {
    if (angleMap[r.angle]) {
      angleMap[r.angle].push(r);
    }
  });

  const allAngles = getAllAngleTypes();
  const angleBreakdown: Record<AngleType, FatigueAngleStatus> = {} as any;
  const fatiguedAngles: AngleType[] = [];
  const recommendedAnglesToScale: AngleType[] = [];
  const recommendedAnglesToProduce: AngleType[] = [];

  for (const angle of allAngles) {
    const list = angleMap[angle];
    const adCount = list.length;
    const label = AngleTypeLabels[angle];

    if (adCount === 0) {
      angleBreakdown[angle] = {
        angle,
        label,
        adCount: 0,
        totalSpend: 0,
        averageCtr: 0,
        averageHookRate: 0,
        averageCpi: 0,
        fatigueScore: 0,
        status: "fresh",
        reason: "No ad spend recorded yet. Untapped creative opportunity.",
      };
      recommendedAnglesToProduce.push(angle);
      continue;
    }

    const spend = list.reduce((s, r) => s + r.spend, 0);
    const avgCtr = list.reduce((s, r) => s + r.ctr, 0) / adCount;
    const avgHook = list.reduce((s, r) => s + r.thumbstopRate3s, 0) / adCount;
    const avgCpi = list.reduce((s, r) => s + r.cpi, 0) / adCount;
    const avgDays = list.reduce((s, r) => s + r.daysActive, 0) / adCount;

    // Calculate fatigue score (0 to 100)
    let score = 0;
    const reasons: string[] = [];

    if (avgHook < minThumbstop) {
      score += 35;
      reasons.push(`Low 3s thumbstop rate (${avgHook.toFixed(1)}% < ${minThumbstop}%)`);
    }
    if (avgCtr < minCtr) {
      score += 30;
      reasons.push(`Low click-through rate (${avgCtr.toFixed(2)}% < ${minCtr}%)`);
    }
    if (avgCpi > maxCpi) {
      score += 25;
      reasons.push(`Elevated CPI ($${avgCpi.toFixed(2)} > $${maxCpi.toFixed(2)})`);
    }
    if (avgDays > maxDays) {
      score += 15;
      reasons.push(`Creative active for ${avgDays.toFixed(0)} days on average`);
    }

    score = Math.min(100, score);

    let status: "fresh" | "healthy" | "warning" | "fatigued" = "healthy";
    if (score >= 60) {
      status = "fatigued";
      fatiguedAngles.push(angle);
    } else if (score >= 35) {
      status = "warning";
    } else {
      status = "healthy";
      if (spend > 0 && avgCtr >= minCtr && avgHook >= minThumbstop) {
        recommendedAnglesToScale.push(angle);
      }
    }

    angleBreakdown[angle] = {
      angle,
      label,
      adCount,
      totalSpend: Math.round(spend * 100) / 100,
      averageCtr: Math.round(avgCtr * 100) / 100,
      averageHookRate: Math.round(avgHook * 10) / 10,
      averageCpi: Math.round(avgCpi * 100) / 100,
      fatigueScore: score,
      status,
      reason: reasons.length > 0 ? reasons.join("; ") : "Strong performance metrics across all benchmarks.",
    };
  }

  // Action items
  const actionItems: string[] = [];
  if (fatiguedAngles.length > 0) {
    const names = fatiguedAngles.map((a) => AngleTypeLabels[a]).join(", ");
    actionItems.push(
      `Pause or reduce spend on fatigued angles: ${names}. Hook rates and CTR have degraded below threshold.`
    );
  }

  if (recommendedAnglesToScale.length > 0) {
    const names = recommendedAnglesToScale.map((a) => AngleTypeLabels[a]).join(", ");
    actionItems.push(
      `Scale top performing angles: ${names}. These maintain thumbstop rates >${minThumbstop}% with efficient CPI.`
    );
  }

  if (recommendedAnglesToProduce.length > 0) {
    const names = recommendedAnglesToProduce.map((a) => AngleTypeLabels[a]).join(", ");
    actionItems.push(
      `Produce fresh creative batches for untapped angles: ${names}. Broadens audience reach and prevents creative saturation.`
    );
  }

  return {
    analyzedAt: new Date().toISOString(),
    totalAdsAnalyzed,
    totalSpend: Math.round(totalSpend * 100) / 100,
    angleBreakdown,
    fatiguedAngles,
    recommendedAnglesToScale,
    recommendedAnglesToProduce,
    actionItems,
  };
}
