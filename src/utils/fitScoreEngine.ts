import { Product, FitScoreBreakdown, NeedTier } from '../types';

interface FitScoreContext {
  monthlyBudget: number;
  remainingBudget: number;
  personalRegretRate?: number; // 0 - 100 (%)
}

export function calculateProductFitScore(
  product: Product,
  context: FitScoreContext = { monthlyBudget: 15000, remainingBudget: 11500, personalRegretRate: 15 }
): FitScoreBreakdown {
  const { monthlyBudget, remainingBudget, personalRegretRate = 15 } = context;

  // 1. Need Match (25% = max 25 pts)
  let needMatchScore = 0;
  if (product.needTier === 'ESSENTIAL') {
    needMatchScore = 25;
  } else if (product.needTier === 'FLEXIBLE') {
    // If budget is plentiful, flexible scores high; if tight, slightly lower
    const budgetHealth = Math.min(1, Math.max(0, remainingBudget / monthlyBudget));
    needMatchScore = 18 + budgetHealth * 4; // 18 - 22
  } else {
    // OPTIONAL: significantly dependent on budget health and regret history
    const budgetHealth = Math.min(1, Math.max(0, remainingBudget / monthlyBudget));
    needMatchScore = Math.max(5, 12 * budgetHealth);
  }

  // 2. Budget Fit (25% = max 25 pts)
  let budgetFitScore = 0;
  if (remainingBudget <= 0) {
    budgetFitScore = 1;
  } else {
    const priceRatio = product.price / remainingBudget;
    if (priceRatio <= 0.08) {
      budgetFitScore = 25;
    } else if (priceRatio <= 0.20) {
      budgetFitScore = 21;
    } else if (priceRatio <= 0.40) {
      budgetFitScore = 15;
    } else if (priceRatio <= 0.75) {
      budgetFitScore = 9;
    } else if (priceRatio <= 1.0) {
      budgetFitScore = 4;
    } else {
      budgetFitScore = 1; // Breaches remaining budget
    }
  }

  // 3. Eco & Durability (20% = max 20 pts)
  // EcoScore (1-100) -> 10 pts
  const ecoComponent = (Math.min(100, Math.max(0, product.ecoScore)) / 100) * 10;
  // Durability months (capped at 60 months for max score) -> 10 pts
  const durabilityComponent = (Math.min(60, Math.max(1, product.durabilityMonths)) / 60) * 10;
  const ecoDurabilityScore = Number((ecoComponent + durabilityComponent).toFixed(1));

  // 4. Review Confidence (15% = max 15 pts)
  const confidenceRatio = Math.min(100, Math.max(0, product.reviewConfidence)) / 100;
  const reviewConfidenceScore = Number((confidenceRatio * 15).toFixed(1));

  // 5. Long-Term Value / Cost-per-Month (15% = max 15 pts) in ₹ INR
  const costPerMonth = product.durabilityMonths > 0 ? product.price / product.durabilityMonths : product.price;
  let longTermValueScore = 0;
  if (costPerMonth <= 15) {
    longTermValueScore = 15;
  } else if (costPerMonth <= 45) {
    longTermValueScore = 13.5;
  } else if (costPerMonth <= 100) {
    longTermValueScore = 11;
  } else if (costPerMonth <= 250) {
    longTermValueScore = 7.5;
  } else {
    longTermValueScore = Math.max(3, 15 - costPerMonth * 0.04);
  }

  // Feedback adjustment (learning loop from user's regret/satisfaction history)
  let feedbackAdjustment = 0;
  if (personalRegretRate > 25 && product.impulseRisk === 'HIGH') {
    feedbackAdjustment = -7;
  } else if (personalRegretRate < 10 && product.needTier === 'ESSENTIAL') {
    feedbackAdjustment = +2;
  }

  const rawTotal = needMatchScore + budgetFitScore + ecoDurabilityScore + reviewConfidenceScore + longTermValueScore + feedbackAdjustment;
  const totalScore = Math.min(99, Math.max(15, Math.round(rawTotal)));

  return {
    totalScore,
    needMatchScore: Number(needMatchScore.toFixed(1)),
    budgetFitScore: Number(budgetFitScore.toFixed(1)),
    ecoDurabilityScore,
    reviewConfidenceScore,
    longTermValueScore: Number(longTermValueScore.toFixed(1)),
    costPerMonth: Number(costPerMonth.toFixed(2)),
    feedbackAdjustment
  };
}

export function getFitScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  label: string;
} {
  if (score >= 85) {
    return {
      bg: 'bg-emerald-50 text-emerald-800',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      badge: 'bg-emerald-500 text-white',
      label: 'Exceptional Value Fit'
    };
  }
  if (score >= 70) {
    return {
      bg: 'bg-teal-50 text-teal-800',
      text: 'text-teal-700',
      border: 'border-teal-200',
      badge: 'bg-teal-500 text-white',
      label: 'Strong Balanced Fit'
    };
  }
  if (score >= 50) {
    return {
      bg: 'bg-amber-50 text-amber-800',
      text: 'text-amber-700',
      border: 'border-amber-200',
      badge: 'bg-amber-500 text-white',
      label: 'Moderate Discretionary Fit'
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-800',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-500 text-white',
    label: 'High Regret Risk'
  };
}
