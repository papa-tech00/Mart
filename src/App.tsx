import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { RescueDealsView } from './components/customer/RescueDealsView';
import { DecisionReplay } from './components/customer/DecisionReplay';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { TradeOffDrawer } from './components/intelligence/TradeOffDrawer';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AIChatbot } from './components/common/AIChatbot';
import {
  ShieldAlert,
  ShieldCheck,
  Info,
  CheckCircle2
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Global Navigation with Account & Role Switcher */}
      <Navbar />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'LANDING_PAGE' && <LandingPage />}
        {activeTab === 'STORE' && <ProductCatalog />}
        {activeTab === 'RESCUE_DEALS' && <RescueDealsView />}
        {activeTab === 'DECISION_REPLAY' && <DecisionReplay />}
        {activeTab === 'SELLER_STUDIO' && <SellerDashboard />}
        {activeTab === 'ADMIN_OVERSIGHT' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <LoginModal />
      <CartDrawer />
      <TradeOffDrawer />
      <CheckoutModal />
      <ProductDetailModal />

      {/* Floating AI Shopping Assistant Bot */}
      <AIChatbot />

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'warning' ? (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
          </div>
        </div>
      )}

      {/* Platform Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
