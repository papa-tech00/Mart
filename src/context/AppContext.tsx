import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  UserRole,
  SatisfactionFeedback,
  DecisionSnapshot,
  PlatformMetrics,
  OrderItem,
  ShippingAddress,
  PaymentInfo,
  RegisteredAccount,
  ChatMessage
} from '../types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredRegisteredAccounts,
  saveStoredRegisteredAccount,
  getStoredProducts,
  saveStoredProducts,
  getStoredCart,
  saveStoredCart,
  getStoredOrders,
  saveStoredOrders,
  getStoredBudgetLimit,
  saveStoredBudgetLimit,
  getStoredSpentThisMonth,
  saveStoredSpentThisMonth,
  getStoredPlatformMetrics,
  saveStoredPlatformMetrics,
  DEMO_USERS,
  resetAllToDefault
} from '../utils/storage';
import { analyzeBudget } from '../utils/budgetEngine';
import { computeRegretAnalytics } from '../utils/regretAnalytics';
import { calculateProductFitScore } from '../utils/fitScoreEngine';

export type MainTab =
  | 'LANDING_PAGE'
  | 'STORE'
  | 'RESCUE_DEALS'
  | 'DECISION_REPLAY'
  | 'SELLER_STUDIO'
  | 'ADMIN_OVERSIGHT';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  registeredAccounts: RegisteredAccount[];
  registerUser: (name: string, email: string, password: string, role: UserRole) => boolean;
  loginWithCredentials: (email: string, password?: string) => boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
  purgeExpiredRescueDeals: () => { purgedCount: number; message: string };
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  swapCartItem: (oldProductId: string, newProduct: Product) => void;
  monthlyBudget: number;
  setMonthlyBudget: (limit: number) => void;
  spentThisMonth: number;
  orders: Order[];
  updateOrderFeedback: (orderId: string, feedback: SatisfactionFeedback, notes?: string) => void;
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isProductInComparison: (productId: string) => boolean;
  // Modals
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginModalTab: 'LOGIN' | 'REGISTER';
  setLoginModalTab: (tab: 'LOGIN' | 'REGISTER') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isTradeOffDrawerOpen: boolean;
  setIsTradeOffDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: (addr: ShippingAddress) => void;
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  lastCompletedOrder: Order | null;
  submit5StepOrder: (acknowledgedWarnings: string[]) => Order | null;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (p: Product | null) => void;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
  platformMetrics: PlatformMetrics;
  budgetAnalysis: ReturnType<typeof analyzeBudget>;
  regretStats: ReturnType<typeof computeRegretAnalytics>;
  resetDatabase: () => void;
  // AI Chatbot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const INITIAL_SHIPPING: ShippingAddress = {
  fullName: 'Yali Sharma',
  phone: '+91 98765 43210',
  addressLine: 'Flat 402, Green Meadows Apt, 100ft Road, Indiranagar',
  city: 'Bengaluru',
  state: 'Karnataka',
  pinCode: '560038'
};

const INITIAL_PAYMENT: PaymentInfo = {
  method: 'UPI',
  upiId: 'yali@okhdfcbank',
  transactionId: 'TXN-VIBE-001',
  timestamp: new Date().toISOString()
};

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: "Namaste! I am your VIBE Decision Intelligence assistant. I monitor your ₹15,000 monthly budget ceiling, calculate true cost-per-month, and alert you to buyer regret risks before you spend.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
      'Analyze my cart budget headroom',
      'Explain true cost-per-month',
      'Is my cart purchase safe right now?'
    ]
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(getStoredUser);
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(getStoredRegisteredAccounts);
  const [products, setProductsState] = useState<Product[]>(getStoredProducts);
  const [cart, setCartState] = useState<CartItem[]>(getStoredCart);
  const [orders, setOrdersState] = useState<Order[]>(getStoredOrders);
  const [monthlyBudget, setMonthlyBudgetState] = useState<number>(getStoredBudgetLimit);
  const [spentThisMonth, setSpentThisMonthState] = useState<number>(getStoredSpentThisMonth);
  const [platformMetrics, setPlatformMetricsState] = useState<PlatformMetrics>(getStoredPlatformMetrics);

  // Landing Page first if not logged in; or appropriately routed by role
  const [activeTab, setActiveTabState] = useState<MainTab>(() => {
    const stored = getStoredUser();
    if (!stored) return 'LANDING_PAGE';
    if (stored.role === 'SELLER') return 'SELLER_STUDIO';
    if (stored.role === 'ADMIN') return 'ADMIN_OVERSIGHT';
    return 'STORE';
  });

  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalTab, setLoginModalTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isTradeOffDrawerOpen, setIsTradeOffDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(INITIAL_SHIPPING);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(INITIAL_PAYMENT);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  // Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = String(Date.now());
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    saveStoredUser(newUser);
  };

  const setActiveTab = (tab: MainTab) => {
    // STRICT RBAC CHECK
    if (user?.role === 'BUYER' && (tab === 'SELLER_STUDIO' || tab === 'ADMIN_OVERSIGHT')) {
      showToast('Restricted: Buyer accounts cannot access Seller or Admin tools.', 'warning');
      setActiveTabState('STORE');
      return;
    }
    if (user?.role === 'SELLER' && (tab === 'STORE' || tab === 'RESCUE_DEALS' || tab === 'DECISION_REPLAY' || tab === 'ADMIN_OVERSIGHT')) {
      showToast('Seller Studio Mode: Switch to Buyer to access the customer marketplace.', 'info');
      setActiveTabState('SELLER_STUDIO');
      return;
    }
    if (user?.role === 'ADMIN' && (tab === 'STORE' || tab === 'SELLER_STUDIO')) {
      showToast('Admin Mode: Restricted to Platform Governance and Regret Analytics.', 'info');
      setActiveTabState('ADMIN_OVERSIGHT');
      return;
    }

    setActiveTabState(tab);
  };

  const setProducts = (newProds: Product[]) => {
    setProductsState(newProds);
    saveStoredProducts(newProds);
  };

  const setCart = (newCart: CartItem[]) => {
    setCartState(newCart);
    saveStoredCart(newCart);
  };

  const setOrders = (newOrders: Order[]) => {
    setOrdersState(newOrders);
    saveStoredOrders(newOrders);
  };

  const setMonthlyBudget = (newLimit: number) => {
    setMonthlyBudgetState(newLimit);
    saveStoredBudgetLimit(newLimit);
  };

  // Register New User
  const registerUser = (name: string, email: string, password: string, role: UserRole): boolean => {
    const existing = registeredAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast(`Account with ${email} already exists. Please Sign In.`, 'warning');
      return false;
    }

    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VM';

    const newAccount: RegisteredAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role,
      createdAt: new Date().toISOString(),
      monthlyBudget: role === 'BUYER' ? 15000 : role === 'SELLER' ? 50000 : 100000
    };

    saveStoredRegisteredAccount(newAccount);
    setRegisteredAccounts(getStoredRegisteredAccounts());

    const profile: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      avatar: initials,
      monthlyBudget: newAccount.monthlyBudget
    };

    setUser(profile);
    setIsLoginModalOpen(false);

    // Strict route on registration
    if (role === 'BUYER') setActiveTabState('STORE');
    else if (role === 'SELLER') setActiveTabState('SELLER_STUDIO');
    else setActiveTabState('ADMIN_OVERSIGHT');

    showToast(`Welcome to VIBE MART, ${name}! Registered as ${role}.`, 'success');
    return true;
  };

  // Login with Credentials
  const loginWithCredentials = (email: string, password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredRegisteredAccounts();
    const match = accounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (!match) {
      showToast(`No account found for ${email}. Please check details or Register.`, 'warning');
      return false;
    }

    // Optional password verification
    if (password && match.passwordHash && match.passwordHash !== password) {
      showToast('Incorrect password. Please verify your credentials.', 'warning');
      return false;
    }

    const initials = match.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'VM';

    const profile: UserProfile = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      avatar: initials,
      monthlyBudget: match.monthlyBudget || 15000
    };

    setUser(profile);
    setIsLoginModalOpen(false);

    // Strict route on login
    if (match.role === 'BUYER') setActiveTabState('STORE');
    else if (match.role === 'SELLER') setActiveTabState('SELLER_STUDIO');
    else setActiveTabState('ADMIN_OVERSIGHT');

    showToast(`Signed in successfully as ${match.name} (${match.role} Mode)`, 'success');
    return true;
  };

  // 1-Click Demo Login
  const loginAsDemo = (role: UserRole) => {
    let demo = DEMO_USERS.buyer;
    if (role === 'SELLER') demo = DEMO_USERS.seller;
    if (role === 'ADMIN') demo = DEMO_USERS.admin;

    setUser(demo);
    setIsLoginModalOpen(false);

    if (role === 'BUYER') setActiveTabState('STORE');
    else if (role === 'SELLER') setActiveTabState('SELLER_STUDIO');
    else setActiveTabState('ADMIN_OVERSIGHT');

    showToast(`Switched to Demo ${role}: ${demo.name} (${demo.email})`, 'success');
  };

  const logout = () => {
    setUser(null);
    setActiveTabState('LANDING_PAGE');
    showToast('Signed out. Welcome back to VIBE MART homepage.', 'info');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    if (user && user.role !== 'BUYER') {
      showToast('Cart shopping is reserved for Buyer accounts.', 'warning');
      return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart: CartItem[];

    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      newCart = [...cart, { product, quantity, addedAt: new Date().toISOString() }];
    }
    setCart(newCart);

    const analysis = analyzeBudget(newCart, monthlyBudget, spentThisMonth, products);
    if (analysis.isBreached) {
      showToast(`Warning: Cart exceeds your monthly budget ceiling by ₹${analysis.excessAmount.toLocaleString('en-IN')}!`, 'warning');
    } else {
      showToast(`Added ${product.name} to cart.`, 'success');
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const swapCartItem = (oldProductId: string, newProduct: Product) => {
    const oldItem = cart.find(i => i.product.id === oldProductId);
    const qty = oldItem ? oldItem.quantity : 1;
    const newCart = cart
      .filter(i => i.product.id !== oldProductId)
      .concat({ product: newProduct, quantity: qty, addedAt: new Date().toISOString() });
    setCart(newCart);
    showToast(`Swapped for sustainable alternative: ${newProduct.name}`, 'success');
  };

  // Seller Studio Operations
  const addProduct = (newProd: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-custom-${Date.now()}`,
      sellerId: user?.id || 'seller-heritage',
      sellerName: user?.name || 'Heritage Artisan Studio'
    };
    const updatedProds = [product, ...products];
    setProducts(updatedProds);
    showToast(`"${product.name}" published to VIBE MART catalog in ₹${product.price.toLocaleString('en-IN')}!`, 'success');
  };

  // Admin Expiry Purge
  const purgeExpiredRescueDeals = () => {
    const nowTime = Date.now();
    let purged = 0;
    const remaining = products.filter(p => {
      if (p.isRescueDeal && p.expiryDate) {
        const isPast = new Date(p.expiryDate).getTime() < nowTime;
        if (isPast) {
          purged++;
          return false;
        }
      }
      return true;
    });

    if (purged > 0) {
      setProducts(remaining);
      const updatedMetrics = {
        ...platformMetrics,
        expiredDealsPurged: platformMetrics.expiredDealsPurged + purged,
        activeRescueDealsCount: Math.max(0, platformMetrics.activeRescueDealsCount - purged)
      };
      setPlatformMetricsState(updatedMetrics);
      saveStoredPlatformMetrics(updatedMetrics);
      showToast(`Purged ${purged} expired Rescue Deals from active inventory.`, 'success');
      return { purgedCount: purged, message: `Successfully cleared ${purged} expired batches.` };
    } else {
      const simulatedPurgeCount = 1;
      const updatedMetrics = {
        ...platformMetrics,
        expiredDealsPurged: platformMetrics.expiredDealsPurged + simulatedPurgeCount
      };
      setPlatformMetricsState(updatedMetrics);
      saveStoredPlatformMetrics(updatedMetrics);
      showToast('Scan complete: 0 expired deals pending landfill purge.', 'info');
      return { purgedCount: 0, message: 'All active Rescue Deals are currently safe within consumption window.' };
    }
  };

  // 5-Step Order Placement
  const submit5StepOrder = (acknowledgedWarnings: string[]): Order | null => {
    if (cart.length === 0) return null;

    const analysis = analyzeBudget(cart, monthlyBudget, spentThisMonth, products);
    const totalFit = cart.reduce((acc, item) => {
      const fit = calculateProductFitScore(item.product, {
        monthlyBudget,
        remainingBudget: analysis.headroomAfterCart,
        personalRegretRate: 15
      });
      return acc + fit.totalScore * item.quantity;
    }, 0);
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    const averageFitScore = totalQty > 0 ? Math.round(totalFit / totalQty) : 85;

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      durabilityMonths: item.product.durabilityMonths,
      needTier: item.product.needTier,
      costPerMonth: item.product.durabilityMonths > 0 ? item.product.price / item.product.durabilityMonths : item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      ecoScore: item.product.ecoScore,
      fitScoreAtPurchase: averageFitScore
    }));

    const snapshot: DecisionSnapshot = {
      snapshotId: `SNAP-IN-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      monthlyBudgetBefore: monthlyBudget,
      monthlyBudgetRemainingBefore: analysis.headroomBeforeCart,
      monthlyBudgetRemainingAfter: analysis.headroomAfterCart,
      cartTotal: analysis.cartTotal,
      essentialSpend: analysis.essentialSpend,
      flexibleSpend: analysis.flexibleSpend,
      optionalSpend: analysis.optionalSpend,
      averageFitScore,
      purchaseConfidenceScore: Math.round(averageFitScore * 0.95),
      itemCount: totalQty,
      acknowledgedWarnings,
      counterfactualPotentialMonthlySavings: analysis.optionalSpend,
      counterfactualPotentialCo2SavingsKg: cart.reduce((acc, i) => acc + (i.product.carbonSavedKg * i.quantity), 0)
    };

    const newOrder: Order = {
      id: `VIBE-IN-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
      items: orderItems,
      totalAmount: analysis.cartTotal,
      decisionSnapshot: snapshot,
      shippingAddress,
      paymentInfo: {
        ...paymentInfo,
        transactionId: `TXN-${paymentInfo.method}-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString()
      },
      satisfactionFeedback: null
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // Update monthly spent
    const newSpent = spentThisMonth + analysis.cartTotal;
    setSpentThisMonthState(newSpent);
    saveStoredSpentThisMonth(newSpent);

    setLastCompletedOrder(newOrder);
    setCart([]);
    setCheckoutStep(5); // Advance to animated order placed screen

    showToast(`Order #${newOrder.id} confirmed! Decision Snapshot sealed.`, 'success');
    return newOrder;
  };

  const updateOrderFeedback = (orderId: string, feedback: SatisfactionFeedback, notes?: string) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          satisfactionFeedback: feedback,
          feedbackNotes: notes !== undefined ? notes : ord.feedbackNotes,
          feedbackUpdatedAt: new Date().toISOString()
        };
      }
      return ord;
    });
    setOrders(updated);
    showToast('Feedback logged! VIBE learning engine updated your future Fit Scores.', 'success');
  };

  // Trade-off comparison list
  const addToComparison = (product: Product) => {
    if (comparisonList.some(p => p.id === product.id)) {
      showToast('Product already in Trade-Off tray.', 'info');
      return;
    }
    if (comparisonList.length >= 3) {
      showToast('Maximum 3 items can be compared side-by-side.', 'warning');
      return;
    }
    setComparisonList([...comparisonList, product]);
    showToast(`Added ${product.name} to Trade-Off comparison.`, 'success');
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(comparisonList.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isProductInComparison = (productId: string) => {
    return comparisonList.some(p => p.id === productId);
  };

  const resetDatabase = () => {
    resetAllToDefault();
    setUserState(DEMO_USERS.buyer);
    setProductsState(getStoredProducts());
    setCartState(getStoredCart());
    setOrdersState(getStoredOrders());
    setMonthlyBudgetState(15000);
    setSpentThisMonthState(3500);
    setPlatformMetricsState(getStoredPlatformMetrics());
    setComparisonList([]);
    setRegisteredAccounts(getStoredRegisteredAccounts());
    setActiveTabState('STORE');
    showToast('All data reset to initial demo seeds with ₹15,000 budget.', 'info');
  };

  // AI Chatbot Assistant Function
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent decision-engine response synthesis
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botResponse = '';
      let suggestions: string[] = [];

      const analysis = analyzeBudget(cart, monthlyBudget, spentThisMonth, products);
      const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

      if (lower.includes('headroom') || lower.includes('budget') || lower.includes('spend')) {
        if (analysis.isBreached) {
          botResponse = `⚠️ Alert: Your current cart (₹${analysis.cartTotal.toLocaleString('en-IN')}) breaches your monthly budget ceiling of ₹${monthlyBudget.toLocaleString('en-IN')} by ₹${analysis.excessAmount.toLocaleString('en-IN')}. I strongly suggest trimming Optional items like luxury home decor or swapping for our near-expiry Rescue Deals to preserve headroom.`;
        } else {
          botResponse = `✅ Your monthly budget cap is ₹${monthlyBudget.toLocaleString('en-IN')}. You have spent ₹${spentThisMonth.toLocaleString('en-IN')} so far this month. Your current cart is ₹${analysis.cartTotal.toLocaleString('en-IN')}, leaving you with ₹${analysis.headroomAfterCart.toLocaleString('en-IN')} in safe headroom!`;
        }
        suggestions = ['Suggest budget swaps', 'Show Rescue Deals', 'What is true cost per month?'];
      } else if (lower.includes('true cost') || lower.includes('cost per month') || lower.includes('durability')) {
        botResponse = `💡 In VIBE MART, True Cost-per-Month is calculated as: (Purchase Price ÷ Durability Months). For example, our ₹2,899 Cast Iron Dutch Oven lasts 240 months (20 years), making its true cost just ₹12.08/month—far cheaper than replacing a ₹1,200 non-stick pan every 2 years!`;
        suggestions = ['Compare cookware in Trade-Off', 'Check my cart fit scores', 'Browse Essential items'];
      } else if (lower.includes('worth') || lower.includes('phone') || lower.includes('headphones') || lower.includes('buy right now')) {
        if (analysis.optionalSpend > 0) {
          botResponse = `🧐 Devil's Advocate Analysis: You currently have ₹${analysis.optionalSpend.toLocaleString('en-IN')} in OPTIONAL discretionary items in your cart. Ask yourself: "Do I already own an item that fulfills 80% of this purpose?" If yes, waiting 48 hours avoids impulse buyer remorse.`;
        } else {
          botResponse = `👍 All items currently in your cart belong to Essential or Flexible utility tiers. Their durability scores exceed 48 months. If they fulfill genuine household gaps, this is a sound purchase!`;
        }
        suggestions = ['Check Devil\'s Advocate warnings', 'Open Counterfactual Simulator', 'Proceed to Checkout'];
      } else if (lower.includes('swap') || lower.includes('alternative') || lower.includes('eco')) {
        botResponse = `🌱 Smart Eco Swaps: Check our 'Rescue Deals' tab for near-expiry certified items at 40%–56% discount. Every rescue buy prevents landfill degradation and saves money. For instance, our Organic Almond Body Oil is just ₹399 (down from ₹899).`;
        suggestions = ['Go to Rescue Deals', 'Analyze my cart budget headroom', 'Clear discretionary items'];
      } else {
        botResponse = `I am here to protect your financial wellness and guide mindful consumption. You have ${cartCount} item(s) in your cart (₹${analysis.cartTotal.toLocaleString('en-IN')}). What decision evaluation would you like to explore?`;
        suggestions = ['Analyze my cart budget headroom', 'Explain true cost-per-month', 'Suggest eco-friendly swaps'];
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions
      };

      setChatMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const budgetAnalysis = useMemo(
    () => analyzeBudget(cart, monthlyBudget, spentThisMonth, products),
    [cart, monthlyBudget, spentThisMonth, products]
  );

  const regretStats = useMemo(() => computeRegretAnalytics(orders), [orders]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        registeredAccounts,
        registerUser,
        loginWithCredentials,
        loginAsDemo,
        logout,
        activeTab,
        setActiveTab,
        products,
        addProduct,
        purgeExpiredRescueDeals,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        swapCartItem,
        monthlyBudget,
        setMonthlyBudget,
        spentThisMonth,
        orders,
        updateOrderFeedback,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isProductInComparison,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalTab,
        setLoginModalTab,
        isCartOpen,
        setIsCartOpen,
        isTradeOffDrawerOpen,
        setIsTradeOffDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutStep,
        setCheckoutStep,
        shippingAddress,
        setShippingAddress,
        paymentInfo,
        setPaymentInfo,
        lastCompletedOrder,
        submit5StepOrder,
        selectedProductDetail,
        setSelectedProductDetail,
        toast,
        showToast,
        platformMetrics,
        budgetAnalysis,
        regretStats,
        resetDatabase,
        isChatbotOpen,
        setIsChatbotOpen,
        chatMessages,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
