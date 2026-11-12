import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Leaf,
  Scale,
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsLoginModalOpen, resetDatabase, platformMetrics, user } = useApp();

  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-extrabold flex items-center justify-center text-base">
                V
              </div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                VIBE MART
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Value-Intelligent Budget & Eco Mart
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              "Shop Smart. Spend Wise. Live Better." An interactive decision-support marketplace replacing impulse friction with mathematical longevity, real-time budget guarding, and post-purchase learning.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                {(platformMetrics.totalCo2DivertedKg / 1000).toFixed(1)} tons CO₂ diverted
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {platformMetrics.platformRegretReductionRate}% regret reduction rate
              </span>
            </div>
          </div>

          {/* Decision Tools Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Decision Engines
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('STORE')}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  VIBE Product Fit Score (0–100%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('STORE')}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Budget Guardian & Spend Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('DECISION_REPLAY')}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Decision Replay (Time Capsule)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('RESCUE_DEALS')}
                  className="hover:text-emerald-700 transition cursor-pointer"
                >
                  Rescue Deals & Landfill Clearance
                </button>
              </li>
            </ul>
          </div>

          {/* Showcase & Multi-Role Demo */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Showcase Access & RBAC
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                >
                  {user ? `Account (${user.role}): Switch Profile` : 'Sign In / Register / Demo'}
                </button>
              </li>
              {user?.role === 'SELLER' && (
                <li>
                  <button
                    onClick={() => setActiveTab('SELLER_STUDIO')}
                    className="hover:text-amber-700 transition cursor-pointer"
                  >
                    Seller Studio (Add Eco-Products)
                  </button>
                </li>
              )}
              {user?.role === 'ADMIN' && (
                <li>
                  <button
                    onClick={() => setActiveTab('ADMIN_OVERSIGHT')}
                    className="hover:text-purple-700 transition cursor-pointer"
                  >
                    Admin Platform Oversight
                  </button>
                </li>
              )}
              {(!user || user.role === 'BUYER') && (
                <li>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-slate-400 hover:text-slate-600 transition cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    Demo Switch: Seller & Admin Logins
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={resetDatabase}
                  className="hover:text-rose-600 transition flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Prototype Demo State
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 VIBE MART Prototype. Built with React & Decision-Intelligence Math Engines.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Client-side state & localStorage persisted</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Zero external backend dependency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
