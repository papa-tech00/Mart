import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductFitBadge } from '../intelligence/ProductFitBadge';
import { DevilsAdvocatePanel } from '../intelligence/DevilsAdvocatePanel';
import { calculateProductFitScore } from '../../utils/fitScoreEngine';
import {
  X,
  ShoppingCart,
  Scale,
  Clock,
  Leaf,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Star
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    addToComparison,
    isProductInComparison,
    monthlyBudget,
    budgetAnalysis,
    regretStats,
    products
  } = useApp();

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isCompared = isProductInComparison(product.id);

  const fitBreakdown = calculateProductFitScore(product, {
    monthlyBudget,
    remainingBudget: budgetAnalysis.headroomAfterCart,
    personalRegretRate: regretStats.regretRate
  });

  const costPerMonth = product.durabilityMonths > 0
    ? (product.price / product.durabilityMonths).toFixed(2)
    : product.price.toFixed(2);

  // Find alternative recommendation if available
  const alternative = product.alternativeProductId
    ? products.find(p => p.id === product.alternativeProductId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.needTier === 'ESSENTIAL'
                ? 'bg-emerald-100 text-emerald-800'
                : product.needTier === 'FLEXIBLE'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {product.needTier} TIER
            </span>
          </div>

          <button
            onClick={() => setSelectedProductDetail(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Hero Grid: Product image + Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-300" />
                    {product.durabilityMonths} Months Lifespan
                  </span>
                  <span className="bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Eco-Score {product.ecoScore}/100
                  </span>
                </div>
              </div>

              {/* Artisan / Seller Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sold & Crafted By</span>
                  <span className="font-bold text-slate-800">{product.sellerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Review Confidence</span>
                  <span className="font-mono-numbers font-bold text-emerald-700 flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating} ({product.reviewConfidence}% confidence)
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details & Intelligence Metrics */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Price & True Cost breakdown card */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-900 font-semibold block">True Cost per Month:</span>
                  <div className="text-2xl font-bold font-mono-numbers text-emerald-800">
                    ₹{costPerMonth}
                    <span className="text-xs font-normal text-emerald-700">/mo</span>
                  </div>
                  <span className="text-[10px] text-emerald-800">
                    Based on verified {product.durabilityMonths} months expected lifespan
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Upfront Price:</span>
                  <div className="text-2xl font-bold font-mono-numbers text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono-numbers">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Fit Score Math Breakdown */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Decision Fit Intelligence
                  </span>
                  <div className="font-mono-numbers font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {fitBreakdown.totalScore}% Fit Score
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Need Match (25%):</span>
                    <strong className="text-slate-800 font-mono-numbers">{fitBreakdown.needMatchScore}/25 pts</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Budget Fit (25%):</span>
                    <strong className="text-slate-800 font-mono-numbers">{fitBreakdown.budgetFitScore}/25 pts</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Eco & Durability (20%):</span>
                    <strong className="text-slate-800 font-mono-numbers">{fitBreakdown.ecoDurabilityScore}/20 pts</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block">Long-Term Value (15%):</span>
                    <strong className="text-slate-800 font-mono-numbers">{fitBreakdown.longTermValueScore}/15 pts</strong>
                  </div>
                </div>
              </div>

              {/* Carbon Footprint vs Standard */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs flex items-center justify-between text-teal-900">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Prevents <strong>{product.carbonSavedKg} kg CO₂</strong> vs standard disposable item</span>
                </div>
                <span className="font-mono-numbers font-bold text-[11px] text-teal-700">
                  {product.carbonFootprintKg} kg footprint
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">Product Blueprint & Materials:</h4>
            <p>{product.description}</p>
          </div>

          {/* Devil's Advocate Pre-Purchase Audit Panel */}
          <DevilsAdvocatePanel product={product} />

          {/* Alternative Trade-Off recommendation */}
          {alternative && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">
                    VIBE Trade-Off Alternative Available
                  </h4>
                  <p className="text-emerald-800 text-[11px]">
                    Compare with <strong>{alternative.name}</strong> (₹{alternative.price.toLocaleString('en-IN')}) for lower monthly expenditure.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  addToComparison(product);
                  addToComparison(alternative);
                  setSelectedProductDetail(null);
                }}
                className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-xl hover:bg-emerald-100 transition shrink-0 flex items-center gap-1.5 shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Run Trade-Off Test</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (isCompared) addToComparison(product);
              else addToComparison(product);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
              isCompared
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4 text-teal-600" />
            <span>{isCompared ? 'In Trade-Off Tray' : 'Add to Trade-Off'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductDetail(null)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Continue Browsing
            </button>
            <button
              onClick={() => {
                addToCart(product);
                setSelectedProductDetail(null);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart (₹{product.price.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
