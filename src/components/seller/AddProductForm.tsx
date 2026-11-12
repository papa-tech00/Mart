import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NeedTier, ImpulseRisk, Product } from '../../types';
import {
  PlusCircle,
  Clock,
  Leaf,
  DollarSign,
  AlertTriangle,
  Flame,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AddProductFormProps {
  onSuccess?: () => void;
}

const PRESET_IMAGES = [
  { label: 'Cast Iron', url: 'https://images.unsplash.com/photo-1584990347449-a2e6f4995f51?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Bedding', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80' },
  { label: 'Glass Carafe', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bamboo Brush', url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Solar Tech', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80' }
];

export const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess }) => {
  const { addProduct } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Home & Living');
  const [description, setDescription] = useState('');
  const [needTier, setNeedTier] = useState<NeedTier>('ESSENTIAL');
  const [price, setPrice] = useState('45');
  const [durabilityMonths, setDurabilityMonths] = useState('60');
  const [ecoScore, setEcoScore] = useState('92');
  const [reviewConfidence, setReviewConfidence] = useState('95');
  const [carbonFootprintKg, setCarbonFootprintKg] = useState('1.5');
  const [carbonSavedKg, setCarbonSavedKg] = useState('18.2');
  const [reasonsToBuy, setReasonsToBuy] = useState('Lasts 5+ years with zero synthetic microplastics, 100% compostable packaging');
  const [reasonsNotToBuy, setReasonsNotToBuy] = useState('Requires hand washing and natural drying, Higher upfront cost');
  const [impulseRisk, setImpulseRisk] = useState<ImpulseRisk>('LOW');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [isRescueDeal, setIsRescueDeal] = useState(false);
  const [rescueDiscountPercent, setRescueDiscountPercent] = useState('50');
  const [stock, setStock] = useState('20');

  const computedPrice = parseFloat(price) || 0;
  const computedDurability = parseInt(durabilityMonths, 10) || 1;
  const costPerMonth = (computedPrice / computedDurability).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rToBuy = reasonsToBuy
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const rNotBuy = reasonsNotToBuy
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'> = {
      name: name.trim(),
      tagline: tagline.trim() || 'Sustainable mindful everyday craftsmanship',
      description: description.trim() || 'Engineered with circular materials for maximum lifecycle utility.',
      category,
      needTier,
      price: computedPrice,
      originalPrice: isRescueDeal ? Math.round(computedPrice * 1.8) : undefined,
      ecoScore: Math.min(100, Math.max(1, parseInt(ecoScore, 10) || 80)),
      durabilityMonths: computedDurability,
      reviewConfidence: Math.min(100, Math.max(50, parseInt(reviewConfidence, 10) || 90)),
      reviewCount: 28,
      rating: 4.8,
      image: image || PRESET_IMAGES[0].url,
      carbonFootprintKg: parseFloat(carbonFootprintKg) || 1.2,
      carbonSavedKg: parseFloat(carbonSavedKg) || 10.0,
      reasonsToBuy: rToBuy.length > 0 ? rToBuy : ['Durable construction', 'Zero single-use waste'],
      reasonsNotToBuy: rNotBuy.length > 0 ? rNotBuy : ['Verify you do not already own a functional equivalent'],
      impulseRisk,
      isRescueDeal,
      rescueDiscountPercent: isRescueDeal ? parseInt(rescueDiscountPercent, 10) || 40 : undefined,
      expiryDate: isRescueDeal ? new Date(Date.now() + 48 * 3600 * 1000).toISOString() : undefined,
      stock: parseInt(stock, 10) || 15
    };

    addProduct(newProd);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-600" />
          List Sustainable Product with Durability Metrics
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Provide verified lifecycle data so VIBE MART can compute true monthly cost and fit scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Linen Table Runner"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tagline / Key Hook</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 100% natural European flax, machine washable"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-600 outline-none"
              >
                <option value="Home & Living">Home & Living</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Apparel">Apparel</option>
                <option value="Electronics">Electronics</option>
                <option value="Recreation">Recreation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Need Classification</label>
              <select
                value={needTier}
                onChange={(e) => setNeedTier(e.target.value as NeedTier)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:border-emerald-600 outline-none font-bold"
              >
                <option value="ESSENTIAL">ESSENTIAL (Everyday Need)</option>
                <option value="FLEXIBLE">FLEXIBLE (Utility Upgrade)</option>
                <option value="OPTIONAL">OPTIONAL (Lifestyle / Discretionary)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe materials, manufacturing origin, and end-of-life recycling..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Pricing, Durability & Eco Intelligence */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Purchase Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lifespan (Months)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={durabilityMonths}
                  onChange={(e) => setDurabilityMonths(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers font-bold"
                />
              </div>
            </div>
          </div>

          {/* Computed True Cost / Month Live Preview */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Computed True Cost / Month:
            </span>
            <span className="font-mono-numbers font-bold text-sm text-emerald-800">
              ₹{costPerMonth}/mo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Eco-Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={ecoScore}
                onChange={(e) => setEcoScore(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">CO₂ Diverted (kg)</label>
              <input
                type="number"
                step="0.1"
                value={carbonSavedKg}
                onChange={(e) => setCarbonSavedKg(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers"
              />
            </div>
          </div>

          {/* Preset Image Chooser */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Image Asset</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(img.url)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition ${
                    image === img.url
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste custom image URL"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-[11px] focus:border-emerald-600 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Devil's Advocate Critical Audits input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        <div>
          <label className="block font-semibold text-emerald-900 mb-1">
            Reasons to Buy (comma-separated):
          </label>
          <input
            type="text"
            value={reasonsToBuy}
            onChange={(e) => setReasonsToBuy(e.target.value)}
            className="w-full px-3 py-2 border border-emerald-200 rounded-xl focus:border-emerald-600 outline-none bg-emerald-50/40 text-[11px]"
          />
        </div>

        <div>
          <label className="block font-semibold text-rose-900 mb-1">
            Devil's Advocate Concerns (comma-separated):
          </label>
          <input
            type="text"
            value={reasonsNotToBuy}
            onChange={(e) => setReasonsNotToBuy(e.target.value)}
            className="w-full px-3 py-2 border border-rose-200 rounded-xl focus:border-rose-600 outline-none bg-rose-50/40 text-[11px]"
          />
        </div>
      </div>

      {/* Rescue Deal Checkbox */}
      <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-900">
          <input
            type="checkbox"
            checked={isRescueDeal}
            onChange={(e) => setIsRescueDeal(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
          />
          <Flame className="w-4 h-4 text-rose-600" />
          <span>Mark as near-expiry VIBE Rescue Deal (Clearance from Landfill)</span>
        </label>

        {isRescueDeal && (
          <div className="flex items-center gap-3 pt-2 text-slate-700">
            <span>Discount Percentage:</span>
            <input
              type="number"
              min="20"
              max="80"
              value={rescueDiscountPercent}
              onChange={(e) => setRescueDiscountPercent(e.target.value)}
              className="w-20 px-2 py-1 border border-rose-300 rounded-lg font-mono-numbers font-bold text-rose-700"
            />
            <span className="text-[11px] text-slate-500">% OFF standard retail</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Publish to VIBE Catalog</span>
        </button>
      </div>
    </form>
  );
};
