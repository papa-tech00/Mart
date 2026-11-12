import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Flame,
  Clock,
  Leaf,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  Sparkles,
  TrendingDown
} from 'lucide-react';

export const RescueDealsView: React.FC = () => {
  const { products, user, purgeExpiredRescueDeals } = useApp();

  const rescueProducts = products.filter(p => p.isRescueDeal);

  // Live countdown ticker
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white border border-rose-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Landfill Diversion Program
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            VIBE Rescue Deals: 30% to 60% Clearance
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Near-expiry certified organic staples, overstock packaging updates, and refurbished circular tech. By claiming these items before the expiry window closes, you prevent valuable resources from entering waste streams.
          </p>

          {/* Live countdown timer badge */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Next Landfill Purge Cycle:</span>
              <span className="font-mono-numbers font-bold text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>

            {/* Admin or Demonstrator Purge Trigger */}
            <button
              onClick={() => purgeExpiredRescueDeals()}
              className="px-3 py-2 bg-white/10 hover:bg-rose-500/30 text-rose-300 hover:text-white rounded-xl text-xs font-semibold border border-rose-500/30 transition cursor-pointer flex items-center gap-1.5"
              title="Test system expiry purge logic"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Deal Expiry Purge</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Rescue Grid */}
      {rescueProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Leaf className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">All Rescue Deals have been claimed!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Zero near-expiry stock is currently at risk of landfill waste. Check back tomorrow when local artisans rotate batches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rescueProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
