import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Scale,
  Clock,
  Flame,
  BrainCircuit,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  Store,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Leaf,
  IndianRupee,
  Layers,
  HelpCircle,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    loginAsDemo,
    setIsLoginModalOpen,
    setLoginModalTab,
    setActiveTab,
    user
  } = useApp();

  const [interactiveStep, setInteractiveStep] = useState<number>(1);
  const [demoLifespan, setDemoLifespan] = useState<number>(60);
  const [demoPrice, setDemoPrice] = useState<number>(2499);

  const demoCostPerMonth = (demoPrice / demoLifespan).toFixed(2);

  const guideSteps = [
    {
      step: 1,
      title: 'Set Your Monthly Budget (Budget Guardian)',
      tagline: 'Live spend firewall in Indian Rupees (₹)',
      description: 'Unlike traditional stores designed to maximize cart totals, VIBE MART starts with your ₹15,000 monthly spending limit. Every item you consider is classified live into Essential, Flexible, or Optional.',
      badge: 'Budget Protection',
      color: 'border-emerald-500 bg-emerald-50/60'
    },
    {
      step: 2,
      title: 'Check Product Fit & True Cost-per-Month (₹)',
      tagline: 'Formula: Purchase Price ÷ Expected Lifespan (Months)',
      description: 'Stop getting fooled by sticker shock. A ₹2,899 cast-iron pan that lasts 20 years costs only ₹12.08/month, while a cheap ₹1,200 non-stick pan that degrades in 24 months costs ₹50/month.',
      badge: 'Mathematical Longevity',
      color: 'border-teal-500 bg-teal-50/60'
    },
    {
      step: 3,
      title: 'Evaluate Trade-Offs & Devil’s Advocate',
      tagline: 'Intentional cognitive friction to prevent remorse',
      description: 'Before committing funds, review our side-by-side Trade-Off engine and Devil’s Advocate critique. We explicitly tell you why you should NOT buy luxury or impulse goods.',
      badge: 'Critical Pre-Purchase Audit',
      color: 'border-amber-500 bg-amber-50/60'
    },
    {
      step: 4,
      title: 'Smart Checkout & Post-Purchase Regret Logging',
      tagline: 'Time-capsule Decision Snapshots and active learning',
      description: 'Checkout securely via UPI or Card with an immutable Decision Snapshot seal. After delivery, log your satisfaction (Satisfied, Mild Regret, High Regret) to train future AI fit scores.',
      badge: 'Closed-Loop Intelligence',
      color: 'border-purple-500 bg-purple-50/60'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-900/40">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>The Anti-Impulse E-Commerce Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Shop Smart. Spend Wise. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Live Better with Decision AI.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            VIBE MART is India’s first decision-intelligence marketplace. We replace psychological impulse tricks with real-time budget firewalls, true cost-per-month math, and post-purchase regret tracking.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                if (user?.role === 'BUYER') setActiveTab('STORE');
                else loginAsDemo('BUYER');
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Launch Marketplace (Buyer Mode)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setLoginModalTab('REGISTER');
                setIsLoginModalOpen(true);
              }}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition border border-white/15 cursor-pointer"
            >
              Create Free Account
            </button>
          </div>

          {/* Quick value trust badges */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              78.4% Regret Reduction Rate
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <IndianRupee className="w-4 h-4 text-teal-400" />
              Real-Time ₹15,000 Budget Guardian
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-4 h-4 text-rose-400" />
              Up to 56% OFF Rescue Deals
            </span>
          </div>
        </div>

        {/* Ambient background visuals */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* 1-Click Showcase Demo Profiles */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Instant 1-Click Showcase Personas (Strict RBAC Demo)
            </h2>
            <p className="text-xs text-slate-500">
              Test role-based access control with one click. Each persona accesses strictly isolated dashboards.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Zero-Friction Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buyer Persona */}
          <div
            onClick={() => loginAsDemo('BUYER')}
            className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Buyer Persona
                </span>
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-2 group-hover:text-emerald-700 transition">
                Yali Sharma
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">yali@vibemart.in</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Experience the ₹15,000 Budget Guardian, Product Fit math, 5-step checkout (UPI / Card), and Decision Replay ledger.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Enter as Buyer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Seller Persona */}
          <div
            onClick={() => loginAsDemo('SELLER')}
            className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                  Seller Studio
                </span>
                <Store className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-2 group-hover:text-amber-800 transition">
                Heritage Artisan Studio
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">seller@vibemart.in</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Add circular eco-products, specify verified durability (months), configure Rescue Deals, and manage inventory.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Enter Seller Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin Persona */}
          <div
            onClick={() => loginAsDemo('ADMIN')}
            className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  Platform Admin
                </span>
                <Shield className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mt-2 group-hover:text-purple-800 transition">
                VIBE Admin Director
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">admin@vibemart.in</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Macro oversight: monitor regret reduction rates, view ₹14.85 Lakhs total savings, and purge expired Rescue Deals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-purple-800">
              <span>Enter Admin Oversight</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* "HOW TO USE VIBE MART" INTERACTIVE ONBOARDING GUIDE */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Onboarding Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Use VIBE MART in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A transparent decision-support pipeline designed to align your wallet with genuine household utility.
          </p>
        </div>

        {/* 4 Interactive Step Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {guideSteps.map(g => (
            <button
              key={g.step}
              onClick={() => setInteractiveStep(g.step)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                interactiveStep === g.step
                  ? `${g.color} ring-2 ring-emerald-500/30 shadow-xs font-bold`
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                  interactiveStep === g.step ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {g.step}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Step {g.step}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                {g.title.split('(')[0]}
              </h4>
            </button>
          ))}
        </div>

        {/* Interactive Step Detail Card */}
        <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-2.5 py-1 rounded-md">
              {guideSteps[interactiveStep - 1].badge}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {guideSteps[interactiveStep - 1].title}
            </h3>
            <p className="text-xs font-semibold text-emerald-800">
              {guideSteps[interactiveStep - 1].tagline}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {guideSteps[interactiveStep - 1].description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => loginAsDemo('BUYER')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Experience Step {interactiveStep} Live in App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 2 Interactive Calculator Widget Preview */}
          {interactiveStep === 2 ? (
            <div className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Live Cost-per-Month Calculator (₹)
                </span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  Interactive Formula
                </span>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Purchase Price (₹):</span>
                  <span className="font-mono-numbers font-bold text-slate-900">₹{demoPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={demoPrice}
                  onChange={(e) => setDemoPrice(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Expected Lifespan (Months):</span>
                  <span className="font-mono-numbers font-bold text-slate-900">{demoLifespan} mo ({(demoLifespan/12).toFixed(1)} yrs)</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="240"
                  step="6"
                  value={demoLifespan}
                  onChange={(e) => setDemoLifespan(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-teal-800 uppercase font-bold block">Computed True Cost</span>
                  <span className="text-xl font-bold font-mono-numbers text-teal-900">₹{demoCostPerMonth} <span className="text-xs font-normal font-sans">/month</span></span>
                </div>
                <span className="text-[10px] text-teal-700 max-w-[130px] text-right font-medium">
                  {demoLifespan >= 48 ? 'Heirloom class durability' : 'Moderate lifecycle tier'}
                </span>
              </div>
            </div>
          ) : interactiveStep === 1 ? (
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-slate-900 block border-b border-slate-100 pb-2">
                Budget Guardian Spend Tiers (Live ₹15,000 Target):
              </span>
              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-emerald-900">1. ESSENTIAL:</span>
                  <span className="text-emerald-700 font-mono-numbers font-bold">Cookware, razors, bedsheets (Zero impulse risk)</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-amber-900">2. FLEXIBLE:</span>
                  <span className="text-amber-700 font-mono-numbers font-bold">Cold brew carafes, wool cardigans (Utility upgrade)</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-rose-900">3. OPTIONAL:</span>
                  <span className="text-rose-700 font-mono-numbers font-bold">Smart terrariums, ambient gadgets (Impulse check)</span>
                </div>
              </div>
            </div>
          ) : interactiveStep === 3 ? (
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-slate-900 block border-b border-slate-100 pb-2">
                Devil’s Advocate Critique in Action:
              </span>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                <strong className="text-rose-900 block text-xs">Why you might NOT want to buy this:</strong>
                <p className="text-rose-800 text-[11px] leading-relaxed">
                  "This smart botanical terrarium costs ₹4,499. That eats 30% of your ₹15,000 monthly budget. Do you already have houseplants? If so, this is a discretionary impulse."
                </p>
              </div>
              <div className="text-[11px] text-slate-500 italic text-center">
                We protect your money by encouraging intentional pauses before purchasing.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-slate-900 block border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-600" />
                Immutable Decision Snapshot Seal:
              </span>
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 space-y-1.5 font-mono text-[11px] text-purple-950">
                <div>Snapshot ID: SNAP-IN-8921</div>
                <div>Budget Headroom: ₹11,352 remaining</div>
                <div>Average Fit Score: 96%</div>
                <div>Outcome Logged: SATISFIED (Zero Remorse)</div>
              </div>
              <p className="text-[11px] text-slate-500">
                Logged reflections continuously adapt your personal fit score recommendations for the future.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Decision Engines Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Designed for Financial Clarity, Not Cart Inflation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare standard retail tactics with VIBE MART’s decision-intelligence architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">VIBE Budget Guardian</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitors spend in ₹ against your monthly limit. Alerts on breaches and suggests lower-cost or higher-durability swaps.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-teal-100 text-teal-800 rounded-xl w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Trade-Off Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Side-by-side analysis of 2–3 products. Calculates break-even timeframes and net 5-year savings between standard and durable items.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="p-3 bg-rose-100 text-rose-800 rounded-xl w-fit">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Rescue Deals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Near-expiry organic goods and circular refurbished tech discounted 30%–56% to divert valuable items from landfills.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl p-8 sm:p-12 bg-slate-900 text-white text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Ready to experience decision-intelligence shopping?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Start as a Buyer to browse sustainable products, test payment simulators, and see your Budget Guardian in action.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => loginAsDemo('BUYER')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
          >
            Explore Marketplace as Buyer (Yali Sharma)
          </button>
          <button
            onClick={() => {
              setLoginModalTab('LOGIN');
              setIsLoginModalOpen(true);
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition border border-white/20 cursor-pointer"
          >
            Sign In with Existing Account
          </button>
        </div>
      </section>
    </div>
  );
};
