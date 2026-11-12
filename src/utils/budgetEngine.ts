import { CartItem, Product, NeedTier } from '../types';

export interface BudgetAnalysis {
  monthlyLimit: number;
  spentThisMonth: number;
  cartTotal: number;
  totalProjectedSpend: number;
  headroomBeforeCart: number;
  headroomAfterCart: number;
  essentialSpend: number;
  flexibleSpend: number;
  optionalSpend: number;
  essentialPercent: number;
  flexiblePercent: number;
  optionalPercent: number;
  status: 'OPTIMAL' | 'CAUTION' | 'BREACH';
  statusMessage: string;
  isBreached: boolean;
  isNearLimit: boolean;
  excessAmount: number;
  recommendedSwaps: Array<{
    cartItem: CartItem;
    suggestedAlternative: Product;
    potentialSavings: number;
    lifespanGainMonths: number;
  }>;
}

export function analyzeBudget(
  cartItems: CartItem[],
  monthlyLimit: number = 15000,
  spentThisMonth: number = 3500,
  allProducts: Product[] = []
): BudgetAnalysis {
  let cartTotal = 0;
  let essentialSpend = 0;
  let flexibleSpend = 0;
  let optionalSpend = 0;

  for (const item of cartItems) {
    const itemTotal = item.product.price * item.quantity;
    cartTotal += itemTotal;
    if (item.product.needTier === 'ESSENTIAL') {
      essentialSpend += itemTotal;
    } else if (item.product.needTier === 'FLEXIBLE') {
      flexibleSpend += itemTotal;
    } else {
      optionalSpend += itemTotal;
    }
  }

  const totalProjectedSpend = spentThisMonth + cartTotal;
  const headroomBeforeCart = Math.max(0, monthlyLimit - spentThisMonth);
  const headroomAfterCart = monthlyLimit - totalProjectedSpend;
  const isBreached = totalProjectedSpend > monthlyLimit;
  const excessAmount = isBreached ? totalProjectedSpend - monthlyLimit : 0;
  const isNearLimit = !isBreached && totalProjectedSpend >= monthlyLimit * 0.85;

  const essentialPercent = cartTotal > 0 ? (essentialSpend / cartTotal) * 100 : 0;
  const flexiblePercent = cartTotal > 0 ? (flexibleSpend / cartTotal) * 100 : 0;
  const optionalPercent = cartTotal > 0 ? (optionalSpend / cartTotal) * 100 : 0;

  let status: 'OPTIMAL' | 'CAUTION' | 'BREACH' = 'OPTIMAL';
  let statusMessage = 'Your cart is well balanced within your monthly budget.';

  if (isBreached) {
    status = 'BREACH';
    statusMessage = `Cart exceeds monthly budget ceiling by ₹${excessAmount.toLocaleString('en-IN')}. Consider trimming Optional items or swapping for durable alternatives.`;
  } else if (isNearLimit) {
    status = 'CAUTION';
    statusMessage = `Approaching budget ceiling (${((totalProjectedSpend / monthlyLimit) * 100).toFixed(0)}% utilized). Discretionary items should be reviewed.`;
  }

  // Find recommended swaps for OPTIONAL or expensive items
  const recommendedSwaps: BudgetAnalysis['recommendedSwaps'] = [];
  for (const item of cartItems) {
    if (item.product.needTier === 'OPTIONAL' || item.product.price > 1500) {
      if (item.product.alternativeProductId) {
        const alt = allProducts.find(p => p.id === item.product.alternativeProductId);
        if (alt && alt.price < item.product.price) {
          recommendedSwaps.push({
            cartItem: item,
            suggestedAlternative: alt,
            potentialSavings: (item.product.price - alt.price) * item.quantity,
            lifespanGainMonths: Math.max(0, alt.durabilityMonths - item.product.durabilityMonths)
          });
        }
      } else {
        // Find general lower cost alternative in same category
        const alt = allProducts.find(
          p => p.id !== item.product.id &&
               p.category === item.product.category &&
               p.price < item.product.price
        );
        if (alt) {
          recommendedSwaps.push({
            cartItem: item,
            suggestedAlternative: alt,
            potentialSavings: (item.product.price - alt.price) * item.quantity,
            lifespanGainMonths: Math.max(0, alt.durabilityMonths - item.product.durabilityMonths)
          });
        }
      }
    }
  }

  return {
    monthlyLimit,
    spentThisMonth,
    cartTotal,
    totalProjectedSpend,
    headroomBeforeCart,
    headroomAfterCart,
    essentialSpend,
    flexibleSpend,
    optionalSpend,
    essentialPercent: Number(essentialPercent.toFixed(1)),
    flexiblePercent: Number(flexiblePercent.toFixed(1)),
    optionalPercent: Number(optionalPercent.toFixed(1)),
    status,
    statusMessage,
    isBreached,
    isNearLimit,
    excessAmount: Number(excessAmount.toFixed(2)),
    recommendedSwaps
  };
}

export function calculatePurchaseConfidence(
  cartItems: CartItem[],
  budgetAnalysis: BudgetAnalysis,
  averageFitScore: number
): {
  confidenceScore: number; // 0-100
  label: string;
  colorClass: string;
  summaryFactors: { label: string; score: number; max: number; status: 'good' | 'neutral' | 'risk' }[];
} {
  if (cartItems.length === 0) {
    return {
      confidenceScore: 100,
      label: 'Empty Cart',
      colorClass: 'text-slate-500',
      summaryFactors: []
    };
  }

  // 1. Budget Headroom Safety (max 35 pts)
  let budgetPoints = 0;
  if (budgetAnalysis.isBreached) {
    budgetPoints = Math.max(0, 15 - (budgetAnalysis.excessAmount / 20));
  } else {
    const headroomRatio = budgetAnalysis.headroomAfterCart / budgetAnalysis.monthlyLimit;
    budgetPoints = 15 + Math.min(20, headroomRatio * 25);
  }

  // 2. Average Fit Score Quality (max 35 pts)
  const fitPoints = (averageFitScore / 100) * 35;

  // 3. Need Tier Ratio Safety (max 30 pts)
  // Higher proportion of Essential & Flexible items = higher confidence
  const essentialRatio = (budgetAnalysis.essentialSpend + budgetAnalysis.flexibleSpend * 0.7) / Math.max(1, budgetAnalysis.cartTotal);
  const ratioPoints = Math.min(30, essentialRatio * 30);

  const rawScore = budgetPoints + fitPoints + ratioPoints;
  const confidenceScore = Math.min(99, Math.max(10, Math.round(rawScore)));

  let label = 'Very High Confidence';
  let colorClass = 'text-emerald-600';

  if (confidenceScore >= 80) {
    label = 'Wise & Sound Purchase';
    colorClass = 'text-emerald-600';
  } else if (confidenceScore >= 65) {
    label = 'Acceptable Balanced Buy';
    colorClass = 'text-teal-600';
  } else if (confidenceScore >= 45) {
    label = 'Discretionary Caution';
    colorClass = 'text-amber-600';
  } else {
    label = 'High Buyer Regret Risk';
    colorClass = 'text-rose-600';
  }

  const summaryFactors: { label: string; score: number; max: number; status: 'good' | 'neutral' | 'risk' }[] = [
    {
      label: 'Budget Headroom',
      score: Math.round(budgetPoints),
      max: 35,
      status: budgetPoints >= 25 ? 'good' : budgetPoints >= 15 ? 'neutral' : 'risk'
    },
    {
      label: 'Product Fit Quality',
      score: Math.round(fitPoints),
      max: 35,
      status: fitPoints >= 25 ? 'good' : fitPoints >= 18 ? 'neutral' : 'risk'
    },
    {
      label: 'Essential Need Ratio',
      score: Math.round(ratioPoints),
      max: 30,
      status: ratioPoints >= 20 ? 'good' : ratioPoints >= 12 ? 'neutral' : 'risk'
    }
  ];

  return {
    confidenceScore,
    label,
    colorClass,
    summaryFactors
  };
}
