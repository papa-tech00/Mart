import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  User,
  Mail,
  Lock,
  ShoppingBag,
  Store,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginModalTab,
    setLoginModalTab,
    loginWithCredentials,
    registerUser,
    loginAsDemo
  } = useApp();

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('BUYER');

  // Login state
  const [loginEmail, setLoginEmail] = useState('yali@vibemart.in');
  const [loginPassword, setLoginPassword] = useState('vibe123');

  if (!isLoginModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) return;
    registerUser(regName.trim(), regEmail.trim(), regPassword.trim(), regRole);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    loginWithCredentials(loginEmail.trim(), loginPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-emerald-400">VIBE MART</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Authentication & RBAC
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Role-Based Access Control for Buyers, Sellers, and Platform Admins
            </p>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1-Click Quick Demo Access Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              1-Click Instant Demo Login (Standard Accounts):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('BUYER')}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded">Buyer</span>
                </div>
                <div className="text-xs font-bold text-emerald-950">Yali Sharma</div>
                <div className="text-[10px] text-emerald-700 font-mono">yali@vibemart.in</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('SELLER')}
                className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.2 rounded">Seller</span>
                </div>
                <div className="text-xs font-bold text-amber-950">Heritage Studio</div>
                <div className="text-[10px] text-amber-700 font-mono">seller@vibemart.in</div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('ADMIN')}
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Shield className="w-4 h-4 text-purple-700" />
                  <span className="text-[9px] font-bold text-purple-800 bg-purple-200/60 px-1.5 py-0.2 rounded">Admin</span>
                </div>
                <div className="text-xs font-bold text-purple-950">Admin Director</div>
                <div className="text-[10px] text-purple-700 font-mono">admin@vibemart.in</div>
              </button>
            </div>
          </div>

          {/* Tab Switcher: Login vs Register */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginModalTab('LOGIN')}
              className={`flex-1 py-2 rounded-lg transition ${
                loginModalTab === 'LOGIN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => setLoginModalTab('REGISTER')}
              className={`flex-1 py-2 rounded-lg transition ${
                loginModalTab === 'REGISTER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Form: LOGIN */}
          {loginModalTab === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="yali@vibemart.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                <span>Sign In & Access Role Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Form: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Yali Sharma"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Choose a password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Role (Enforces Strict Workspace Isolation)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('BUYER')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition ${
                      regRole === 'BUYER'
                        ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Buyer / Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('SELLER')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition ${
                      regRole === 'SELLER'
                        ? 'bg-amber-600 text-white border-amber-700 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('ADMIN')}
                    className={`py-2 px-2.5 rounded-xl border text-center transition ${
                      regRole === 'ADMIN'
                        ? 'bg-purple-600 text-white border-purple-700 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
              >
                <span>Register & Launch {regRole} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
