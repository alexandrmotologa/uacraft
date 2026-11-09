import { CreativePackage, AdCopyVariation, AdHook } from "../../types";

export interface PolicyFinding {
  severity: "error" | "warning" | "info";
  rule: string;
  field: string;
  targetId: string;
  currentText: string;
  reason: string;
  suggestedFix?: string;
}

export interface LintReport {
  policyScore: number; // 0-100
  totalChecks: number;
  errorCount: number;
  warningCount: number;
  findings: PolicyFinding[];
}

const PROHIBITED_MONEY_TERMS = [
  "win real money",
  "make money",
  "cash prize",
  "free money",
  "guaranteed cash",
  "paypal payout",
  "crypto reward",
  "instant payout",
];

const CLICKBAIT_TERMS = [
  "you won't believe",
  "doctors hate",
  "one weird trick",
  "banned in 50 states",
  "illegal hack",
];

export function lintCreativePackage(pkg: CreativePackage): LintReport {
  const findings: PolicyFinding[] = [];
  let totalChecks = 0;

  const checkText = (text: string, field: string, targetId: string) => {
    totalChecks++;
    const lower = text.toLowerCase();

    // 1. Prohibited money / gambling claims
    for (const term of PROHIBITED_MONEY_TERMS) {
      if (lower.includes(term)) {
        findings.push({
          severity: "error",
          rule: "PROHIBITED_FINANCIAL_CLAIM",
          field,
          targetId,
          currentText: text,
          reason: `Meta and TikTok policies strictly ban non-gambling games from advertising real money earnings ("${term}").`,
          suggestedFix: text.replace(new RegExp(term, "gi"), "earn in-game gold"),
        });
      }
    }

    // 2. Clickbait claims
    for (const term of CLICKBAIT_TERMS) {
      if (lower.includes(term)) {
        findings.push({
          severity: "warning",
          rule: "CLICKBAIT_SENSATIONALISM",
          field,
          targetId,
          currentText: text,
          reason: `Deceptive or extreme sensationalism phrases ("${term}") risk ad delivery throttling.`,
          suggestedFix: text.replace(new RegExp(term, "gi"), "discover the hidden puzzle"),
        });
      }
    }

    // 3. Excess punctuation spam
    if (/!{2,}|\?{2,}|\${2,}/.test(text)) {
      findings.push({
        severity: "warning",
        rule: "PUNCTUATION_SPAM",
        field,
        targetId,
        currentText: text,
        reason: "Multiple consecutive punctuation marks (!!, ???, $$) trigger automated Meta quality penalties.",
        suggestedFix: text.replace(/!{2,}/g, "!").replace(/\?{2,}/g, "?").replace(/\${2,}/g, "$"),
      });
    }

    // 4. Excessive ALL CAPS (ignore short acronyms <= 3 letters)
    const words = text.split(/\s+/).filter((w) => w.length > 3);
    const upperWords = words.filter((w) => w === w.toUpperCase() && /[A-Z]/.test(w));
    if (words.length > 0 && upperWords.length / words.length > 0.45) {
      findings.push({
        severity: "warning",
        rule: "EXCESSIVE_CAPITALIZATION",
        field,
        targetId,
        currentText: text,
        reason: "Over 45% of words are in ALL CAPS. Ad networks penalize spam typography.",
        suggestedFix: text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      });
    }
  };

  // Lint hooks
  pkg.hooks.forEach((h) => {
    checkText(h.headline, "headline", h.id);
    checkText(h.textOverlay, "textOverlay", h.id);
  });

  // Lint copy variations
  pkg.copies.forEach((c) => {
    totalChecks++;
    checkText(c.headline, "headline", c.id);
    checkText(c.primaryTextShort, "primaryTextShort", c.id);

    // Meta headline length (<= 40 chars)
    if (c.headline.length > 40) {
      findings.push({
        severity: "warning",
        rule: "META_HEADLINE_TRUNCATION",
        field: "headline",
        targetId: c.id,
        currentText: c.headline,
        reason: `Headline length is ${c.headline.length} chars (exceeds optimal 40 chars on mobile feeds).`,
        suggestedFix: c.headline.substring(0, 37).trim() + "...",
      });
    }

    // Google UAC headline length (<= 30 chars)
    if (c.headline.length > 30) {
      findings.push({
        severity: "info",
        rule: "GOOGLE_UAC_HEADLINE_LIMIT",
        field: "headline",
        targetId: c.id,
        currentText: c.headline,
        reason: `Headline length is ${c.headline.length} chars (exceeds Google UAC 30-char strict limit).`,
        suggestedFix: c.headline.substring(0, 27).trim() + "...",
      });
    }

    // Meta primary text length (<= 125 chars)
    if (c.primaryTextShort.length > 125) {
      findings.push({
        severity: "warning",
        rule: "META_PRIMARY_TEXT_TRUNCATION",
        field: "primaryTextShort",
        targetId: c.id,
        currentText: c.primaryTextShort,
        reason: `Primary text is ${c.primaryTextShort.length} chars (exceeds 125-char mobile thumbstop fold).`,
        suggestedFix: c.primaryTextShort.substring(0, 122).trim() + "...",
      });
    }
  });

  const errorCount = findings.filter((f) => f.severity === "error").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;

  // Compute score: Start at 100, subtract 20 per error, 5 per warning
  const deductions = errorCount * 20 + warningCount * 5;
  const policyScore = Math.max(0, 100 - deductions);

  return {
    policyScore,
    totalChecks,
    errorCount,
    warningCount,
    findings,
  };
}

export function autoFixCreativePackage(pkg: CreativePackage): {
  fixedPackage: CreativePackage;
  fixCount: number;
} {
  let fixCount = 0;

  const fixString = (text: string, maxLen?: number): string => {
    let res = text;
    // Replace money claims
    for (const term of PROHIBITED_MONEY_TERMS) {
      if (res.toLowerCase().includes(term)) {
        res = res.replace(new RegExp(term, "gi"), "earn bonus items");
        fixCount++;
      }
    }
    // Clean excessive punctuation
    if (/!{2,}|\?{2,}|\${2,}/.test(res)) {
      res = res.replace(/!{2,}/g, "!").replace(/\?{2,}/g, "?").replace(/\${2,}/g, "$");
      fixCount++;
    }
    // Truncate if specified
    if (maxLen && res.length > maxLen) {
      res = res.substring(0, maxLen - 3).trim() + "...";
      fixCount++;
    }
    return res;
  };

  const fixedCopies = pkg.copies.map((c) => ({
    ...c,
    headline: fixString(c.headline, 40),
    primaryTextShort: fixString(c.primaryTextShort, 125),
  }));

  const fixedHooks = pkg.hooks.map((h) => ({
    ...h,
    headline: fixString(h.headline, 40),
    textOverlay: fixString(h.textOverlay),
  }));

  const fixedPackage: CreativePackage = {
    ...pkg,
    copies: fixedCopies,
    hooks: fixedHooks,
  };

  return { fixedPackage, fixCount };
}
