import React, { useState } from 'react';
import { Droplets, Sparkles, Globe2, Menu, X, User } from 'lucide-react';
import { useWater } from '../context/WaterContext';

export default function Navbar({ onOpenSdgModal }) {
  const { activeView, setActiveView, calculationResult, backendStatus } = useWater();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'assessment', label: 'Assessment' },
    {
      id: 'dashboard',
      label: 'Dashboard',
      onClick: () => {
        if (calculationResult) setActiveView('dashboard');
        else setActiveView('assessment');
      },
    },
    { id: 'chat', label: 'Aqua AI' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo & Brand Identity */}
          <button
            onClick={() => {
              setActiveView('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ocean-700 via-ocean-600 to-aqua-500 flex items-center justify-center text-white shadow-md shadow-ocean-600/25 group-hover:scale-105 transition-transform duration-200">
              <Droplets className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-ocean-700 transition-colors">
                  Smart Water Advisor
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-ocean-50 text-ocean-700 border border-ocean-200">
                  SDG 6
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Clean Water & Sanitation Assistant
              </span>
            </div>
          </button>

          {/* Center: Horizontal Navigation with Blue Underline Indicator */}
          <nav className="hidden md:flex items-center space-x-8 h-full">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick || (() => setActiveView(item.id))}
                  className={`relative h-full flex items-center text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-ocean-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Blue Underline Active Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-ocean-600 to-aqua-500 rounded-t-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: SDG Indicator, Aqua AI Button, Avatar & Status */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* SDG 6 / Target 6.4 Pill */}
            <button
              onClick={onOpenSdgModal}
              title="Aligned with UN SDG 6: Clean Water and Sanitation"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-ocean-700 hover:bg-ocean-50 border border-slate-200/80 transition-all flex items-center space-x-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-ocean-600" />
              <span>Target 6.4</span>
            </button>

            {/* Aqua AI Highlight Button */}
            <button
              onClick={() => setActiveView('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs ${
                activeView === 'chat'
                  ? 'bg-gradient-to-r from-ocean-700 to-aqua-600 text-white shadow-md shadow-ocean-700/20'
                  : 'bg-ocean-50 text-ocean-800 hover:bg-ocean-100/90 border border-ocean-200/90'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-aqua-500 animate-pulse" />
              <span>Aqua AI</span>
            </button>

            {/* Subtle User Profile Avatar + Live Status Dot */}
            <div className="relative flex items-center pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <span
                title={backendStatus?.status === 'healthy' ? 'API Online' : 'Connecting...'}
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
              ></span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setActiveView('chat')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-ocean-50 text-ocean-800 text-xs font-bold border border-ocean-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-aqua-600" />
              <span>AI</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-3 pb-5 border-t border-slate-200 space-y-1.5 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                  activeView === item.id
                    ? 'bg-ocean-50 text-ocean-700 border-l-4 border-ocean-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between px-4">
              <button
                onClick={() => {
                  onOpenSdgModal();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-ocean-700 flex items-center space-x-1.5 py-1"
              >
                <Globe2 className="w-4 h-4 text-ocean-600" />
                <span>UN SDG 6 Target 6.4 Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
