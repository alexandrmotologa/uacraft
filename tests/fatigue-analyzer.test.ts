import { describe, it, expect } from "vitest";
import { analyzeCreativeFatigue } from "../src/core/analytics/fatigue-analyzer";
import { PerformanceMetricRecord } from "../src/types";

describe("Creative Fatigue Analyzer", () => {
  it("diagnoses fatigue when hook rate and CTR degrade and days active are high", () => {
    const records: PerformanceMetricRecord[] = [
      {
        adId: "ad-01",
        adName: "Old_Ad_1",
        angle: "challenge-fail",
        spend: 2500,
        impressions: 500000,
        clicks: 7000,
        installs: 500,
        thumbstopRate3s: 16.5, // below 24
        completionRateVideo: 6.0,
        cpi: 5.0, // high CPI
        ctr: 1.4, // below 1.8
        daysActive: 22,
      },
      {
        adId: "ad-02",
        adName: "Fresh_Ad_1",
        angle: "asmr-satisfying",
        spend: 800,
        impressions: 200000,
        clicks: 6400,
        installs: 600,
        thumbstopRate3s: 39.2,
        completionRateVideo: 19.5,
        cpi: 1.33,
        ctr: 3.2,
        daysActive: 4,
      },
    ];

    const result = analyzeCreativeFatigue(records);
    expect(result.totalAdsAnalyzed).toBe(2);
    expect(result.totalSpend).toBe(3300);

    const challengeStatus = result.angleBreakdown["challenge-fail"];
    expect(challengeStatus.status).toBe("fatigued");
    expect(challengeStatus.fatigueScore).toBeGreaterThanOrEqual(60);
    expect(result.fatiguedAngles).toContain("challenge-fail");

    const asmrStatus = result.angleBreakdown["asmr-satisfying"];
    expect(asmrStatus.status).toBe("healthy");
    expect(asmrStatus.fatigueScore).toBe(0);
    expect(result.recommendedAnglesToScale).toContain("asmr-satisfying");

    // Untested angles should be recommended for production
    expect(result.recommendedAnglesToProduce).toContain("curiosity-gap");
    expect(result.actionItems.length).toBeGreaterThan(0);
  });

  it("handles custom thresholds properly", () => {
    const records: PerformanceMetricRecord[] = [
      {
        adId: "ad-01",
        adName: "Test_Ad",
        angle: "story-drama",
        spend: 500,
        impressions: 100000,
        clicks: 2200,
        installs: 200,
        thumbstopRate3s: 21.0,
        completionRateVideo: 12.0,
        cpi: 2.5,
        ctr: 2.2,
        daysActive: 5,
      },
    ];

    // Standard threshold: 24% min thumbstop -> warning
    const standard = analyzeCreativeFatigue(records);
    expect(standard.angleBreakdown["story-drama"].status).toBe("warning");

    // Relaxed threshold: 20% min thumbstop -> healthy
    const relaxed = analyzeCreativeFatigue(records, { minThumbstopRate: 20 });
    expect(relaxed.angleBreakdown["story-drama"].status).toBe("healthy");
  });
});
