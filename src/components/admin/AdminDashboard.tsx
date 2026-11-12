import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  TrendingDown,
  Users,
  Flame,
  Leaf,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { platformMetrics, purgeExpiredRescueDeals, user, resetDatabase } = useApp();
  const [purgeLogs, setPurgeLogs] = useState<string[]>([
    'Automated cron job checked batch #9021: 4 near-expiry items verified safe.',
    'System audit: 12 stale items successfully purged to composting pipeline.'
  ]);

  const handlePurge = () => {
    const res = purgeExpiredRescueDeals();
    const timestamp = new Date().toLocaleTimeString();
    setPurgeLogs(prev => [
      `[${timestamp}] Admin purge triggered: ${res.message}`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Platform Oversight & Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Decision-Intelligence Platform Health
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
              Macro telemetry measuring consumer impulse friction, platform-wide buyer regret mitigation, and circular landfill diversions.
            </p>
            <p className="text-xs text-purple-300 font-semibold">
              Platform Director: {user?.name || 'VIBE Admin Director'} ({user?.email || 'admin@vibemart.in'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePurge}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Purge Expired Rescue Deals</span>
            </button>
          </div>
        </div>

        {/* 4 Macro Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Regret Reduction Rate
            </span>
            <span className="text-2xl font-extrabold font-mono-numbers text-emerald-400">
              {platformMetrics.platformRegretReductionRate}%
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">
              vs traditional e-commerce
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Capital Conserved
            </span>
            <span className="text-2xl font-extrabold font-mono-numbers text-teal-300">
              ₹{(platformMetrics.totalRupeesSaved / 100000).toFixed(2)} L
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Across {platformMetrics.totalUsersProtected.toLocaleString('en-IN')} shoppers
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Impulses Prevented
            </span>
            <span className="text-2xl font-extrabold font-mono-numbers text-amber-300">
              {platformMetrics.totalImpulsePurchasesPrevented.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              Via Devil's Advocate
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              CO₂ Diverted
            </span>
            <span className="text-2xl font-extrabold font-mono-numbers text-emerald-400">
              {(platformMetrics.totalCo2DivertedKg / 1000).toFixed(1)} tons
            </span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">
              Prevented from landfill
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Rescue Deals Integrity & Expiry Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                Rescue Deals Expiry Integrity Monitor
              </h3>
            </div>
            <span className="text-[11px] font-mono-numbers font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {platformMetrics.expiredDealsPurged} Purged to date
            </span>
          </div>

          <p className="text-slate-500 leading-relaxed">
            The VIBE system guarantees that zero spoiled or past-window goods are sold. When the countdown closes, items are automatically purged and diverted to organic composters or secondary recycling facilities.
          </p>

          {/* Audit Logs */}
          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5 max-h-44 overflow-y-auto">
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Landfill Purge Audit Feed:
            </div>
            {purgeLogs.map((log, i) => (
              <div key={i} className="text-slate-300 border-l border-slate-700 pl-2">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Decision Architecture Philosophy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              The VIBE Behavioral Pipeline Architecture
            </h3>
          </div>

          <div className="space-y-2 text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">1. Need & Preference:</span>
              <span className="text-slate-500">Tier classification (Essential/Flexible/Optional)</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">2. Decision & Trade-Off:</span>
              <span className="text-slate-500">True Cost/Month (Price / Lifespan in months)</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">3. Purchase Audit:</span>
              <span className="text-slate-500">Immutable Decision Snapshot recorded at checkout</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-slate-800">4. Outcome & Learning:</span>
              <span className="text-slate-500">Post-purchase regret tuning future fit scores</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={resetDatabase}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset all platform telemetry to initial baseline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
