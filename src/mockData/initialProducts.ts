import { Product, PlatformMetrics } from '../types';

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

export const INITIAL_PRODUCTS: Product[] = [
  // --- ESSENTIAL TIERS ---
  {
    id: 'prod-ess-1',
    name: 'Cast Iron Dutch Oven 5.5 Qt',
    tagline: 'Multi-generational cookware built for zero-waste kitchens',
    description: 'Forged from 100% recycled pre-seasoned iron. Replaces 4 non-stick pans that degrade in under 2 years. Lifetime heirloom durability with zero synthetic PFAS coatings.',
    category: 'Kitchenware',
    needTier: 'ESSENTIAL',
    price: 2899,
    originalPrice: 3999,
    ecoScore: 96,
    durabilityMonths: 240, // 20 years
    reviewConfidence: 98,
    reviewCount: 412,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1584990347449-a2e6f4995f51?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 4.2,
    carbonSavedKg: 28.5,
    reasonsToBuy: [
      'Lasts 20+ years (True cost only ₹12.08/month)',
      '100% naturally non-stick without chemical coatings (PFAS-free)',
      'Compatible with induction, gas stoves, oven, and chulhas'
    ],
    reasonsNotToBuy: [
      'Heavyweight (5.6 kg) requires two hands and careful handling',
      'Requires periodic oil seasoning and dry towel storage'
    ],
    impulseRisk: 'LOW',
    stock: 24,
    sellerId: 'seller-heritage',
    sellerName: 'Heritage Foundry Co.',
    alternativeProductId: 'prod-flx-1'
  },
  {
    id: 'prod-ess-2',
    name: 'Organic Hemp Percale Bed Sheets (Queen)',
    tagline: 'Hypoallergenic cooling sheets that soften with every wash',
    description: 'Zero pesticide raw hemp and GOTS-certified organic cotton blend. Requires 80% less water than industrial cotton and lasts 3x longer before thinning.',
    category: 'Home & Bedding',
    needTier: 'ESSENTIAL',
    price: 3499,
    originalPrice: 4499,
    ecoScore: 92,
    durabilityMonths: 72, // 6 years
    reviewConfidence: 94,
    reviewCount: 230,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 3.1,
    carbonSavedKg: 19.4,
    reasonsToBuy: [
      'Breathable thermal regulation for deep sleep in Indian climates',
      'Naturally antibacterial and dust-mite resistant',
      'Long-staple fibers prevent pilling for 6+ years (₹48.60/month)'
    ],
    reasonsNotToBuy: [
      'Higher upfront outlay than synthetic polyester alternatives',
      'Natural textured feel is crisp rather than silky-slick'
    ],
    impulseRisk: 'LOW',
    stock: 18,
    sellerId: 'seller-terraloom',
    sellerName: 'Terra Loom Textiles'
  },
  {
    id: 'prod-ess-3',
    name: 'Modular Zero-Waste Safety Razor Kit',
    tagline: 'All-metal precision grooming tool with 50 Swedish steel blades',
    description: 'Solid brass CNC-machined razor replacing single-use plastic cartridge refills forever. Includes 50 recyclable platinum-coated steel blades.',
    category: 'Personal Care',
    needTier: 'ESSENTIAL',
    price: 899,
    originalPrice: 1299,
    ecoScore: 98,
    durabilityMonths: 180, // 15 years
    reviewConfidence: 96,
    reviewCount: 520,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 0.8,
    carbonSavedKg: 12.0,
    reasonsToBuy: [
      'True cost per month: ₹4.99 (refill blades cost only ₹5 each)',
      'Prevents 48 plastic multi-blade cartridges from entering landfills per year',
      'Superior close shave with reduced ingrown hairs'
    ],
    reasonsNotToBuy: [
      'Steeper learning curve; requires a gentle 30-degree stroke without pressure',
      'Blades require safe storage in a used blade tin'
    ],
    impulseRisk: 'LOW',
    stock: 45,
    sellerId: 'seller-cleancut',
    sellerName: 'Clean Cut Precision'
  },
  {
    id: 'prod-ess-4',
    name: 'Insulated Grade-316 Stainless Steel Flask (1000ml)',
    tagline: 'Double-wall vacuum flask keeping water chilled for 36 hours',
    description: 'Marine-grade 316 stainless interior resistant to corrosion and tea stains. Replaces hundreds of single-use PET bottles every single year.',
    category: 'Daily Living',
    needTier: 'ESSENTIAL',
    price: 749,
    originalPrice: 999,
    ecoScore: 94,
    durabilityMonths: 120, // 10 years
    reviewConfidence: 97,
    reviewCount: 880,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 1.5,
    carbonSavedKg: 45.2,
    reasonsToBuy: [
      'Eliminates ~180 disposable mineral water bottles per year',
      'True cost: ₹6.24/month over 10-year lifespan',
      'Lifetime food-grade silicone leakproof seal'
    ],
    reasonsNotToBuy: [
      'Larger 1L size may not fit narrow two-wheeler bottle cages',
      'Exterior powder coat can scratch if dropped on rough gravel'
    ],
    impulseRisk: 'LOW',
    stock: 60,
    sellerId: 'seller-aquapure',
    sellerName: 'AquaPure Living'
  },

  // --- FLEXIBLE TIERS ---
  {
    id: 'prod-flx-1',
    name: 'Recycled Aluminum Ceramic Frying Pan (28cm)',
    tagline: 'Lightweight everyday pan with plant-based mineral release',
    description: 'Crafted from 100% recycled aluminum with a natural mineral sol-gel nonstick coating. Heats evenly with half the gas/induction energy.',
    category: 'Kitchenware',
    needTier: 'FLEXIBLE',
    price: 1399,
    originalPrice: 1899,
    ecoScore: 86,
    durabilityMonths: 48, // 4 years
    reviewConfidence: 91,
    reviewCount: 310,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 2.8,
    carbonSavedKg: 14.1,
    reasonsToBuy: [
      'Effortless dosa and egg flipping with zero chemical fumes',
      'Zero lead, cadmium, PTFE, or PFAS',
      'Accessible entry price at ₹29.15/month'
    ],
    reasonsNotToBuy: [
      'Ceramic coatings wear down after 3-5 years if overheated dry',
      'Cannot use abrasive metal ladles or steel scrubbers'
    ],
    impulseRisk: 'MEDIUM',
    stock: 35,
    sellerId: 'seller-heritage',
    sellerName: 'Heritage Foundry Co.',
    alternativeProductId: 'prod-ess-1'
  },
  {
    id: 'prod-flx-2',
    name: 'Fair-Trade Merino Wool Everyday Cardigan',
    tagline: 'Thermoregulating regenerative knitwear from family farms',
    description: 'Pure superfine merino wool spun from ethical sheep pastures. Naturally odor-resistant, requiring 75% fewer washing machine cycles.',
    category: 'Apparel',
    needTier: 'FLEXIBLE',
    price: 2999,
    originalPrice: 3999,
    ecoScore: 89,
    durabilityMonths: 60, // 5 years
    reviewConfidence: 89,
    reviewCount: 142,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 3.4,
    carbonSavedKg: 18.0,
    reasonsToBuy: [
      'Wear 10-15 times between gentle hand washes without odor build-up',
      'Versatile aesthetic for office AC environments and cool evenings',
      'Fully compostable and biodegradable at end of life'
    ],
    reasonsNotToBuy: [
      'Cannot be thrown into standard high-heat tumble dryers',
      'Flexible tier: check if your wardrobe already has 2+ warm jackets'
    ],
    impulseRisk: 'MEDIUM',
    stock: 14,
    sellerId: 'seller-terraloom',
    sellerName: 'Terra Loom Textiles'
  },
  {
    id: 'prod-flx-3',
    name: 'Cold-Brew Borosilicate Glass Carafe (1.2L)',
    tagline: 'Barista-grade smooth low-acid cold brew brewing at home',
    description: 'Heavy duty borosilicate lab glass carafe with micro-perforated stainless filter. Saves roughly ₹3,500/month compared to cafe takeaway drinks.',
    category: 'Kitchenware',
    needTier: 'FLEXIBLE',
    price: 1099,
    originalPrice: 1499,
    ecoScore: 88,
    durabilityMonths: 48,
    reviewConfidence: 93,
    reviewCount: 198,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 1.2,
    carbonSavedKg: 22.0,
    reasonsToBuy: [
      'Direct monthly budget upside: pays for itself in under 10 brews',
      'Zero paper coffee filter waste',
      'Airtight silicone seal keeps brew fresh in the fridge for 14 days'
    ],
    reasonsNotToBuy: [
      'Borosilicate glass will crack if struck against hard granite sinks',
      'Requires 16 hours brew planning time in advance'
    ],
    impulseRisk: 'LOW',
    stock: 22,
    sellerId: 'seller-aquapure',
    sellerName: 'AquaPure Living'
  },

  // --- OPTIONAL TIERS (Luxury / Impulse Triggers) ---
  {
    id: 'prod-opt-1',
    name: 'Smart Ambient Botanical Terrarium with App Glow',
    tagline: 'Self-watering indoor moss garden with circadian LED lighting',
    description: 'Automated glass biosphere with Bluetooth misting and programmable sunset LED hues. Designed for desktop mindfulness and aesthetic ambiance.',
    category: 'Home Decor',
    needTier: 'OPTIONAL',
    price: 4499,
    originalPrice: 5999,
    ecoScore: 68,
    durabilityMonths: 24, // 2 years
    reviewConfidence: 82,
    reviewCount: 74,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 8.5,
    carbonSavedKg: 2.1,
    reasonsToBuy: [
      'Captivating centerpiece for relaxing workspaces',
      'Automated watering handles up to 30 days absence',
      'Living moss purifies micro-desk air particles'
    ],
    reasonsNotToBuy: [
      'HIGH REGRET RISK: Pure discretionary lifestyle impulse item',
      'High true cost (₹187.46/month) compared to a simple ₹200 nursery houseplant',
      'Proprietary electronics & sensors have limited long-term repairability'
    ],
    impulseRisk: 'HIGH',
    stock: 12,
    sellerId: 'seller-neogreen',
    sellerName: 'NeoBotanica Labs',
    alternativeProductId: 'prod-res-3'
  },
  {
    id: 'prod-opt-2',
    name: 'Artisan Hand-Carved Wild Olivewood Chess Set',
    tagline: 'Sustainable fallen timber heirloom game set with brass accents',
    description: 'Each piece turned from non-producing orchard olive branches. Luxury tactile weight with magnetic board storage and velvet carrying wrap.',
    category: 'Recreation',
    needTier: 'OPTIONAL',
    price: 3999,
    originalPrice: 5200,
    ecoScore: 78,
    durabilityMonths: 120,
    reviewConfidence: 87,
    reviewCount: 56,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 2.1,
    carbonSavedKg: 4.8,
    reasonsToBuy: [
      'Stunning natural olive burl grain makes each piece unique',
      'Fallen orchard wood prevents live tree cutting',
      'Durable heirloom quality lasting 10+ years'
    ],
    reasonsNotToBuy: [
      'HIGH BUDGET BURDEN: Discretionary hobby spend eating ₹3,999 of monthly cap',
      'Check if you will play regularly or if it will gather shelf dust',
      'Devil\'s Advocate: Could reallocate toward emergency fund or groceries'
    ],
    impulseRisk: 'HIGH',
    stock: 8,
    sellerId: 'seller-artisanwood',
    sellerName: 'Fallen Timber Artisans'
  },
  {
    id: 'prod-opt-3',
    name: 'Acoustic Bamboo Wireless Noise-Cancelling Headphones',
    tagline: 'Natural acoustic chamber with plant-leather comfort earcups',
    description: 'Sustainable bamboo earcups provide warm natural acoustic resonance. Active noise cancellation with 35-hour battery life and replaceable battery cell.',
    category: 'Electronics',
    needTier: 'OPTIONAL',
    price: 4999,
    originalPrice: 6999,
    ecoScore: 74,
    durabilityMonths: 36, // 3 years
    reviewConfidence: 86,
    reviewCount: 115,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 7.2,
    carbonSavedKg: 5.6,
    reasonsToBuy: [
      'Modular headband and user-replaceable lithium battery module',
      'Warm soundstage enhanced by organic bamboo resonance chambers',
      'FSC-certified timber and 80% recycled aluminum frame'
    ],
    reasonsNotToBuy: [
      'High capital outlay (₹4,999) consumes ~33% of a ₹15,000 monthly budget',
      'If you already own working earphones, this is an upgrade impulse',
      'Cost per month is ₹138.86 compared to wired alternatives'
    ],
    impulseRisk: 'HIGH',
    stock: 9,
    sellerId: 'seller-cleancut',
    sellerName: 'Clean Cut Precision'
  },

  // --- RESCUE DEALS (Near-Expiry / Overstock Sustainable Goods with steep discounts) ---
  {
    id: 'prod-res-1',
    name: 'Artisan Cold-Pressed Almond Body Oil (Rescue Batch)',
    tagline: '56% OFF • Best before 20 days • 100% Organic & Cold-Pressed',
    description: 'Fresh batch from organic almond harvest. Pure unrefined vitamin E oil. Highly potent, sold at clearance to eliminate packaging waste before shelf rotation.',
    category: 'Personal Care',
    needTier: 'ESSENTIAL',
    price: 399,
    originalPrice: 899,
    ecoScore: 95,
    durabilityMonths: 3, // Fresh usage batch
    reviewConfidence: 94,
    reviewCount: 88,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608248597359-56135211b51e?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 0.6,
    carbonSavedKg: 6.4,
    reasonsToBuy: [
      'Rescue discount: 56% savings on certified organic cold-pressed oil',
      'Prevents high-value organic batch from being discarded',
      'Exceptional hydration for dry skin, hair, and cuticles'
    ],
    reasonsNotToBuy: [
      'Short shelf life: Must be consumed within 90 days of opening',
      'Store in a cool dark pantry away from direct sunlight'
    ],
    impulseRisk: 'LOW',
    isRescueDeal: true,
    rescueDiscountPercent: 56,
    expiryDate: new Date(now + oneDayMs * 1.5).toISOString(), // 36 hours left
    stock: 14,
    sellerId: 'seller-terraloom',
    sellerName: 'Terra Loom Organics'
  },
  {
    id: 'prod-res-2',
    name: 'Biodegradable Bamboo Toothbrush Family 6-Pack (Rescue Overstock)',
    tagline: '50% OFF • Packaging redesign clearance • Zero plastic',
    description: 'Surplus inventory from our previous natural kraft packaging line. Soft castor bean oil bristles with compostable bamboo handles. Guaranteed 100% pristine brushes.',
    category: 'Personal Care',
    needTier: 'ESSENTIAL',
    price: 249,
    originalPrice: 499,
    ecoScore: 99,
    durabilityMonths: 18, // 6 brushes x 3 months
    reviewConfidence: 97,
    reviewCount: 340,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 0.3,
    carbonSavedKg: 8.5,
    reasonsToBuy: [
      'True cost: ₹13.83/month for 1.5 years of family dental care',
      'Zero plastic: completely compostable handle in garden soil',
      '50% off clearance prevents packaging warehouse destruction'
    ],
    reasonsNotToBuy: [
      'Contains old kraft branding on the exterior paper sleeve',
      'Bristles are plant-castor oil, soft-medium firmness only'
    ],
    impulseRisk: 'LOW',
    isRescueDeal: true,
    rescueDiscountPercent: 50,
    expiryDate: new Date(now + oneDayMs * 2.8).toISOString(), // ~67 hours left
    stock: 28,
    sellerId: 'seller-cleancut',
    sellerName: 'Clean Cut Precision'
  },
  {
    id: 'prod-res-3',
    name: 'Solar-Charged Pocket Power Bank 10,000mAh (Refurbished Grade A)',
    tagline: '43% OFF • Certified circular refurb with fresh battery cell',
    description: 'Factory-tested device with 100% fresh Li-polymer battery and Monocrystalline solar panel lid. Dual USB-C fast charging with rugged shockproof bumper.',
    category: 'Electronics',
    needTier: 'FLEXIBLE',
    price: 849,
    originalPrice: 1499,
    ecoScore: 91,
    durabilityMonths: 48,
    reviewConfidence: 90,
    reviewCount: 165,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    carbonFootprintKg: 1.8,
    carbonSavedKg: 14.8,
    reasonsToBuy: [
      'Certified Grade A refurbished: Keeps electronics out of e-waste dumps',
      'Solar trickle charging keeps you powered during outdoor trips or power cuts',
      'True value: ₹17.69/month over 4-year lifespan'
    ],
    reasonsNotToBuy: [
      'Solar recharge is designed for emergency top-up, wall socket is 8x faster',
      'Minor cosmetic surface blemish on rear corner rubber casing'
    ],
    impulseRisk: 'LOW',
    isRescueDeal: true,
    rescueDiscountPercent: 43,
    expiryDate: new Date(now + oneDayMs * 0.8).toISOString(), // ~19 hours left
    stock: 9,
    sellerId: 'seller-aquapure',
    sellerName: 'AquaPure Living'
  }
];

export const INITIAL_PLATFORM_METRICS: PlatformMetrics = {
  totalUsersProtected: 4128,
  avgBudgetSavedPercent: 34.2,
  totalImpulsePurchasesPrevented: 1894,
  platformRegretReductionRate: 78.4,
  totalCo2DivertedKg: 14280,
  activeRescueDealsCount: 3,
  expiredDealsPurged: 42,
  totalRupeesSaved: 1485000
};
