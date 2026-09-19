import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  Droplets,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Users,
  TrendingDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useWater } from '../context/WaterContext';

const SUGGESTED_QUERIES = [
  'How can I reduce my water usage?',
  'What should I fix first?',
  'What if I reduce my shower from 8 minutes to 5 minutes?',
  'Create a 7-day water saving plan',
];

export default function ChatPage() {
  const {
    chatMessages,
    sendChatMessage,
    isLoading,
    calculationResult,
    wastageAnalysis,
    formData,
    setActiveView,
  } = useWater();

  const [input, setInput] = useState('');
  const [expandedSources, setExpandedSources] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await sendChatMessage(msg);
  };

  const handleSuggestedClick = async (query) => {
    if (isLoading) return;
    await sendChatMessage(query);
  };

  const toggleSource = (msgIndex) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgIndex]: !prev[msgIndex],
    }));
  };

  const topWastageName = wastageAnalysis?.top_wastage_points?.[0]?.category_name || 'Shower & Leak Optimization';
  const totalSavings = wastageAnalysis?.total_potential_savings_lpd || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-ocean-700 to-aqua-500 flex items-center justify-center text-white shadow-md shadow-ocean-700/15">
            <Sparkles className="w-5 h-5 text-aqua-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Aqua Advisor
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-ocean-50 text-ocean-700 border border-ocean-200">
                SDG 6 Aligned
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Your personal water conservation assistant
            </p>
          </div>
        </div>

        {calculationResult ? (
          <button
            onClick={() => setActiveView('dashboard')}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <span>View Full Analytics</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        ) : (
          <button
            onClick={() => setActiveView('assessment')}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-ocean-50 text-ocean-700 text-xs font-semibold hover:bg-ocean-100 transition-colors border border-ocean-200"
          >
            <span>Run Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Main Dual-Pane Container ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
        {/* ── Left: Chat Conversation ── */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {chatMessages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const hasSources = msg.sources && msg.sources.length > 0;
              const isSourceOpen = !!expandedSources[idx];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-5 sm:p-6 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-ocean-700 text-white rounded-br-none shadow-md shadow-ocean-700/15'
                        : 'bg-white border border-slate-200/60 shadow-sm text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {/* Assistant header */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 text-[11px] font-bold text-ocean-700">
                        <span className="flex items-center space-x-1.5">
                          <Droplets className="w-3.5 h-3.5 text-ocean-600" />
                          <span>Aqua Advisor</span>
                        </span>
                        {msg.model_used && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 font-normal">
                            <Cpu className="w-3 h-3 text-slate-400" />
                            <span className="truncate max-w-[150px]">{msg.model_used}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="space-y-2 whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Sources Accordion */}
                    {!isUser && hasSources && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => toggleSource(idx)}
                          className="flex items-center space-x-1.5 text-[11px] font-bold text-ocean-700 hover:text-ocean-800 focus:outline-none"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-ocean-600" />
                          <span>{msg.sources.length} Verified Sources Consulted</span>
                          {isSourceOpen ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isSourceOpen && (
                          <div className="mt-2.5 space-y-2 text-[11px] text-slate-600">
                            {msg.sources.map((src, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                              >
                                <div className="font-bold text-slate-900">{src.topic}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">Source: {src.source}</div>
                                <p className="mt-1.5 text-slate-600 leading-normal">{src.snippet}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-slate-200/60 shadow-sm p-4 rounded-2xl rounded-bl-none flex items-center space-x-2.5 text-xs text-ocean-700">
                  <Loader2 className="w-4 h-4 animate-spin text-ocean-600" />
                  <span>Synthesizing advice from RAG knowledge base & household profile...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Prompt Chips ── */}
          <div className="shrink-0 pt-3 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Suggested prompts
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_QUERIES.map((query, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSuggestedClick(query)}
                  className="shrink-0 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-ocean-50 text-slate-700 hover:text-ocean-800 text-xs border border-slate-200 hover:border-ocean-300 font-medium transition-colors disabled:opacity-50"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* ── Input Form ── */}
          <form
            onSubmit={handleSend}
            className="p-2.5 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center space-x-2 shrink-0 focus-within:border-ocean-500 focus-within:ring-2 focus-within:ring-ocean-100 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aqua Advisor about saving water, fixing leaks, or 7-day plans..."
              className="flex-1 px-3 py-2.5 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-40 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ── Right Sidebar: Water Profile ── */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
                YOUR WATER PROFILE
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {calculationResult ? (
              <div className="space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Occupants</span>
                    <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                      {formData.num_people} people
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Daily Usage</span>
                    <span className="text-base font-extrabold text-ocean-700 block mt-0.5">
                      {calculationResult.total_daily_liters.toLocaleString()} L
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Person</span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-base font-extrabold text-slate-900">
                      {calculationResult.per_person_daily_liters.toLocaleString()} L/capita
                    </span>
                    <span className="text-[11px] font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded-lg border border-ocean-200/70">
                      {calculationResult.benchmark_status}
                    </span>
                  </div>
                </div>

                {/* Top Opportunity */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider">
                    Top Opportunity
                  </span>
                  <span className="text-xs font-bold text-emerald-950 block mt-1">
                    {topWastageName}
                  </span>
                  {totalSavings > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                      Potential saving: ~{totalSavings.toLocaleString()} L/day
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Droplets className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No calculated water profile loaded. Complete the 3-step assessment to give Aqua Advisor your exact numbers.
                </p>
                <button
                  onClick={() => setActiveView('assessment')}
                  className="w-full py-2.5 px-3 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Start Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
