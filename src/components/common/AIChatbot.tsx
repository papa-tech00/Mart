import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  IndianRupee,
  HelpCircle
} from 'lucide-react';

export const AIChatbot: React.FC = () => {
  const {
    isChatbotOpen,
    setIsChatbotOpen,
    chatMessages,
    sendChatMessage,
    budgetAnalysis,
    monthlyBudget,
    cart,
    user
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatbotOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 hover:scale-105 active:scale-95 text-white rounded-2xl shadow-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer group border border-emerald-400/40"
          title="Open VIBE AI Shopping Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-300 absolute -top-0.5 -right-0.5 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">VIBE AI Assistant</span>
          <span className="text-[10px] font-mono-numbers bg-emerald-950/60 px-2 py-0.5 rounded-full text-emerald-200">
            ₹{budgetAnalysis.headroomAfterCart.toLocaleString('en-IN')} left
          </span>
        </button>
      )}

      {/* Chat Window Modal / Drawer */}
      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">VIBE AI Advisor</h3>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Decision support & budget intelligence
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatbotOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] flex items-center justify-between text-slate-600">
            <span>
              Cart: <strong className="font-mono-numbers text-slate-900">₹{budgetAnalysis.cartTotal.toLocaleString('en-IN')}</strong> ({cart.length} items)
            </span>
            <span>
              Headroom: <strong className={`font-mono-numbers font-bold ${
                budgetAnalysis.isBreached ? 'text-rose-600' : 'text-emerald-700'
              }`}>
                ₹{budgetAnalysis.headroomAfterCart.toLocaleString('en-IN')}
              </strong>
            </span>
          </div>

          {/* Messages Stream */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div className={`p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(sug)}
                          className="text-[10px] bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-semibold px-2.5 py-1 rounded-full transition shadow-2xs cursor-pointer text-slate-700"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {user?.avatar || 'U'}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget headroom, trade-offs, or impulse risks..."
              className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl transition cursor-pointer shrink-0"
              title="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
