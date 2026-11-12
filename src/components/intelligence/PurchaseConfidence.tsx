import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculatePurchaseConfidence } from '../../utils/budgetEngine';
import { ShieldCheck, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PurchaseConfidenceProps {
  averageFitScore: number;
}

export const PurchaseConfidence: React.FC<PurchaseConfidenceProps> = ({ averageFitScore }) => {
  const { cart, budgetAnalysis } = useApp();

  const confidence = calculatePurchaseConfidence(cart, budgetAnalysis, averageFitScore);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Decision Safety Index
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-2xl font-bold font-mono-numbers ${confidence.colorClass}`}>
              {confidence.confidenceScore}%
            </span>
            <span className="text-sm font-bold text-slate-800">
              {confidence.label}
            </span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              className="text-slate-100"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              className={
                confidence.confidenceScore >= 75
                  ? 'text-emerald-500'
                  : confidence.confidenceScore >= 50
                  ? 'text-amber-500'
                  : 'text-rose-500'
              }
              strokeWidth="5"
              strokeDasharray={138}
              strokeDashoffset={138 - (138 * confidence.confidenceScore) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute font-mono-numbers text-xs font-bold text-slate-700">
            {confidence.confidenceScore}
          </span>
        </div>
      </div>

      {/* Safety Factors Breakdown */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        {confidence.summaryFactors.map((factor, idx) => (
          <div key={idx} className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-1.5">
              {factor.status === 'good' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : factor.status === 'neutral' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              )}
              <span>{factor.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono-numbers font-semibold text-slate-800">
                {factor.score}/{factor.max} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
