import React, { useState } from 'react';
import { Product } from '../../types';
import {
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Flame,
  BrainCircuit,
  Scale
} from 'lucide-react';

interface DevilsAdvocatePanelProps {
  product: Product;
  onAcknowledgeWarning?: (warning: string) => void;
  showCognitiveCheck?: boolean;
}

export const DevilsAdvocatePanel: React.FC<DevilsAdvocatePanelProps> = ({
  product,
  onAcknowledgeWarning,
  showCognitiveCheck = true
}) => {
  const [ownsAlternative, setOwnsAlternative] = useState<boolean | null>(null);
  const [coolingOffAnswer, setCoolingOffAnswer] = useState<string | null>(null);

  const getImpulseBadge = () => {
    switch (product.impulseRisk) {
      case 'HIGH':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
          label: 'High Impulse Regret Risk'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Moderate Discretionary Risk'
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Low Regret Risk (Essential Utility)'
        };
    }
  };

  const impulseBadge = getImpulseBadge();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Devil's Advocate Pre-Purchase Audit
          </h4>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${impulseBadge.bg}`}>
          {impulseBadge.icon}
          {impulseBadge.label}
        </span>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Core Dual Column: Reasons to Buy vs Reasons to Pause */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Reasons to Buy */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Validated Reasons to Buy:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-emerald-950">
              {product.reasonsToBuy.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">•</span>
                  <span className="leading-tight">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reasons NOT to Buy */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Devil's Advocate Concerns:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-rose-950">
              {product.reasonsNotToBuy.map((concern, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold shrink-0">•</span>
                  <span className="leading-tight font-medium">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cognitive Friction & Reflection Prompt */}
        {showCognitiveCheck && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Pre-Commitment Self-Check:</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-600">
                Do you currently own an item that already fulfills 80% of this purpose?
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setOwnsAlternative(true)}
                  className={`px-3 py-1 rounded-lg font-semibold border transition ${
                    ownsAlternative === true
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Yes, I do
                </button>
                <button
                  type="button"
                  onClick={() => setOwnsAlternative(false)}
                  className={`px-3 py-1 rounded-lg font-semibold border transition ${
                    ownsAlternative === false
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  No, genuine gap
                </button>
              </div>
            </div>

            {ownsAlternative === true && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Impulse Alert:</strong> Since you already own a viable item, consider holding off for 48 hours to prevent buyer regret and conserve ₹
                  {product.price.toLocaleString('en-IN')}.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
