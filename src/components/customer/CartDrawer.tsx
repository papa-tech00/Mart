import React from 'react';
import { useApp } from '../../context/AppContext';
import { BudgetGuardian } from '../intelligence/BudgetGuardian';
import { CounterfactualSim } from '../intelligence/CounterfactualSim';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    budgetAnalysis,
    setIsCheckoutModalOpen,
    setSelectedProductDetail
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Decision-Intelligent Cart
              </h2>
              <p className="text-xs text-slate-500">
                {cart.length} unique item{cart.length === 1 ? '' : 's'} with real-time budget guarding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-600 transition p-1"
                title="Clear Cart"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Your cart is currently empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our curated eco-friendly marketplace with weighted Product Fit Scores and durability ratings.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Integrated Budget Guardian */}
              <BudgetGuardian />

              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-700">
                    Cart Items ({cart.reduce((a, b) => a + b.quantity, 0)})
                  </span>
                  <span>Categorized by Need Tier</span>
                </div>

                {cart.map(item => {
                  const costPerMonth = item.product.durabilityMonths > 0
                    ? (item.product.price / item.product.durabilityMonths).toFixed(2)
                    : item.product.price.toFixed(2);

                  return (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start gap-3 shadow-2xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onClick={() => setSelectedProductDetail(item.product)}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0 cursor-pointer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                item.product.needTier === 'ESSENTIAL'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.product.needTier === 'FLEXIBLE'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {item.product.needTier}
                              </span>
                              {item.product.impulseRisk === 'HIGH' && (
                                <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5">
                                  <AlertTriangle className="w-2.5 h-2.5" /> High Regret
                                </span>
                              )}
                            </div>
                            <h4
                              onClick={() => setSelectedProductDetail(item.product)}
                              className="text-xs font-bold text-slate-900 truncate mt-0.5 hover:text-emerald-700 cursor-pointer"
                            >
                              {item.product.name}
                            </h4>
                          </div>

                          <span className="font-mono-numbers font-bold text-slate-900 text-xs shrink-0">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                          <span>
                            True: <strong className="font-mono-numbers text-emerald-700">₹{costPerMonth}/mo</strong>
                          </span>

                          {/* Quantity Adjusters */}
                          <div className="flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-lg">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="text-slate-600 hover:text-slate-900 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono-numbers font-bold text-slate-900 text-xs px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="text-slate-600 hover:text-slate-900 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Counterfactual "What-If" Simulator */}
              <CounterfactualSim />
            </>
          )}
        </div>

        {/* Drawer Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items):</span>
                <span className="font-mono-numbers font-semibold text-slate-900">
                  ₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Budget Headroom:</span>
                <span className={`font-mono-numbers font-bold ${
                  budgetAnalysis.isBreached ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {budgetAnalysis.isBreached
                    ? `-₹${budgetAnalysis.excessAmount.toLocaleString('en-IN')}`
                    : `₹${budgetAnalysis.headroomAfterCart.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Decision Snapshot Proceed Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutModalOpen(true);
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Proceed to 5-Step Checkout (₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
