import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AddProductForm } from './AddProductForm';
import {
  Store,
  PlusCircle,
  Package,
  Leaf,
  Clock,
  TrendingUp,
  DollarSign,
  Flame,
  Award,
  CheckCircle2
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { products, user, setActiveTab } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // Products belonging to or managed in this studio
  const myProducts = products;

  const avgEcoScore = Math.round(
    myProducts.reduce((acc, p) => acc + p.ecoScore, 0) / Math.max(1, myProducts.length)
  );

  const avgDurabilityYears = (
    myProducts.reduce((acc, p) => acc + p.durabilityMonths, 0) /
    Math.max(1, myProducts.length) /
    12
  ).toFixed(1);

  const totalCarbonPreventedKg = myProducts
    .reduce((acc, p) => acc + p.carbonSavedKg * (p.stock || 10), 0)
    .toFixed(0);

  const rescueDealsCount = myProducts.filter(p => p.isRescueDeal).length;

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              Verified Artisan Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Seller Studio & Eco-Lifecycle Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
              Manage transparent circular inventory, publish near-expiry Rescue Deals, and verify durability claims that feed the customer Decision-Intelligence math.
            </p>
            <p className="text-xs text-amber-300 font-semibold">
              Operating as: {user?.name || 'Heritage Artisan Studio'} ({user?.email || 'seller@vibemart.in'})
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? 'View Inventory List' : 'Add New Eco-Product'}</span>
          </button>
        </div>

        {/* Studio Impact Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Catalog Offerings</span>
            <span className="text-xl font-extrabold font-mono-numbers text-white">{myProducts.length} items</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Durability</span>
            <span className="text-xl font-extrabold font-mono-numbers text-teal-300">{avgDurabilityYears} Years</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Studio Eco-Score</span>
            <span className="text-xl font-extrabold font-mono-numbers text-emerald-400">{avgEcoScore}/100</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Rescue Deals</span>
            <span className="text-xl font-extrabold font-mono-numbers text-rose-400">{rescueDealsCount} live</span>
          </div>
        </div>
      </div>

      {/* Add Product Form or Inventory Grid */}
      {showAddForm ? (
        <AddProductForm onSuccess={() => setShowAddForm(false)} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-700" />
              Live Studio Inventory & Lifecycle Performance
            </h3>
            <span className="text-xs text-slate-500">
              Showing {myProducts.length} circular products
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Lifespan</th>
                    <th className="px-4 py-3">True Cost/Mo</th>
                    <th className="px-4 py-3">Eco-Score</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myProducts.map(prod => {
                    const costMo = prod.durabilityMonths > 0
                      ? (prod.price / prod.durabilityMonths).toFixed(2)
                      : prod.price.toFixed(2);

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div>
                              <strong className="font-bold text-slate-900 block truncate max-w-[200px]">
                                {prod.name}
                              </strong>
                              <span className="text-[10px] text-slate-400">{prod.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prod.needTier === 'ESSENTIAL'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.needTier === 'FLEXIBLE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {prod.needTier}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono-numbers font-bold text-slate-900">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-mono-numbers">
                          {prod.durabilityMonths} months
                        </td>
                        <td className="px-4 py-3 font-mono-numbers font-bold text-emerald-700">
                          ₹{costMo}/mo
                        </td>
                        <td className="px-4 py-3 font-mono-numbers font-bold text-slate-800">
                          {prod.ecoScore}/100
                        </td>
                        <td className="px-4 py-3">
                          {prod.isRescueDeal ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
                              <Flame className="w-3 h-3 text-rose-600" /> Rescue Deal
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
