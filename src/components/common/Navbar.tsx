import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BudgetGuardian } from '../intelligence/BudgetGuardian';
import {
  ShoppingBag,
  Sparkles,
  Scale,
  Clock,
  Store,
  Shield,
  UserCheck,
  Flame,
  ChevronDown,
  LogOut,
  RotateCcw,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    comparisonList,
    activeTab,
    setActiveTab,
    setIsLoginModalOpen,
    setLoginModalTab,
    setIsCartOpen,
    setIsTradeOffDrawerOpen,
    logout,
    resetDatabase
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'SELLER':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (user?.role === 'BUYER') setActiveTab('STORE');
                else if (user?.role === 'SELLER') setActiveTab('SELLER_STUDIO');
                else if (user?.role === 'ADMIN') setActiveTab('ADMIN_OVERSIGHT');
                else setActiveTab('LANDING_PAGE');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
                V
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                    VIBE MART
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                    Decision AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Shop Smart. Spend Wise. Live Better.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links based on Authentication & Strict RBAC */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* If Not Logged In or on Landing Page */}
            {(!user || activeTab === 'LANDING_PAGE') && (
              <>
                <button
                  onClick={() => setActiveTab('LANDING_PAGE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'LANDING_PAGE'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home & Guide
                </button>
                <button
                  onClick={() => {
                    setActiveTab('STORE');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Explore Storefront
                </button>
              </>
            )}

            {/* STRICT BUYER ROLE NAVIGATION: Hide Seller Studio and Admin tools completely! */}
            {user?.role === 'BUYER' && (
              <>
                <button
                  onClick={() => setActiveTab('STORE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'STORE'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Storefront
                </button>

                <button
                  onClick={() => setActiveTab('RESCUE_DEALS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'RESCUE_DEALS'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Rescue Deals</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 rounded-full font-bold">
                    Up to 56% OFF
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('DECISION_REPLAY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    activeTab === 'DECISION_REPLAY'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Decision Replay</span>
                </button>
              </>
            )}

            {/* STRICT SELLER ROLE NAVIGATION */}
            {user?.role === 'SELLER' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  Seller Studio Workspace (Isolated)
                </span>
              </div>
            )}

            {/* STRICT ADMIN ROLE NAVIGATION */}
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  Platform Governance & Oversight (Isolated)
                </span>
              </div>
            )}
          </nav>

          {/* Right Action Icons: Budget, Trade-Off, Cart, Account / Sign In */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Buyer-only widgets */}
            {user?.role === 'BUYER' && (
              <>
                <div className="hidden md:block">
                  <BudgetGuardian compact={true} />
                </div>

                <button
                  onClick={() => setIsTradeOffDrawerOpen(true)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    comparisonList.length > 0
                      ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Open Trade-Off Drawer"
                >
                  <Scale className="w-4 h-4 text-teal-600" />
                  <span className="hidden xl:inline">Trade-Off</span>
                  {comparisonList.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {comparisonList.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline font-mono-numbers">₹{totalCartValue.toLocaleString('en-IN')}</span>
                  {totalCartCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Authentication Buttons if NOT logged in */}
            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setLoginModalTab('LOGIN');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setLoginModalTab('REGISTER');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            ) : (
              /* User Profile & Account Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {user.avatar || 'VM'}
                  </div>
                  <div className="hidden md:block text-left text-xs leading-none">
                    <div className="font-bold text-slate-900 truncate max-w-[100px]">{user.name}</div>
                    <span className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-slate-500 text-[11px] font-mono truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-slate-400">Strict Role:</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${getRoleBadgeStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-700 font-medium transition"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>Switch User / Demo Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          resetDatabase();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-xl hover:bg-slate-100 text-slate-600 font-medium transition"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                        <span>Reset Seed Data (₹15,000)</span>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-xl hover:bg-rose-50 text-rose-700 font-medium transition"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out to Homepage</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        {user?.role === 'BUYER' && (
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('STORE')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'STORE' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              Store
            </button>
            <button
              onClick={() => setActiveTab('RESCUE_DEALS')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${activeTab === 'RESCUE_DEALS' ? 'bg-rose-500 text-white' : 'text-rose-700'}`}
            >
              <Flame className="w-3 h-3" /> Deals
            </button>
            <button
              onClick={() => setActiveTab('DECISION_REPLAY')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'DECISION_REPLAY' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
