import { Product, CartItem, Order, UserProfile, PlatformMetrics, RegisteredAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_PLATFORM_METRICS } from '../mockData/initialProducts';

const STORAGE_KEYS = {
  USER: 'vibemart_user',
  REGISTERED_ACCOUNTS: 'vibemart_registered_users',
  PRODUCTS: 'vibemart_products',
  CART: 'vibemart_cart',
  ORDERS: 'vibemart_orders',
  BUDGET_LIMIT: 'vibemart_budget_limit',
  SPENT_THIS_MONTH: 'vibemart_spent_this_month',
  PLATFORM_METRICS: 'vibemart_platform_metrics'
};

export const DEMO_USERS: Record<string, UserProfile> = {
  buyer: {
    id: 'user-yali',
    name: 'Yali Sharma',
    email: 'yali@vibemart.in',
    role: 'BUYER',
    avatar: 'YS',
    monthlyBudget: 15000,
    personalRegretThreshold: 15
  },
  seller: {
    id: 'seller-heritage',
    name: 'Heritage Artisan Studio',
    email: 'seller@vibemart.in',
    role: 'SELLER',
    avatar: 'HA',
    monthlyBudget: 50000
  },
  admin: {
    id: 'admin-alex',
    name: 'VIBE Admin Director',
    email: 'admin@vibemart.in',
    role: 'ADMIN',
    avatar: 'VA',
    monthlyBudget: 100000
  }
};

export const INITIAL_REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-yali',
    name: 'Yali Sharma',
    email: 'yali@vibemart.in',
    passwordHash: 'vibe123',
    role: 'BUYER',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    monthlyBudget: 15000
  },
  {
    id: 'seller-heritage',
    name: 'Heritage Artisan Studio',
    email: 'seller@vibemart.in',
    passwordHash: 'seller123',
    role: 'SELLER',
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    monthlyBudget: 50000
  },
  {
    id: 'admin-alex',
    name: 'VIBE Admin Director',
    email: 'admin@vibemart.in',
    passwordHash: 'admin123',
    role: 'ADMIN',
    createdAt: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    monthlyBudget: 100000
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'VIBE-IN-8921',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 'prod-ess-3',
        productName: 'Modular Zero-Waste Safety Razor Kit',
        price: 899,
        durabilityMonths: 180,
        needTier: 'ESSENTIAL',
        costPerMonth: 4.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
        ecoScore: 98,
        fitScoreAtPurchase: 95
      },
      {
        productId: 'prod-res-2',
        productName: 'Biodegradable Bamboo Toothbrush Family 6-Pack',
        price: 249,
        durabilityMonths: 18,
        needTier: 'ESSENTIAL',
        costPerMonth: 13.83,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80',
        ecoScore: 99,
        fitScoreAtPurchase: 97
      }
    ],
    totalAmount: 1148,
    decisionSnapshot: {
      snapshotId: 'SNAP-IN-8921',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyBudgetBefore: 15000,
      monthlyBudgetRemainingBefore: 12500,
      monthlyBudgetRemainingAfter: 11352,
      cartTotal: 1148,
      essentialSpend: 1148,
      flexibleSpend: 0,
      optionalSpend: 0,
      averageFitScore: 96,
      purchaseConfidenceScore: 95,
      itemCount: 2,
      acknowledgedWarnings: [
        'Confirmed safety razor angle technique understood'
      ],
      counterfactualPotentialMonthlySavings: 0,
      counterfactualPotentialCo2SavingsKg: 20.5
    },
    shippingAddress: {
      fullName: 'Yali Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Green Meadows Apt, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038'
    },
    paymentInfo: {
      method: 'UPI',
      upiId: 'yali@okhdfcbank',
      transactionId: 'TXN-UPI-984210',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    satisfactionFeedback: 'SATISFIED',
    feedbackNotes: 'Shave quality is incredible and saved approximately ₹450 on plastic cartridges this month alone.',
    feedbackUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'VIBE-IN-7104',
    date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        productId: 'prod-opt-1',
        productName: 'Smart Ambient Botanical Terrarium with App Glow',
        price: 4499,
        durabilityMonths: 24,
        needTier: 'OPTIONAL',
        costPerMonth: 187.46,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
        ecoScore: 68,
        fitScoreAtPurchase: 52
      }
    ],
    totalAmount: 4499,
    decisionSnapshot: {
      snapshotId: 'SNAP-IN-7104',
      createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyBudgetBefore: 15000,
      monthlyBudgetRemainingBefore: 6200,
      monthlyBudgetRemainingAfter: 1701,
      cartTotal: 4499,
      essentialSpend: 0,
      flexibleSpend: 0,
      optionalSpend: 4499,
      averageFitScore: 52,
      purchaseConfidenceScore: 46,
      itemCount: 1,
      acknowledgedWarnings: [
        'Proceeded despite high regret risk alert for discretionary lifestyle decor'
      ],
      counterfactualPotentialMonthlySavings: 4499,
      counterfactualPotentialCo2SavingsKg: 2.1
    },
    shippingAddress: {
      fullName: 'Yali Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Green Meadows Apt, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038'
    },
    paymentInfo: {
      method: 'CARD',
      cardLast4: '4242',
      cardHolderName: 'YALI SHARMA',
      transactionId: 'TXN-CRD-710422',
      timestamp: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString()
    },
    satisfactionFeedback: 'MILD_REGRET',
    feedbackNotes: 'Looks aesthetic on the desk, but ₹4,499 was too high for a novelty and Bluetooth misting is finicky.',
    feedbackUpdatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user', e);
  }
  return null; // Landing page first if not logged in!
}

export function saveStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function getStoredRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_REGISTERED_ACCOUNTS;
}

export function saveStoredRegisteredAccount(account: RegisteredAccount): void {
  try {
    const existing = getStoredRegisteredAccounts();
    const updated = [account, ...existing.filter(a => a.email.toLowerCase() !== account.email.toLowerCase())];
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save account', e);
  }
}

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load products', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load cart', e);
  }
  return [
    {
      product: INITIAL_PRODUCTS[0], // Cast Iron Dutch Oven ₹2,899
      quantity: 1,
      addedAt: new Date().toISOString()
    }
  ];
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load orders', e);
  }
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export function getStoredBudgetLimit(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGET_LIMIT);
    if (raw) return Number(raw);
  } catch (e) {}
  return 15000; // default ₹15,000/mo
}

export function saveStoredBudgetLimit(limit: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET_LIMIT, String(limit));
  } catch (e) {}
}

export function getStoredSpentThisMonth(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPENT_THIS_MONTH);
    if (raw) return Number(raw);
  } catch (e) {}
  return 3500; // pre-seeded ₹3,500 spent
}

export function saveStoredSpentThisMonth(spent: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SPENT_THIS_MONTH, String(spent));
  } catch (e) {}
}

export function getStoredPlatformMetrics(): PlatformMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORM_METRICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_PLATFORM_METRICS;
}

export function saveStoredPlatformMetrics(metrics: PlatformMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLATFORM_METRICS, JSON.stringify(metrics));
  } catch (e) {}
}

export function resetAllToDefault(): void {
  try {
    localStorage.clear();
    saveStoredUser(DEMO_USERS.buyer);
    saveStoredProducts(INITIAL_PRODUCTS);
    saveStoredOrders(INITIAL_ORDERS);
    saveStoredBudgetLimit(15000);
    saveStoredSpentThisMonth(3500);
    saveStoredPlatformMetrics(INITIAL_PLATFORM_METRICS);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
  } catch (e) {
    console.error('Reset failed', e);
  }
}
