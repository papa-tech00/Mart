import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SatisfactionFeedback } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  FileText,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp,
  BrainCircuit
} from 'lucide-react';

export const DecisionReplay: React.FC = () => {
  const { orders, updateOrderFeedback, regretStats, monthlyBudget } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [feedbackNoteInput, setFeedbackNoteInput] = useState<{ [key: string]: string }>({});

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleFeedback = (orderId: string, feedback: SatisfactionFeedback) => {
    const note = feedbackNoteInput[orderId];
    updateOrderFeedback(orderId, feedback, note);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Decision Time Capsule Ledger
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Decision Replay & Regret Analytics
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Inspect historical orders alongside the exact immutable Decision Snapshots recorded at checkout. Log post-purchase reflections to train your personal fit recommendations.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Satisfaction Rate
              </span>
              <span className="font-mono-numbers font-extrabold text-emerald-700 text-xl">
                {regretStats.satisfactionRate}%
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">
                {regretStats.satisfiedCount} of {regretStats.reviewedOrders || regretStats.totalOrders} reviewed
              </span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">
                Regret Frequency
              </span>
              <span className="font-mono-numbers font-extrabold text-rose-700 text-xl">
                {regretStats.regretRate}%
              </span>
              <span className="text-[10px] text-rose-600 font-medium block">
                {regretStats.regretTrend} Trend
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Learning Insight Pill */}
        <div className="mt-5 p-3.5 bg-slate-900 text-white rounded-2xl flex items-start sm:items-center gap-3 text-xs">
          <BrainCircuit className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <strong className="text-emerald-300 mr-1.5 font-bold">VIBE Active Learning Loop:</strong>
            <span className="text-slate-300">
              {regretStats.feedbackInsights[0] || 'Every logged satisfaction score continuously calibrates future Product Fit scores.'}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List with Decision Snapshots */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No past orders in ledger yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add items from the catalog and confirm your first purchase to generate an immutable Decision Snapshot.
            </p>
          </div>
        ) : (
          orders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const snapshot = order.decisionSnapshot;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Order Summary Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl mt-0.5">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers font-bold text-slate-900 text-sm">
                          Order #{order.id}
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {order.items.length} item{order.items.length === 1 ? '' : 's'} (
                        {order.items.map(i => i.productName).join(', ')})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Recorded Total
                      </span>
                      <span className="font-mono-numbers font-bold text-slate-900 text-base">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Satisfaction status badge */}
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Outcome
                      </span>
                      {order.satisfactionFeedback === 'SATISFIED' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <Smile className="w-3.5 h-3.5 text-emerald-600" /> Satisfied
                        </span>
                      ) : order.satisfactionFeedback === 'MILD_REGRET' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Meh className="w-3.5 h-3.5 text-amber-600" /> Mild Regret
                        </span>
                      ) : order.satisfactionFeedback === 'HIGH_REGRET' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <Frown className="w-3.5 h-3.5 text-rose-600" /> High Regret
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Pending Review
                        </span>
                      )}
                    </div>

                    <button className="p-1.5 text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Decision Snapshot & Post-Purchase Review Panel */}
                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-6 text-xs">
                    {/* Items Purchased in this order */}
                    <div className="pt-4 space-y-2">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                        Purchased Items & Durability Ledger:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map(item => (
                          <div
                            key={item.productId}
                            className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 shadow-2xs"
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-slate-900 text-xs truncate">
                                {item.productName}
                              </h5>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-mono-numbers font-semibold text-slate-800">
                                  ₹{item.price.toLocaleString('en-IN')} (Qty: {item.quantity})
                                </span>
                                <span>•</span>
                                <span className="font-mono-numbers text-emerald-700">
                                  ₹{item.costPerMonth.toFixed(2)}/mo
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {item.needTier}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Immutable Decision Snapshot Audit Box */}
                    {snapshot && (
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            Immutable Decision Snapshot #{snapshot.snapshotId}
                          </span>
                          <span className="font-mono-numbers text-[10px] text-slate-500">
                            Confidence Index: {snapshot.purchaseConfidenceScore}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Budget Before</span>
                            <span className="font-mono-numbers font-bold text-slate-900 text-xs">
                              ₹{snapshot.monthlyBudgetRemainingBefore.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Budget After</span>
                            <span className="font-mono-numbers font-bold text-emerald-700 text-xs">
                              ₹{snapshot.monthlyBudgetRemainingAfter.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Fit Score</span>
                            <span className="font-mono-numbers font-bold text-teal-700 text-xs">
                              {snapshot.averageFitScore}%
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">CO₂ Diverted</span>
                            <span className="font-mono-numbers font-bold text-emerald-700 text-xs">
                              {snapshot.counterfactualPotentialCo2SavingsKg.toFixed(1)} kg
                            </span>
                          </div>
                        </div>

                        {snapshot.acknowledgedWarnings.length > 0 && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
                            <strong className="text-slate-800 block">Pre-Purchase Acknowledged Friction:</strong>
                            <ul className="list-disc list-inside space-y-0.5">
                              {snapshot.acknowledgedWarnings.map((w, idx) => (
                                <li key={idx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Post-Purchase Satisfaction Feedback */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                            Post-Purchase Reflection & Learning Log
                          </h4>
                          <p className="text-[11px] text-emerald-800">
                            How did this purchase perform in your daily routine? Did it meet expectations?
                          </p>
                        </div>
                      </div>

                      {/* 3 Outcome Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <button
                          onClick={() => handleFeedback(order.id, 'SATISFIED')}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                            order.satisfactionFeedback === 'SATISFIED'
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <Smile className={`w-5 h-5 shrink-0 ${order.satisfactionFeedback === 'SATISFIED' ? 'text-white' : 'text-emerald-600'}`} />
                          <div>
                            <div className="font-bold text-xs">Zero Regret</div>
                            <div className="text-[10px] opacity-80 leading-tight">Great utility, fulfilled genuine need</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleFeedback(order.id, 'MILD_REGRET')}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                            order.satisfactionFeedback === 'MILD_REGRET'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <Meh className={`w-5 h-5 shrink-0 ${order.satisfactionFeedback === 'MILD_REGRET' ? 'text-white' : 'text-amber-600'}`} />
                          <div>
                            <div className="font-bold text-xs">Mild Regret</div>
                            <div className="text-[10px] opacity-80 leading-tight">Could have waited or spent less</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleFeedback(order.id, 'HIGH_REGRET')}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition cursor-pointer ${
                            order.satisfactionFeedback === 'HIGH_REGRET'
                              ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                              : 'bg-white hover:bg-rose-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <Frown className={`w-5 h-5 shrink-0 ${order.satisfactionFeedback === 'HIGH_REGRET' ? 'text-white' : 'text-rose-600'}`} />
                          <div>
                            <div className="font-bold text-xs">High Regret</div>
                            <div className="text-[10px] opacity-80 leading-tight">Impulse buy, rarely utilized</div>
                          </div>
                        </button>
                      </div>

                      {/* Feedback Notes input */}
                      {order.feedbackNotes && (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 text-slate-700 text-xs italic">
                          "{order.feedbackNotes}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
