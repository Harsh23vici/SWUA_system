import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  TrendingDown,
  Globe2,
  Sliders,
  ShieldCheck,
  Zap,
  Users,
  Home,
  Check,
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { heroWaterCity, scenicNatureWater } from '../assets/images';

export default function LandingPage({ onOpenSdgModal }) {
  const { setActiveView, loadSampleProfile, runAssessment, isLoading } = useWater();

  const handleQuickPreset = async (presetId) => {
    const profile = loadSampleProfile(presetId);
    if (profile) {
      await runAssessment(profile.data);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Transparent Estimate',
      desc: 'Deterministic calculations based on household behavior and empirical water-use benchmarks.',
      icon: Sliders,
      bg: 'bg-ocean-50 text-ocean-700',
    },
    {
      num: '02',
      title: 'Detect Wastage',
      desc: 'Identify major sources of water inefficiency and potential leaks.',
      icon: Search,
      bg: 'bg-aqua-50 text-aqua-700',
    },
    {
      num: '03',
      title: 'Personalized Action',
      desc: 'Get realistic, low-cost actions that reduce water waste without sacrificing comfort.',
      icon: TrendingDown,
      bg: 'bg-emerald-50 text-emerald-700',
    },
    {
      num: '04',
      title: 'Aqua Advisor AI',
      desc: 'Ask questions and receive personalized water conservation guidance.',
      icon: Sparkles,
      bg: 'bg-indigo-50 text-indigo-700',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION (Matching Reference Design) */}
      <section className="relative pt-8 sm:pt-14 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-ocean-50 border border-ocean-200/80 text-ocean-800 text-xs font-semibold shadow-2xs cursor-pointer hover:bg-ocean-100 transition-colors"
              onClick={onOpenSdgModal}
            >
              <span className="w-2 h-2 rounded-full bg-ocean-600 animate-pulse"></span>
              <span>SDG 6 • Clean Water & Sanitation • Target 6.4</span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              Understand Your{' '}
              <span className="relative inline-block bg-gradient-to-r from-ocean-600 to-aqua-500 bg-clip-text text-transparent">
  Water
  <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-full bg-gradient-to-r from-ocean-500 to-aqua-400 opacity-70" />
</span>
              .<br />
              Change What You{' '}
              <span className="bg-gradient-to-r from-ocean-700 via-aqua-600 to-teal-500 bg-clip-text text-transparent">
                Waste
              </span>
              .
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Turn everyday household habits into measurable water-saving actions with transparent estimates and personalized AI guidance.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <button
                onClick={() => setActiveView('assessment')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-ocean-700 to-ocean-600 hover:from-ocean-800 hover:to-ocean-700 text-white font-bold text-sm sm:text-base shadow-md shadow-ocean-700/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Calculate My Water Usage</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('chat')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-xs flex items-center justify-center space-x-2 transition-all hover:border-slate-300"
              >
                <Sparkles className="w-4 h-4 text-ocean-600" />
                <span>Ask Aqua Advisor →</span>
              </button>
            </motion.div>

            {/* 4 Trust & Value Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 grid grid-cols-2 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-semibold text-slate-600"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent calculations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Privacy-first</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No ML training required</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Large Crystal Water Droplet Sustainable City Hero Image */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Ambient Glow & Concentric Ripple Rings */}
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-aqua-200/40 blur-3xl -z-10 animate-pulse-subtle"></div>
            <div className="absolute w-[440px] h-[440px] rounded-full border border-ocean-200/50 animate-ripple-slow pointer-events-none -z-10"></div>
            <div className="absolute w-[440px] h-[440px] rounded-full border border-aqua-300/30 animate-ripple-delayed pointer-events-none -z-10"></div>

            {/* Integrated Circular Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 group"
            >
              <img
                src={heroWaterCity}
                alt="Crystal water droplet containing sustainable city"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Glassmorphic Badge Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-ocean-600 text-white flex items-center justify-center shadow-sm">
                    <Droplets className="w-5 h-5 fill-white/20" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-ocean-700 uppercase tracking-wider block">
                      Household Conservation Goal
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      Save ~100–250 Liters Daily
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SDG 6.4
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. QUICK DEMO SCENARIOS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Try a quick demo scenario
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            See how everyday choices impact your water footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Typical Urban Family */}
          <div
            onClick={() => handleQuickPreset('standard-family')}
            className="premium-card p-6 sm:p-7 rounded-2xl cursor-pointer group hover:border-ocean-300 hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </span>
                <span className="text-sm font-mono font-extrabold text-ocean-700 bg-ocean-50 px-2.5 py-1 rounded-lg border border-ocean-200/80">
                  ~420 L/day
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-ocean-700 transition-colors">
                Typical Urban Family
              </h3>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mt-1">
                <span>4 people</span>
                <span>•</span>
                <span>Apartment</span>
                <span>•</span>
                <span>Standard usage</span>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                4 occupants in a 2-bathroom apartment with standard single-flush cisterns and daily showers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-ocean-700">
              <span>Simulate Family Profile</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Eco-Conscious Couple */}
          <div
            onClick={() => handleQuickPreset('eco-conscious')}
            className="premium-card p-6 sm:p-7 rounded-2xl cursor-pointer group hover:border-emerald-300 hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </span>
                <span className="text-sm font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                  ~180 L/day
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Eco-Conscious Couple
              </h3>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mt-1">
                <span>2 people</span>
                <span>•</span>
                <span>Conservation focused</span>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Dual-flush toilets, aerated fixtures, bucket baths, and high-efficiency front-load laundry.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Simulate Eco Profile</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Large Household */}
          <div
            onClick={() => handleQuickPreset('high-usage')}
            className="premium-card p-6 sm:p-7 rounded-2xl cursor-pointer group hover:border-amber-300 hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </span>
                <span className="text-sm font-mono font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                  ~600 L/day
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Large Household
              </h3>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mt-1">
                <span>5 people</span>
                <span>•</span>
                <span>Higher usage scenario</span>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Independent house with garden lawn, hose vehicle washing, and suspected cistern flapper leak.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Simulate Large Home</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW SMART WATER ADVISOR WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider block">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            How Smart Water Advisor Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="premium-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SUSTAINABILITY / WATER IMAGE SECTION WITH SCENIC LANDSCAPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          {/* Scenic Environmental Nature Image Background */}
          <img
            src={scenicNatureWater}
            alt="Pristine alpine river and nature landscape"
            className="w-full h-80 sm:h-96 object-cover"
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/85 via-ocean-900/75 to-slate-900/60 p-6 sm:p-12 flex flex-col justify-between">
            <div className="max-w-xl">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/20 text-aqua-200 border border-white/20 inline-block mb-3">
                Resource Consciousness
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                "Small household habits compound into hundreds of thousands of liters saved."
              </h3>
            </div>

            {/* 3 Semi-transparent Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <span className="text-2xl font-black text-amber-300 block">220 L/day</span>
                <span className="text-xs font-medium text-ocean-100 mt-0.5 block">
                  Lost by a single silent toilet flapper leak
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <span className="text-2xl font-black text-aqua-300 block">45 L/shower</span>
                <span className="text-xs font-medium text-ocean-100 mt-0.5 block">
                  Saved by reducing shower duration from 10 to 5 mins
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <span className="text-2xl font-black text-emerald-300 block">140 L/capita</span>
                <span className="text-xs font-medium text-ocean-100 mt-0.5 block">
                  Standard urban daily benchmark vs 100L goal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SDG 6 INTEGRATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="premium-card p-8 sm:p-10 rounded-3xl border border-ocean-200/70 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white via-ocean-50/30 to-white">
          <div className="flex items-start space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ocean-700 to-aqua-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Globe2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider block">
                Sustainable Development Goal 6
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Built Around SDG 6 • Target 6.4
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Smart Water Advisor helps households understand everyday water consumption and make practical conservation decisions. By increasing demand-side water efficiency, families prevent unnecessary urban extraction and protect declining freshwater reserves.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSdgModal}
            className="shrink-0 px-6 py-3 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Learn About Target 6.4 →
          </button>
        </div>
      </section>
    </div>
  );
}
