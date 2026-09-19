import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Users,
  Calendar,
  Sparkles,
  RefreshCw,
  Printer,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import MetricCard from '../components/MetricCard';
import CategoryDonutChart from '../components/CategoryDonutChart';
import CategoryBarChart from '../components/CategoryBarChart';
import WastageCard from '../components/WastageCard';
import WaterFlowDiagram from '../components/WaterFlowDiagram';
import SavingsSimulator from '../components/SavingsSimulator';
import DisclaimerBadge from '../components/DisclaimerBadge';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DashboardPage() {
  const {
    calculationResult,
    wastageAnalysis,
    setActiveView,
    resetAssessment,
    sendChatMessage,
  } = useWater();

  if (!calculationResult) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 rounded-3xl bg-white border border-slate-200/60 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-ocean-50 text-ocean-700 flex items-center justify-center mx-auto">
          <Droplets className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black text-slate-900">No Assessment Data</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Complete the quick questionnaire or load a demo profile to view your household's water analytics.
        </p>
        <button
          onClick={() => setActiveView('assessment')}
          className="px-7 py-3 rounded-xl bg-ocean-700 text-white text-sm font-bold hover:bg-ocean-800 transition-colors shadow-md shadow-ocean-700/15"
        >
          Start Water Assessment
        </button>
      </div>
    );
  }

  const {
    total_daily_liters,
    per_person_daily_liters,
    monthly_estimate_liters,
    yearly_estimate_liters,
    num_people,
    category_breakdown,
    benchmark_status,
    benchmark_comparison_percent,
  } = calculationResult;

  const topWastage = wastageAnalysis?.top_wastage_points || [];
  const totalPotentialSavings = wastageAnalysis?.total_potential_savings_lpd || 0;
  const potentialMonthlySavings = wastageAnalysis?.potential_monthly_savings_liters || 0;

  const highestCategory = category_breakdown && category_breakdown.length > 0
    ? category_breakdown[0].category_name.toLowerCase()
    : 'bathing and showers';

  const handlePrint = () => {
    window.print();
  };

  const handleChatWithAdvisor = () => {
    setActiveView('chat');
    sendChatMessage('Based on my dashboard results, what is my single highest water saving priority?');
  };

  const statusBadgeType = {
    'Water Wise (Conserving)': 'success',
    'Balanced (Average)': 'info',
    'Elevated Usage': 'warning',
    'High Usage': 'danger',
  }[benchmark_status] || 'info';

  const statusExplanation = per_person_daily_liters <= 100
    ? "Your household is already performing at or below the sustainable target! Regular fixture checks will keep you here."
    : `Most of your estimated consumption comes from ${highestCategory}. Small routine adjustments here will deliver your largest savings.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 print:space-y-4">
      {/* ── Top Header & Actions ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <span className="text-[11px] font-bold text-ocean-700 tracking-wider uppercase block">
            YOUR WATER FOOTPRINT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Household Water Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empirical baseline modeled for <strong>{num_people} occupants</strong> • {benchmark_comparison_percent}% of global urban average
          </p>
        </div>

        <div className="flex items-center space-x-2.5 print:hidden">
          <button
            onClick={resetAssessment}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Recalculate</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleChatWithAdvisor}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white text-xs font-bold transition-all shadow-md shadow-ocean-700/15"
          >
            <Sparkles className="w-3.5 h-3.5 text-aqua-300" />
            <span>Ask Aqua AI</span>
          </button>
        </div>
      </motion.div>

      {/* ── Disclaimer ── */}
      <DisclaimerBadge />

      {/* ── 4 KPI Metric Cards ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <MetricCard
          title="Total Daily Usage"
          value={total_daily_liters.toLocaleString()}
          unit="L / day"
          subtitle={`${num_people} Household Occupants`}
          icon={Droplets}
          badge={benchmark_status}
          badgeType={statusBadgeType}
          highlight={true}
        />

        <MetricCard
          title="Per Person Daily"
          value={per_person_daily_liters.toLocaleString()}
          unit="L / person"
          subtitle="Sustainable Target: ~100 L"
          icon={Users}
          badge={per_person_daily_liters <= 100 ? 'Optimal' : `${benchmark_comparison_percent}% of standard`}
          badgeType={per_person_daily_liters <= 100 ? 'success' : 'info'}
        />

        <MetricCard
          title="Monthly Estimate"
          value={monthly_estimate_liters.toLocaleString()}
          unit="L / month"
          subtitle="30-day projected cycle"
          icon={Calendar}
        />

        <MetricCard
          title="Yearly Estimate"
          value={yearly_estimate_liters.toLocaleString()}
          unit="L / year"
          subtitle="Annual resource footprint"
          icon={Droplets}
        />
      </motion.div>

      {/* ── Status Indicator Banner ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-ocean-600 ring-4 ring-ocean-100 shrink-0 mt-1 sm:mt-0" />
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CURRENT WATER PROFILE
              </span>
              <span className="text-xs font-bold text-ocean-700 bg-ocean-50 px-2.5 py-0.5 rounded-lg border border-ocean-200/80">
                {benchmark_status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
              {statusExplanation}
            </p>
          </div>
        </div>

        {totalPotentialSavings > 0 && (
          <div className="shrink-0 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Opportunity: ~{totalPotentialSavings.toLocaleString()} L/day</span>
          </div>
        )}
      </motion.div>

      {/* ── Charts: Bar + Donut ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Horizontal Bars */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
                  Consumption Distribution
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Where Your Water Goes
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Ranked by volume
              </span>
            </div>
            <CategoryBarChart breakdown={category_breakdown} />
          </div>
        </div>

        {/* Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
                  Proportion Breakdown
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Category Share
                </h3>
              </div>
            </div>
            <CategoryDonutChart
              breakdown={category_breakdown}
              totalLiters={total_daily_liters}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Water Flow Diagram ── */}
      <WaterFlowDiagram
        totalLiters={total_daily_liters}
        breakdown={category_breakdown}
      />

      {/* ── Top Wastage Opportunities ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
        className="space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-ocean-700 uppercase tracking-wider">
              PRIORITY ACTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Your Biggest Opportunities
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Ranked by daily conservation impact
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topWastage.map((point) => (
            <WastageCard key={point.rank} point={point} />
          ))}
        </div>
      </motion.div>

      {/* ── Savings Simulator ── */}
      <SavingsSimulator />

      {/* ── Bottom Aqua AI CTA ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={5}
        className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-ocean-900 to-ocean-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/10 text-aqua-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Context-Aware AI Assistant</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Want a step-by-step reduction plan?
          </h3>
          <p className="text-sm text-ocean-100 max-w-xl leading-relaxed">
            Aqua Advisor already understands your exact household water profile. Ask for a 7-day plan, guidance on low-flow aerators, or how to test your toilet flapper.
          </p>
        </div>

        <button
          onClick={handleChatWithAdvisor}
          className="shrink-0 px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-ocean-950 font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <span>Chat with Aqua Advisor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
