import React from 'react';
import { useApp } from '../../context/AppContext';
import { compareProducts } from '../../utils/tradeOffEngine';
import {
  X,
  Scale,
  Sparkles,
  Award,
  Leaf,
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const TradeOffDrawer: React.FC = () => {
  const {
    isTradeOffDrawerOpen,
    setIsTradeOffDrawerOpen,
    comparisonList,
    removeFromComparison,
    clearComparison,
    addToCart,
    monthlyBudget,
    budgetAnalysis,
    regretStats,
    products
  } = useApp();

  if (!isTradeOffDrawerOpen) return null;

  const tradeOffResult = compareProducts(comparisonList, {
    monthlyBudget,
    remainingBudget: budgetAnalysis.headroomAfterCart,
    personalRegretRate: regretStats.regretRate
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">VIBE Trade-Off Engine</h2>
              <p className="text-xs text-slate-500">Side-by-side true cost-per-month & durability evaluation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium hover:bg-slate-200 rounded-lg transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsTradeOffDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {comparisonList.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No items pinned for trade-off evaluation yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click the "Compare" button on any product card in the catalog to evaluate true cost-per-month, durability deltas, and lifecycle payoffs.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setIsTradeOffDrawerOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  Browse Catalog
                </button>
              </div>
            </div>
          ) : comparisonList.length === 1 ? (
            <div className="text-center py-8 space-y-4">
              <div className="inline-block p-4 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto text-left">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  Select one more item to compare
                </h4>
                <p className="text-xs text-amber-800 mt-1">
                  You currently have <strong>{comparisonList[0].name}</strong> selected. Choose another item below to run mathematical trade-offs:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {products
                    .filter(p => p.id !== comparisonList[0].id)
                    .slice(0, 3)
                    .map(alt => (
                      <button
                        key={alt.id}
                        onClick={() => {
                          useApp; // trigger reactive context
                        }}
                        className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-emerald-500 hover:text-emerald-700 font-medium transition"
                      >
                        + Compare with {alt.name.slice(0, 22)}...
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            tradeOffResult && (
              <>
                {/* Mathematical Synthesis / Payback Banner */}
                {tradeOffResult.paybackAnalysis ? (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-sm">
                          Long-Term Payback Conclusion
                        </h4>
                        <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed font-medium">
                          {tradeOffResult.keyTakeaway}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-900">
                          <span>Payback Period: <strong className="font-mono-numbers text-emerald-700">{tradeOffResult.paybackAnalysis.breakEvenMonths} months</strong></span>
                          <span>Net 5-Year Savings: <strong className="font-mono-numbers text-emerald-700">₹{tradeOffResult.paybackAnalysis.netSavingsOver5Years.toLocaleString('en-IN')}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs text-slate-700 font-medium">{tradeOffResult.keyTakeaway}</p>
                  </div>
                )}

                {/* Side-by-Side Product Comparison Cards */}
                <div className={`grid gap-4 ${comparisonList.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {tradeOffResult.products.map(metric => {
                    const fullProd = comparisonList.find(p => p.id === metric.id)!;
                    return (
                      <div
                        key={metric.id}
                        className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                          metric.isBestValue
                            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-400/20'
                            : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        {metric.isBestValue && (
                          <span className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Award className="w-3 h-3" /> Best True Value
                          </span>
                        )}

                        <div>
                          {/* Image & Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={fullProd.image}
                              alt={metric.name}
                              className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                            />
                            <div className="overflow-hidden">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {metric.needTier} Tier
                              </span>
                              <h3 className="font-bold text-slate-900 text-sm leading-snug truncate">
                                {metric.name}
                              </h3>
                              <p className="text-xs font-mono-numbers font-bold text-slate-900 mt-0.5">
                                ₹{metric.price.toLocaleString('en-IN')}{' '}
                                <span className="text-[10px] font-normal text-slate-500 font-sans">upfront</span>
                              </p>
                            </div>
                          </div>

                          {/* Key Mathematical Metrics */}
                          <div className="space-y-2.5 bg-slate-50/80 rounded-xl p-3 text-xs mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                True Cost / Month:
                              </span>
                              <span className={`font-mono-numbers font-bold text-sm ${metric.isBestValue ? 'text-emerald-700' : 'text-slate-900'}`}>
                                ₹{metric.costPerMonth}/mo
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                Expected Lifespan:
                              </span>
                              <span className="font-mono-numbers font-semibold text-slate-900">
                                {metric.durabilityMonths} months ({(metric.durabilityMonths / 12).toFixed(1)} yrs)
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                Eco-Score:
                              </span>
                              <span className="font-mono-numbers font-bold text-emerald-700">
                                {metric.ecoScore}/100
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                                VIBE Fit Score:
                              </span>
                              <span className="font-mono-numbers font-bold text-teal-700">
                                {metric.fitScore}%
                              </span>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 text-slate-500">
                              <span>Annualized Cost:</span>
                              <span className="font-mono-numbers text-slate-700 font-semibold">₹{metric.annualizedCost.toLocaleString('en-IN')}/yr</span>
                            </div>
                          </div>

                          {/* Reasons to Buy / Caution */}
                          <div className="text-[11px] space-y-1 mb-4">
                            <p className="font-bold text-slate-700">Why choose this:</p>
                            <ul className="text-slate-600 space-y-1 list-disc list-inside">
                              {fullProd.reasonsToBuy.slice(0, 2).map((r, i) => (
                                <li key={i} className="truncate">{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => addToCart(fullProd)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromComparison(metric.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Formula: True Cost per Month = Upfront Purchase Price ÷ Expected Lifespan (Months)</span>
          <button
            onClick={() => setIsTradeOffDrawerOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
