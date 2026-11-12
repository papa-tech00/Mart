export type NeedTier = 'ESSENTIAL' | 'FLEXIBLE' | 'OPTIONAL';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export type ImpulseRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export type SatisfactionFeedback = 'SATISFIED' | 'MILD_REGRET' | 'HIGH_REGRET' | null;

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  needTier: NeedTier;
  price: number; // in INR (₹)
  originalPrice?: number;
  ecoScore: number; // 1-100
  durabilityMonths: number; // Lifespan in months
  reviewConfidence: number; // 0-100% confidence rating
  reviewCount: number;
  rating: number; // 1.0 - 5.0
  image: string;
  carbonFootprintKg: number;
  carbonSavedKg: number;
  reasonsToBuy: string[];
  reasonsNotToBuy: string[];
  impulseRisk: ImpulseRisk;
  isRescueDeal?: boolean;
  rescueDiscountPercent?: number;
  expiryDate?: string; // ISO string for countdown
  stock: number;
  sellerId: string;
  sellerName: string;
  alternativeProductId?: string; // Recommended swap
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface FitScoreBreakdown {
  totalScore: number; // 0 - 100
  needMatchScore: number; // 0 - 25
  budgetFitScore: number; // 0 - 25
  ecoDurabilityScore: number; // 0 - 20
  reviewConfidenceScore: number; // 0 - 15
  longTermValueScore: number; // 0 - 15
  costPerMonth: number;
  feedbackAdjustment: number;
}

export interface DecisionSnapshot {
  snapshotId: string;
  createdAt: string;
  monthlyBudgetBefore: number;
  monthlyBudgetRemainingBefore: number;
  monthlyBudgetRemainingAfter: number;
  cartTotal: number;
  essentialSpend: number;
  flexibleSpend: number;
  optionalSpend: number;
  averageFitScore: number;
  purchaseConfidenceScore: number;
  itemCount: number;
  acknowledgedWarnings: string[];
  counterfactualPotentialMonthlySavings: number;
  counterfactualPotentialCo2SavingsKg: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  durabilityMonths: number;
  needTier: NeedTier;
  costPerMonth: number;
  quantity: number;
  image: string;
  ecoScore: number;
  fitScoreAtPurchase: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
}

export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';

export interface PaymentInfo {
  method: PaymentMethod;
  upiId?: string;
  cardLast4?: string;
  cardHolderName?: string;
  bankName?: string;
  walletName?: string;
  transactionId: string;
  timestamp: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  decisionSnapshot: DecisionSnapshot;
  shippingAddress?: ShippingAddress;
  paymentInfo?: PaymentInfo;
  satisfactionFeedback: SatisfactionFeedback;
  feedbackNotes?: string;
  feedbackUpdatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  monthlyBudget: number; // default ₹15,000
  personalRegretThreshold?: number;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  monthlyBudget: number;
}

export interface PlatformMetrics {
  totalUsersProtected: number;
  avgBudgetSavedPercent: number;
  totalImpulsePurchasesPrevented: number;
  platformRegretReductionRate: number; // e.g. 78.4%
  totalCo2DivertedKg: number;
  activeRescueDealsCount: number;
  expiredDealsPurged: number;
  totalRupeesSaved: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  intentTag?: 'BUDGET' | 'FIT_SCORE' | 'SWAP' | 'REGRET' | 'GENERAL';
}
