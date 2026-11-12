import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  DollarSign,
  Leaf,
  Calendar,
  ArrowRight,
  TrendingUp,
  Check,
  RotateCcw
} from 'lucide-react';

export const CounterfactualSim: React.FC = () => {
  const { cart, budgetAnalysis, removeFromCart, swapCartItem, showToast } = useApp();
  const [timeframe, setTimeframe] = useState<1 | 6 | 12>(6);

  // Identify optional items
  const optionalItems = cart.filter(item => item.product.needTier === 'OPTIONAL');
  const optionalSpend = budgetAnalysis.optionalSpend;

  // CO2 savings calculation
  const totalCo2SavedInCart = cart.reduce(
    (acc, item) => acc + (item.product.carbonSavedKg * item.quantity),
    0
  );

  // Cumulative savings if optional impulse items are avoided
  const financialSavings = optionalSpend * (timeframe === 1 ? 1 : timeframe === 6 ? 6 : 12);
  const potentialCo2Avoided = optionalItems.reduce(
    (acc, item) => acc + (item.product.carbonFootprintKg * item.quantity),
    0
  ) * (timeframe === 1 ? 1 : timeframe === 6 ? 3 : 5);

  const handlePruneOptional = () => {
    if (optionalItems.length === 0) return;
    optionalItems.forEach(item => removeFromCart(item.product.id));
    showToast(`Pruned ${optionalItems.length} discretionary items. Saved $${optionalSpend}!`, 'success');
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-900/40 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-300">
              Counterfactual "What-If" Simulator
            </h4>
            <p className="text-[11px] text-slate-400">
              Mathematical projection if discretionary impulse purchases are redirected
            </p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTimeframe(1)}
            className={`px-2.5 py-1 rounded-lg transition ${
              timeframe === 1 ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            1 Month
          </button>
          <button
            onClick={() => setTimeframe(6)}
            className={`px-2.5 py-1 rounded-lg transition ${
              timeframe === 6 ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeframe(12)}
            className={`px-2.5 py-1 rounded-lg transition ${
              timeframe === 12 ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Projection Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Money Kept in Savings */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Projected Capital Preserved:</span>
            <div className="text-xl font-bold font-mono-numbers text-emerald-400">
              ₹{financialSavings.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">
              {timeframe === 1 ? 'From this cart alone' : `If sustained over ${timeframe} billing cycles`}
            </span>
          </div>
        </div>

        {/* Carbon Footprint Diverted */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/20 text-teal-300 rounded-xl shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Net Carbon Prevented / Saved:</span>
            <div className="text-xl font-bold font-mono-numbers text-teal-300">
              {(totalCo2SavedInCart + potentialCo2Avoided).toFixed(1)} kg CO₂
            </div>
            <span className="text-[10px] text-slate-400">
              Equivalent to {( (totalCo2SavedInCart + potentialCo2Avoided) * 2.4 ).toFixed(0)} miles of EV driving
            </span>
          </div>
        </div>
      </div>

      {/* Status & Action */}
      {optionalItems.length > 0 ? (
        <div className="bg-white/5 border border-rose-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-rose-300">
              {optionalItems.length} Discretionary item(s) detected in cart:
            </span>
            <p className="text-[11px] text-slate-300">
              {optionalItems.map(i => i.product.name).join(', ')} (₹{optionalSpend.toLocaleString('en-IN')})
            </p>
          </div>
          <button
            onClick={handlePruneOptional}
            className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Prune Impulse Items (₹{optionalSpend.toLocaleString('en-IN')})
          </button>
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Clean Cart: Zero pure impulse luxury items detected. All cart items belong to Essential or Flexible utility tiers.</span>
        </div>
      )}
    </div>
  );
};
