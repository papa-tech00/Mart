import { Product, FitScoreBreakdown } from '../types';
import { calculateProductFitScore } from './fitScoreEngine';

export interface ProductComparisonMetric {
  id: string;
  name: string;
  price: number;
  durabilityMonths: number;
  costPerMonth: number;
  annualizedCost: number;
  ecoScore: number;
  carbonSavedKg: number;
  fitScore: number;
  needTier: string;
  isBestValue: boolean;
  isBestEco: boolean;
  isLongestLifespan: boolean;
}

export interface TradeOffResult {
  products: ProductComparisonMetric[];
  deltas: {
    priceDelta: number;
    costPerMonthDelta: number;
    lifespanDeltaMonths: number;
    ecoScoreDelta: number;
    carbonSavedDeltaKg: number;
  };
  paybackAnalysis?: {
    cheaperProduct: string;
    durableProduct: string;
    extraInitialCost: number;
    monthlySaving: number;
    breakEvenMonths: number;
    netSavingsOver5Years: number;
  };
  keyTakeaway: string;
}

export function compareProducts(
  productsToCompare: Product[],
  budgetContext = { monthlyBudget: 15000, remainingBudget: 11500, personalRegretRate: 15 }
): TradeOffResult | null {
  if (productsToCompare.length < 2) return null;

  const metrics: ProductComparisonMetric[] = productsToCompare.map(p => {
    const fit = calculateProductFitScore(p, budgetContext);
    const costPerMonth = p.durabilityMonths > 0 ? p.price / p.durabilityMonths : p.price;
    const annualizedCost = costPerMonth * 12;

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      durabilityMonths: p.durabilityMonths,
      costPerMonth: Number(costPerMonth.toFixed(2)),
      annualizedCost: Number(annualizedCost.toFixed(2)),
      ecoScore: p.ecoScore,
      carbonSavedKg: p.carbonSavedKg,
      fitScore: fit.totalScore,
      needTier: p.needTier,
      isBestValue: false,
      isBestEco: false,
      isLongestLifespan: false
    };
  });

  // Determine winners
  const lowestCostPerMonth = Math.min(...metrics.map(m => m.costPerMonth));
  const highestEco = Math.max(...metrics.map(m => m.ecoScore));
  const longestLife = Math.max(...metrics.map(m => m.durabilityMonths));

  metrics.forEach(m => {
    if (m.costPerMonth === lowestCostPerMonth) m.isBestValue = true;
    if (m.ecoScore === highestEco) m.isBestEco = true;
    if (m.durabilityMonths === longestLife) m.isLongestLifespan = true;
  });

  // Calculate deltas between first two products
  const p1 = metrics[0];
  const p2 = metrics[1];

  const deltas = {
    priceDelta: Number(Math.abs(p1.price - p2.price).toFixed(2)),
    costPerMonthDelta: Number(Math.abs(p1.costPerMonth - p2.costPerMonth).toFixed(2)),
    lifespanDeltaMonths: Math.abs(p1.durabilityMonths - p2.durabilityMonths),
    ecoScoreDelta: Math.abs(p1.ecoScore - p2.ecoScore),
    carbonSavedDeltaKg: Number(Math.abs(p1.carbonSavedKg - p2.carbonSavedKg).toFixed(1))
  };

  // Payback calculation if one product has higher initial price but lasts longer/costs less per month
  let paybackAnalysis: TradeOffResult['paybackAnalysis'];
  const higherPriceItem = p1.price >= p2.price ? p1 : p2;
  const lowerPriceItem = p1.price < p2.price ? p1 : p2;

  if (higherPriceItem.costPerMonth < lowerPriceItem.costPerMonth) {
    const extraInitialCost = higherPriceItem.price - lowerPriceItem.price;
    const monthlySaving = lowerPriceItem.costPerMonth - higherPriceItem.costPerMonth;
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(extraInitialCost / monthlySaving) : 0;
    
    // 5 years = 60 months
    const lowerPrice5YrCost = lowerPriceItem.costPerMonth * 60;
    const higherPrice5YrCost = higherPriceItem.costPerMonth * 60;
    const netSavingsOver5Years = Number(Math.max(0, lowerPrice5YrCost - higherPrice5YrCost).toFixed(2));

    paybackAnalysis = {
      cheaperProduct: lowerPriceItem.name,
      durableProduct: higherPriceItem.name,
      extraInitialCost: Number(extraInitialCost.toFixed(2)),
      monthlySaving: Number(monthlySaving.toFixed(2)),
      breakEvenMonths,
      netSavingsOver5Years
    };
  }

  let keyTakeaway = '';
  if (paybackAnalysis) {
    keyTakeaway = `${paybackAnalysis.durableProduct} costs ₹${paybackAnalysis.extraInitialCost.toLocaleString('en-IN')} more upfront, but its true monthly cost is ₹${deltas.costPerMonthDelta}/mo lower. It fully pays for itself in ~${paybackAnalysis.breakEvenMonths} months.`;
  } else {
    keyTakeaway = `${metrics[0].name} vs ${metrics[1].name}: Compare true lifetime utility and eco score before committing funds.`;
  }

  return {
    products: metrics,
    deltas,
    paybackAnalysis,
    keyTakeaway
  };
}
