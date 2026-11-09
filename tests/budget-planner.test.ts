import { describe, it, expect } from "vitest";
import { calculateBudgetPlan } from "../src/core/analytics/budget-planner";

describe("Budget & Creative Testing Planner", () => {
  it("calculates realistic campaign bounds based on Meta learning phase", () => {
    const result = calculateBudgetPlan({
      weeklyBudget: 3500,
      targetCpi: 1.5,
      platform: "meta",
    });

    expect(result.weeklyBudget).toBe(3500);
    expect(result.targetCpi).toBe(1.5);
    expect(result.totalEstimatedInstallsWeekly).toBeGreaterThan(2000);

    // 50 installs * $1.50 = $75 min spend per ad set
    // 3500 / 75 = 46 max ad sets
    expect(result.maxParallelAdSets).toBeGreaterThan(0);
    expect(result.angleAllocations).toHaveLength(5);
    expect(result.strategicAdvice.length).toBeGreaterThan(0);
  });

  it("triggers warning when weekly budget is below threshold for learning phase exit", () => {
    const result = calculateBudgetPlan({
      weeklyBudget: 40,
      targetCpi: 2.0,
      platform: "meta",
    });

    // 50 * 2.0 = $100 needed, budget is only $40
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("below the platform threshold");
  });
});
