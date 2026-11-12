import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProductFitBadge } from '../intelligence/ProductFitBadge';
import {
  Scale,
  ShoppingCart,
  Clock,
  Leaf,
  Check,
  Eye,
  AlertTriangle,
  Flame
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    addToComparison,
    removeFromComparison,
    isProductInComparison,
    setSelectedProductDetail
  } = useApp();

  const isCompared = isProductInComparison(product.id);
  const costPerMonth = product.durabilityMonths > 0
    ? (product.price / product.durabilityMonths).toFixed(2)
    : product.price.toFixed(2);

  const getTierBadge = () => {
    switch (product.needTier) {
      case 'ESSENTIAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FLEXIBLE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'OPTIONAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div
      onClick={() => setSelectedProductDetail(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer hover:border-emerald-300"
    >
      <div>
        {/* Product Image & Top Overlays */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />

          {/* Need Tier Badge */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs ${getTierBadge()}`}>
              {product.needTier}
            </span>
            {product.isRescueDeal && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-xs">
                <Flame className="w-3 h-3" />
                {product.rescueDiscountPercent}% OFF RESCUE
              </span>
            )}
          </div>

          {/* Fit Score Badge overlay */}
          <div className="absolute top-2.5 right-2.5">
            <ProductFitBadge product={product} size="sm" />
          </div>

          {/* Durability Ribbon */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-300" />
              {product.durabilityMonths >= 12
                ? `${(product.durabilityMonths / 12).toFixed(1)} yr lifespan`
                : `${product.durabilityMonths} mo lifespan`}
            </span>
            <span className="bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              Eco {product.ecoScore}/100
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {product.category}
            </span>
            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* True Cost / Month & Upfront Price */}
          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block leading-none">
                True Cost / Mo:
              </span>
              <span className="font-mono-numbers font-bold text-emerald-700 text-sm">
                ₹{costPerMonth}
                <span className="text-[10px] font-normal text-slate-500 font-sans">/mo</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-medium block leading-none">
                Purchase Price:
              </span>
              <div className="flex items-baseline gap-1 justify-end">
                {product.originalPrice && (
                  <span className="text-slate-400 line-through text-[11px] font-mono-numbers">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-mono-numbers font-bold text-slate-900 text-sm">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Devil's Advocate quick highlight */}
          {product.impulseRisk === 'HIGH' && (
            <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-50 px-2 py-1 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Impulse Risk: Discretionary lifestyle buy</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isCompared) removeFromComparison(product.id);
            else addToComparison(product);
          }}
          className={`flex items-center justify-center gap-1 p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
            isCompared
              ? 'bg-teal-50 border-teal-400 text-teal-800'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title={isCompared ? 'Remove from Trade-Off' : 'Add to Trade-Off'}
        >
          <Scale className="w-4 h-4 text-teal-600" />
          <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Trade-Off'}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
