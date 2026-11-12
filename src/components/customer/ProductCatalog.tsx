import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { NeedTier, Product } from '../../types';
import { calculateProductFitScore } from '../../utils/fitScoreEngine';
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowUpDown,
  Leaf,
  Clock,
  RotateCcw
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    monthlyBudget,
    budgetAnalysis,
    regretStats,
    setActiveTab,
    setIsTradeOffDrawerOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<NeedTier | 'ALL'>('ALL');
  const [minEcoScore, setMinEcoScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'FIT_SCORE' | 'TRUE_COST' | 'PRICE_ASC' | 'ECO_SCORE'>('FIT_SCORE');

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(p => {
        // Query match
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase());

        // Need Tier match
        const matchesTier = selectedTier === 'ALL' || p.needTier === selectedTier;

        // Eco Score match
        const matchesEco = p.ecoScore >= minEcoScore;

        return matchesSearch && matchesTier && matchesEco;
      })
      .sort((a, b) => {
        const fitA = calculateProductFitScore(a, {
          monthlyBudget,
          remainingBudget: budgetAnalysis.headroomAfterCart,
          personalRegretRate: regretStats.regretRate
        }).totalScore;

        const fitB = calculateProductFitScore(b, {
          monthlyBudget,
          remainingBudget: budgetAnalysis.headroomAfterCart,
          personalRegretRate: regretStats.regretRate
        }).totalScore;

        const costMoA = a.durabilityMonths > 0 ? a.price / a.durabilityMonths : a.price;
        const costMoB = b.durabilityMonths > 0 ? b.price / b.durabilityMonths : b.price;

        if (sortBy === 'FIT_SCORE') return fitB - fitA;
        if (sortBy === 'TRUE_COST') return costMoA - costMoB;
        if (sortBy === 'PRICE_ASC') return a.price - b.price;
        if (sortBy === 'ECO_SCORE') return b.ecoScore - a.ecoScore;
        return 0;
      });
  }, [products, searchQuery, selectedTier, minEcoScore, sortBy, monthlyBudget, budgetAnalysis, regretStats]);

  return (
    <div className="space-y-6">
      {/* Hero Value Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Decision-Intelligence Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Stop guessing durability. Start computing true monthly value.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Every item on VIBE MART is scored by verified lifespan, material circularity, and live budget headroom. We deliberately introduce cognitive friction to eliminate post-purchase remorse.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <button
              onClick={() => setSelectedTier('ESSENTIAL')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition"
            >
              Essential Baseline Items
            </button>
            <button
              onClick={() => setActiveTab('RESCUE_DEALS')}
              className="px-3.5 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Near-Expiry Rescue Deals (Up to 56% off)
            </button>
            <button
              onClick={() => setIsTradeOffDrawerOpen(true)}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition border border-white/15"
            >
              Launch Trade-Off Engine
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Interactive Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by material, category, name (e.g., Cast Iron, Hemp, Razor)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="FIT_SCORE">VIBE Fit Score (Highest)</option>
              <option value="TRUE_COST">True Cost / Month (Lowest)</option>
              <option value="PRICE_ASC">Purchase Price (Low to High)</option>
              <option value="ECO_SCORE">Eco-Score (Highest)</option>
            </select>
          </div>
        </div>

        {/* Need Tier & Eco Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Need Tiers */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-400 font-semibold mr-1">Need Tier:</span>
            {(['ALL', 'ESSENTIAL', 'FLEXIBLE', 'OPTIONAL'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1 rounded-xl font-bold transition text-xs ${
                  selectedTier === tier
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier === 'ALL' ? 'All Items' : tier}
              </button>
            ))}
          </div>

          {/* Eco score quick chip */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinEcoScore(minEcoScore === 90 ? 0 : 90)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
                minEcoScore === 90
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Eco-Score &ge; 90+</span>
            </button>

            {(selectedTier !== 'ALL' || minEcoScore > 0 || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTier('ALL');
                  setMinEcoScore(0);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No items match your selected filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try resetting your search query or loosening the minimum eco-score threshold.
          </p>
          <button
            onClick={() => {
              setSelectedTier('ALL');
              setMinEcoScore(0);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
