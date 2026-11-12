import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';

export const BudgetGuardian: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    monthlyBudget,
    setMonthlyBudget,
    spentThisMonth,
    budgetAnalysis,
    swapCartItem,
    showToast
  } = useApp();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      setIsEditingBudget(false);
      showToast(`Monthly budget ceiling updated to ₹${val.toLocaleString('en-IN')}.`, 'success');
    }
  };

  const spentPercent = Math.min(100, (spentThisMonth / monthlyBudget) * 100);
  const essentialCartPercent = Math.min(100 - spentPercent, (budgetAnalysis.essentialSpend / monthlyBudget) * 100);
  const flexibleCartPercent = Math.min(100 - spentPercent - essentialCartPercent, (budgetAnalysis.flexibleSpend / monthlyBudget) * 100);
  const optionalCartPercent = Math.min(100 - spentPercent - essentialCartPercent - flexibleCartPercent, (budgetAnalysis.optionalSpend / monthlyBudget) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-emerald-100 px-3.5 py-1.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Budget:</span>
          <span className="font-mono-numbers font-bold text-slate-900">₹{monthlyBudget.toLocaleString('en-IN')}</span>
        </div>
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${spentPercent}%` }} className="bg-slate-400" title={`Spent: ₹${spentThisMonth}`} />
          <div style={{ width: `${essentialCartPercent}%` }} className="bg-emerald-500" title={`Cart Essential: ₹${budgetAnalysis.essentialSpend}`} />
          <div style={{ width: `${flexibleCartPercent}%` }} className="bg-amber-400" title={`Cart Flexible: ₹${budgetAnalysis.flexibleSpend}`} />
          <div style={{ width: `${optionalCartPercent}%` }} className="bg-rose-400" title={`Cart Optional: ₹${budgetAnalysis.optionalSpend}`} />
        </div>
        <div className="text-xs">
          <span className={`font-mono-numbers font-bold ${budgetAnalysis.isBreached ? 'text-rose-600' : 'text-emerald-700'}`}>
            ₹{Math.max(0, budgetAnalysis.headroomAfterCart).toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 ml-1">left</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
      budgetAnalysis.isBreached
        ? 'bg-rose-50/60 border-rose-200'
        : budgetAnalysis.isNearLimit
        ? 'bg-amber-50/60 border-amber-200'
        : 'bg-white border-slate-200/90'
    }`}>
      {/* Header & Limit Edit */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${
            budgetAnalysis.isBreached
              ? 'bg-rose-100 text-rose-700'
              : budgetAnalysis.isNearLimit
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {budgetAnalysis.isBreached ? (
              <ShieldAlert className="w-5 h-5" />
            ) : budgetAnalysis.isNearLimit ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
              VIBE Budget Guardian
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                budgetAnalysis.isBreached
                  ? 'bg-rose-500 text-white'
                  : budgetAnalysis.isNearLimit
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {budgetAnalysis.status}
              </span>
            </h3>
            <p className="text-xs text-slate-500">Live decision firewall preventing impulse overspend in ₹</p>
          </div>
        </div>

        {/* Budget Limit quick-changer */}
        <div className="flex items-center gap-2">
          {isEditingBudget ? (
            <div className="flex items-center gap-1.5 bg-white border border-emerald-300 rounded-lg p-1 shadow-xs">
              <span className="text-xs font-bold text-slate-500 pl-1">₹</span>
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="w-24 text-xs font-mono-numbers font-bold text-slate-900 focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveBudget}
                className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
                title="Save Budget"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempBudget(monthlyBudget.toString());
                setIsEditingBudget(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <span>Cap: <strong className="font-mono-numbers text-slate-900">₹{monthlyBudget.toLocaleString('en-IN')}/mo</strong></span>
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Segmented Visual Spend Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600">
            Total Projected: <strong className="font-mono-numbers text-slate-900">₹{budgetAnalysis.totalProjectedSpend.toLocaleString('en-IN')}</strong>
          </span>
          <span className={`font-semibold ${budgetAnalysis.isBreached ? 'text-rose-600' : 'text-slate-600'}`}>
            {budgetAnalysis.isBreached ? (
              <span className="flex items-center gap-1 font-mono-numbers font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> +₹{budgetAnalysis.excessAmount.toLocaleString('en-IN')} over budget
              </span>
            ) : (
              <span><strong className="font-mono-numbers text-emerald-700">₹{budgetAnalysis.headroomAfterCart.toLocaleString('en-IN')}</strong> remaining headroom</span>
            )}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden flex p-0.5 shadow-inner">
          {spentPercent > 0 && (
            <div
              style={{ width: `${spentPercent}%` }}
              className="bg-slate-400 rounded-l-full transition-all duration-300"
              title={`Prior Spent: ₹${spentThisMonth}`}
            />
          )}
          {essentialCartPercent > 0 && (
            <div
              style={{ width: `${essentialCartPercent}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`Cart Essential: ₹${budgetAnalysis.essentialSpend.toLocaleString('en-IN')}`}
            />
          )}
          {flexibleCartPercent > 0 && (
            <div
              style={{ width: `${flexibleCartPercent}%` }}
              className="bg-amber-400 transition-all duration-300"
              title={`Cart Flexible: ₹${budgetAnalysis.flexibleSpend.toLocaleString('en-IN')}`}
            />
          )}
          {optionalCartPercent > 0 && (
            <div
              style={{ width: `${optionalCartPercent}%` }}
              className={`${budgetAnalysis.isBreached ? 'bg-rose-500 animate-pulse' : 'bg-rose-400'} rounded-r-full transition-all duration-300`}
              title={`Cart Optional: ₹${budgetAnalysis.optionalSpend.toLocaleString('en-IN')}`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Prior Month Spend (₹{spentThisMonth.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Essential (₹{budgetAnalysis.essentialSpend.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Flexible (₹{budgetAnalysis.flexibleSpend.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Optional / Luxury (₹{budgetAnalysis.optionalSpend.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      {/* Breach or Caution Notice */}
      {budgetAnalysis.statusMessage && (
        <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
          budgetAnalysis.isBreached
            ? 'bg-rose-100 text-rose-800 border border-rose-300'
            : budgetAnalysis.isNearLimit
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {budgetAnalysis.isBreached ? (
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          )}
          <span className="leading-relaxed font-medium">{budgetAnalysis.statusMessage}</span>
        </div>
      )}

      {/* Auto-Recommended Budget Swaps */}
      {budgetAnalysis.recommendedSwaps.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              Smart Budget Optimization Swaps:
            </span>
            <span className="text-[10px] text-slate-500">Lower cost & longer lifespan</span>
          </div>

          <div className="space-y-2">
            {budgetAnalysis.recommendedSwaps.map(({ cartItem, suggestedAlternative, potentialSavings, lifespanGainMonths }) => (
              <div
                key={cartItem.product.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white border border-emerald-200 rounded-xl text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 line-through text-[11px] truncate max-w-[130px]">{cartItem.product.name}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">{suggestedAlternative.name}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="font-mono-numbers font-bold text-emerald-700">Save ₹{potentialSavings.toLocaleString('en-IN')}</span>
                    {lifespanGainMonths > 0 && (
                      <span className="block text-[10px] text-slate-500">+{lifespanGainMonths} mo lifespan</span>
                    )}
                  </div>
                  <button
                    onClick={() => swapCartItem(cartItem.product.id, suggestedAlternative)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Swap Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
