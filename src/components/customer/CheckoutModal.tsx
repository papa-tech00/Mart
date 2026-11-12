import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseConfidence } from '../intelligence/PurchaseConfidence';
import { calculateProductFitScore } from '../../utils/fitScoreEngine';
import { PaymentMethod, ShippingAddress } from '../../types';
import {
  X,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lock,
  Leaf,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Clock,
  MapPin,
  Check,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutStep,
    setCheckoutStep,
    cart,
    budgetAnalysis,
    shippingAddress,
    setShippingAddress,
    paymentInfo,
    setPaymentInfo,
    submit5StepOrder,
    lastCompletedOrder,
    setActiveTab,
    monthlyBudget
  } = useApp();

  // Friction checkboxes
  const [ackNeed, setAckNeed] = useState(true);
  const [ackDurability, setAckDurability] = useState(true);
  const [ackRegretRisk, setAckRegretRisk] = useState(false);

  // Payment UI states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [upiTimer, setUpiTimer] = useState<number>(30);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('yali@okhdfcbank');

  // Card UI states
  const [cardNumber, setCardNumber] = useState('4532 8920 1204 8821');
  const [cardHolder, setCardHolder] = useState('YALI SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');

  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // 30-second UPI countdown timer when on step 4 with UPI
  useEffect(() => {
    let interval: any = null;
    if (checkoutStep === 4 && selectedMethod === 'UPI') {
      setUpiTimer(30);
      interval = setInterval(() => {
        setUpiTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutStep, selectedMethod]);

  if (!isCheckoutModalOpen) return null;

  // Compute average product fit score across cart
  const totalFit = cart.reduce((acc, item) => {
    const fit = calculateProductFitScore(item.product, {
      monthlyBudget,
      remainingBudget: budgetAnalysis.headroomAfterCart,
      personalRegretRate: 15
    });
    return acc + fit.totalScore * item.quantity;
  }, 0);
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  const averageFitScore = totalQty > 0 ? Math.round(totalFit / totalQty) : 85;

  const totalCarbonSaved = cart.reduce(
    (acc, item) => acc + item.product.carbonSavedKg * item.quantity,
    0
  );

  const handleNextStep = () => {
    if (checkoutStep === 1) setCheckoutStep(2);
    else if (checkoutStep === 2) setCheckoutStep(3);
    else if (checkoutStep === 3) setCheckoutStep(4);
    else if (checkoutStep === 4) {
      // Execute payment and submit order
      setIsVerifyingPayment(true);
      setTimeout(() => {
        setIsVerifyingPayment(false);
        const warnings: string[] = [];
        if (ackNeed) warnings.push('Verified genuine monthly need alignment');
        if (ackDurability) warnings.push('Audited lifecycle durability & true cost/month');
        if (budgetAnalysis.isBreached) {
          warnings.push(`Acknowledged ₹${budgetAnalysis.excessAmount.toLocaleString('en-IN')} budget overage`);
        }
        submit5StepOrder(warnings);
      }, 1200);
    }
  };

  const handleBackStep = () => {
    if (checkoutStep > 1 && checkoutStep < 5) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  const stepsLabel = [
    '1. Smart Cart & Budget Check',
    '2. Decision Audit & Fit Score',
    '3. Shipping Address',
    '4. Secure Payment Gateway',
    '5. Order Confirmation'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">5-Step Intelligent Checkout</h2>
              <p className="text-xs text-slate-300">
                {stepsLabel[checkoutStep - 1]}
              </p>
            </div>
          </div>
          {checkoutStep < 5 && (
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Indicator */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                checkoutStep === step
                  ? 'bg-emerald-600 text-white'
                  : checkoutStep > step
                  ? 'bg-emerald-200 text-emerald-900'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {checkoutStep > step ? <Check className="w-3.5 h-3.5" /> : step}
              </span>
              <span className={`text-[10px] font-semibold hidden md:inline ${
                checkoutStep === step ? 'text-slate-900 font-bold' : 'text-slate-400'
              }`}>
                {step === 1 ? 'Cart' : step === 2 ? 'Audit' : step === 3 ? 'Address' : step === 4 ? 'Payment' : 'Complete'}
              </span>
              {step < 5 && <div className="w-3 sm:w-6 h-0.5 bg-slate-200 ml-1" />}
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* STEP 1: Smart Cart & Budget Check */}
          {checkoutStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 text-sm block">Live Budget Guardian Check</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Monthly Target: <strong className="font-mono-numbers text-slate-900">₹{monthlyBudget.toLocaleString('en-IN')}</strong> | Cart Total: <strong className="font-mono-numbers text-emerald-800">₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')}</strong>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                  budgetAnalysis.isBreached ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {budgetAnalysis.status}
                </span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Cart Items Breakdown by Need Tier:
                </span>
                {cart.map(item => (
                  <div key={item.product.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <strong className="font-bold text-slate-900 block truncate max-w-[220px]">{item.product.name}</strong>
                        <span className="text-[10px] text-slate-500">Qty: {item.quantity} • True: ₹{(item.product.price / item.product.durabilityMonths).toFixed(2)}/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-numbers font-bold text-slate-900 block">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        item.product.needTier === 'ESSENTIAL' ? 'bg-emerald-100 text-emerald-800' : item.product.needTier === 'FLEXIBLE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.product.needTier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Spend distribution summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Essential</span>
                  <span className="font-mono-numbers font-bold text-emerald-700">₹{budgetAnalysis.essentialSpend.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Flexible</span>
                  <span className="font-mono-numbers font-bold text-amber-600">₹{budgetAnalysis.flexibleSpend.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Optional</span>
                  <span className="font-mono-numbers font-bold text-rose-600">₹{budgetAnalysis.optionalSpend.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Product & Decision Summary */}
          {checkoutStep === 2 && (
            <div className="space-y-4">
              <PurchaseConfidence averageFitScore={averageFitScore} />

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Decision Snapshot Record Preview
                  </span>
                  <span className="font-mono-numbers text-slate-500 text-[10px]">Currency: INR (₹)</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">Order Value</span>
                    <span className="font-mono-numbers font-bold text-slate-900 text-sm">₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">Headroom After</span>
                    <span className={`font-mono-numbers font-bold text-sm ${budgetAnalysis.isBreached ? 'text-rose-600' : 'text-emerald-700'}`}>
                      ₹{budgetAnalysis.headroomAfterCart.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-bold">Avg Fit Score</span>
                    <span className="font-mono-numbers font-bold text-teal-700 text-sm">{averageFitScore}%</span>
                  </div>
                </div>
              </div>

              {/* Cognitive friction checks */}
              <div className="space-y-2.5 bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl">
                <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px] block">
                  Mandatory Pre-Commitment Reflection:
                </span>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ackNeed}
                    onChange={(e) => setAckNeed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="text-slate-700">
                    I confirm these products fulfill verified household requirements rather than transient browsing impulses.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ackDurability}
                    onChange={(e) => setAckDurability(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 w-4 h-4"
                  />
                  <span className="text-slate-700">
                    I reviewed the verified lifespan (months) and true cost-per-month metrics for each item.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Shipping & Address Details */}
          {checkoutStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Delivery Address & Contact Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address / Flat / Landmark</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code (6-Digit Indian PIN)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={shippingAddress.pinCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pinCode: e.target.value })}
                    placeholder="560038"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none font-mono-numbers font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Interactive Realistic Payment Gateway */}
          {checkoutStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Select Payment Method
                </span>
                <span className="font-mono-numbers font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Amount: ₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('UPI');
                    setPaymentInfo({ ...paymentInfo, method: 'UPI' });
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    selectedMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('CARD');
                    setPaymentInfo({ ...paymentInfo, method: 'CARD' });
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    selectedMethod === 'CARD' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('NETBANKING');
                    setPaymentInfo({ ...paymentInfo, method: 'NETBANKING' });
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    selectedMethod === 'NETBANKING' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod('WALLET');
                    setPaymentInfo({ ...paymentInfo, method: 'WALLET' });
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    selectedMethod === 'WALLET' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-purple-600" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* UPI Option Container */}
              {selectedMethod === 'UPI' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
                  {/* Dummy QR Code */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="p-3 bg-white rounded-2xl border border-slate-300 shadow-xs relative">
                      <svg className="w-32 h-32" viewBox="0 0 100 100">
                        {/* Realistic Mock QR Matrix */}
                        <rect x="0" y="0" width="30" height="30" fill="#0f172a" rx="4" />
                        <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                        <rect x="10" y="10" width="10" height="10" fill="#0f172a" />
                        <rect x="70" y="0" width="30" height="30" fill="#0f172a" rx="4" />
                        <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                        <rect x="80" y="10" width="10" height="10" fill="#0f172a" />
                        <rect x="0" y="70" width="30" height="30" fill="#0f172a" rx="4" />
                        <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                        <rect x="10" y="80" width="10" height="10" fill="#0f172a" />
                        {/* Middle dots */}
                        <circle cx="45" cy="45" r="4" fill="#059669" />
                        <circle cx="55" cy="45" r="4" fill="#0f172a" />
                        <circle cx="45" cy="55" r="4" fill="#0f172a" />
                        <circle cx="55" cy="55" r="4" fill="#059669" />
                        <circle cx="35" cy="15" r="3" fill="#0f172a" />
                        <circle cx="65" cy="85" r="3" fill="#0f172a" />
                        <circle cx="85" cy="50" r="3" fill="#0f172a" />
                      </svg>
                      {/* Brand pill */}
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                          UPI
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span>QR Expires in: <strong>{upiTimer}s</strong></span>
                    </div>
                  </div>

                  {/* UPI ID Form & Apps */}
                  <div className="flex-1 w-full space-y-2.5 text-xs">
                    <span className="font-bold text-slate-900 block">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      Or enter your VPA / UPI ID for an instant checkout verification request:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono-numbers focus:border-emerald-600 outline-none"
                      />
                    </div>
                    <div className="p-2.5 bg-emerald-100/60 rounded-xl text-emerald-950 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero processing fees. Instant bank transfer verification.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Option Container */}
              {selectedMethod === 'CARD' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8920 1204 8821"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono-numbers font-bold text-xs outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Valid Thru</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono-numbers text-xs outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Container */}
              {selectedMethod === 'NETBANKING' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-semibold text-slate-800 block">Select Primary Bank:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 rounded-xl border text-left font-semibold transition ${
                          selectedBank === b ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallets Container */}
              {selectedMethod === 'WALLET' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-semibold text-slate-800 block">Select Digital Wallet:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge', 'Airtel Money'].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWallet(w)}
                        className={`p-2.5 rounded-xl border text-center font-semibold transition ${
                          selectedWallet === w ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Animated Order Placed Successfully */}
          {checkoutStep === 5 && lastCompletedOrder && (
            <div className="text-center py-6 px-4 space-y-5 animate-in zoom-in-95 duration-300">
              {/* Celebration Icon */}
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Payment Verified & Sealed
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Order Placed Successfully!
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Order ID: <strong className="text-slate-900">{lastCompletedOrder.id}</strong>
                </p>
              </div>

              {/* Order Summary & Decision Snapshot Seal */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    Decision Snapshot Recorded
                  </span>
                  <span className="font-mono-numbers font-bold text-emerald-800">
                    ₹{lastCompletedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Delivering To:</span>
                    <strong className="text-slate-900">{lastCompletedOrder.shippingAddress?.fullName} ({lastCompletedOrder.shippingAddress?.city})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-slate-900">{lastCompletedOrder.paymentInfo?.method}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Product Fit:</span>
                    <strong className="text-emerald-700 font-mono-numbers">{lastCompletedOrder.decisionSnapshot.averageFitScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Prevented:</span>
                    <strong className="text-teal-700 font-mono-numbers">{lastCompletedOrder.decisionSnapshot.counterfactualPotentialCo2SavingsKg.toFixed(1)} kg CO₂</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-100/70 border border-emerald-200 rounded-xl text-emerald-950 text-[11px]">
                  🌱 Your decision friction saved you from impulse remorse. Check "Decision Replay" anytime to rate your satisfaction!
                </div>
              </div>

              {/* Primary Return Button */}
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setCheckoutStep(1);
                    setActiveTab('DECISION_REPLAY');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View in Decision Replay (Time Capsule)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setCheckoutStep(1);
                    setActiveTab('STORE');
                  }}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Back to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {checkoutStep < 5 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
            {checkoutStep > 1 ? (
              <button
                onClick={handleBackStep}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleNextStep}
              disabled={isVerifyingPayment}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isVerifyingPayment ? (
                <span>Simulating Payment Verification...</span>
              ) : checkoutStep === 4 ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Simulate Payment Complete (₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')})</span>
                </>
              ) : (
                <>
                  <span>Continue to Step {checkoutStep + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
