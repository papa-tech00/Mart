import React, { useState } from 'react';
import { Product } from '../../types';
import { calculateProductFitScore, getFitScoreColor } from '../../utils/fitScoreEngine';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Info, ChevronRight, Sparkles } from 'lucide-react';

interface ProductFitBadgeProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
}

export const ProductFitBadge: React.FC<ProductFitBadgeProps> = ({
  product,
  size = 'md',
  showDetailsOnClick = true
}) => {
  const { monthlyBudget, budgetAnalysis, regretStats, setSelectedProductDetail } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  const breakdown = calculateProductFitScore(product, {
    monthlyBudget,
    remainingBudget: budgetAnalysis.headroomAfterCart,
    personalRegretRate: regretStats.regretRate
  });

  const colors = getFitScoreColor(breakdown.totalScore);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDetailsOnClick) {
      setSelectedProductDetail(product);
    }
  };

  if (size === 'sm') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.border} border shadow-xs cursor-pointer hover:shadow-sm transition-all`}
        onClick={handleClick}
        title={`Fit Score: ${breakdown.totalScore}% (${colors.label})`}
      >
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        <span className="font-mono-numbers font-bold">{breakdown.totalScore}%</span>
        <span className="hidden sm:inline text-[10px] font-normal opacity-85">Fit</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block" onMouseLeave={() => setShowTooltip(false)}>
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${colors.bg} ${colors.border}`}
      >
        <div className={`flex items-center justify-center w-7 h-7 rounded-md font-mono-numbers font-bold text-xs shadow-xs ${colors.badge}`}>
          {breakdown.totalScore}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold leading-tight tracking-tight">VIBE Fit Score</span>
            <Info className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[10px] font-medium opacity-85 leading-none mt-0.5">
            {colors.label}
          </span>
        </div>
      </button>

      {/* Floating Detailed Breakdown Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3.5 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 text-xs animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="font-bold flex items-center gap-1.5 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Fit Intelligence Math
            </span>
            <span className="font-mono-numbers font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {breakdown.totalScore}/100
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Need Tier Match (max 25):</span>
              <span className="font-mono-numbers font-semibold text-slate-800">{breakdown.needMatchScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Budget Headroom Fit (max 25):</span>
              <span className="font-mono-numbers font-semibold text-slate-800">{breakdown.budgetFitScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Eco-Score & Durability (max 20):</span>
              <span className="font-mono-numbers font-semibold text-slate-800">{breakdown.ecoDurabilityScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Review Confidence (max 15):</span>
              <span className="font-mono-numbers font-semibold text-slate-800">{breakdown.reviewConfidenceScore} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">True Monthly Value (max 15):</span>
              <span className="font-mono-numbers font-semibold text-slate-800">{breakdown.longTermValueScore} pts</span>
            </div>
            {breakdown.feedbackAdjustment !== 0 && (
              <div className="flex justify-between items-center text-rose-600 font-medium">
                <span>Personal Regret Bias Adjust:</span>
                <span className="font-mono-numbers">{breakdown.feedbackAdjustment > 0 ? `+${breakdown.feedbackAdjustment}` : breakdown.feedbackAdjustment} pts</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>True Monthly Cost: <strong className="text-slate-700 font-mono-numbers">₹{breakdown.costPerMonth}/mo</strong></span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">Click for deep audit <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>
      )}
    </div>
  );
};
