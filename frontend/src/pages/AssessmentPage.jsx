import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Bath,
  Home,
  ShowerHead,
  Timer,
  Sparkles,
  Droplets,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Car,
  Shirt,
  Flower2,
  Utensils,
  Wrench,
  Loader2,
  HelpCircle,
  Building2,
  TreePine,
} from 'lucide-react';
import { useWater } from '../context/WaterContext';
import { ecoShowerVisual, ecoKitchenSink, ecoLaundryAppliance } from '../assets/images';

const stepImages = [ecoShowerVisual, ecoKitchenSink, ecoLaundryAppliance];

const STEPS = [
  { num: 1, title: 'Household & Bathing', icon: Users, desc: 'Occupants, dwelling & shower habits' },
  { num: 2, title: 'Sanitation & Kitchen', icon: Utensils, desc: 'Toilet, dishwashing & cooking' },
  { num: 3, title: 'Laundry, Cleaning & Leaks', icon: Shirt, desc: 'Appliances, outdoor & leaks' },
];

/* ─── Reusable Slider Field ─────────────────────────────────────────── */
function SliderField({ label, sublabel, value, unit, min, max, step = 1, onChange, extra }) {
  return (
    <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 block">{label}</span>
          {sublabel && <span className="text-[11px] text-slate-500">{sublabel}</span>}
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-ocean-700 font-sans leading-none">
            {value}
          </span>
          {unit && <span className="text-xs text-slate-500 font-semibold block mt-0.5">{unit}</span>}
          {extra && <span className="text-[10px] text-slate-400 block">{extra}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-ocean-600"
      />
    </div>
  );
}

/* ─── Reusable Selectable Card ──────────────────────────────────────── */
function SelectCard({ selected, onClick, title, desc, badge, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
        selected
          ? 'border-ocean-600 bg-ocean-50/60 shadow-sm ring-1 ring-ocean-400/30'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {selected && (
        <CheckCircle2 className="w-4 h-4 text-ocean-600 absolute top-3 right-3" />
      )}
      <span className="font-bold text-sm text-slate-900 block">{title}</span>
      {desc && <span className="text-xs text-slate-500 block mt-0.5 leading-snug">{desc}</span>}
      {badge && (
        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          {badge}
        </span>
      )}
      {children}
    </button>
  );
}

export default function AssessmentPage() {
  const { formData, updateFormData, runAssessment, isLoading, error } = useWater();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');

  const validateStep = (step) => {
    setValidationError('');
    if (step === 1) {
      if (formData.num_people < 1) {
        setValidationError('Household occupants must be at least 1.');
        return false;
      }
      if (formData.shower_duration_minutes < 1) {
        setValidationError('Shower duration must be at least 1 minute.');
        return false;
      }
    } else if (step === 2) {
      if (formData.flushes_per_person_per_day < 1) {
        setValidationError('Toilet flushes per person must be at least 1.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      await runAssessment();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── Mobile Step Progress Bar (below lg) ── */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-ocean-700 tracking-wider uppercase">
            WATER ASSESSMENT
          </span>
          <span className="text-xs font-mono font-bold text-slate-500">
            Step 0{currentStep} / 03
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
          {STEPS[currentStep - 1].title}
        </h1>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  s === currentStep
                    ? 'bg-ocean-700 text-white shadow-sm ring-4 ring-ocean-100'
                    : s < currentStep
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {s < currentStep ? '✓' : `0${s}`}
              </div>
              {s < 3 && (
                <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-ocean-600 transition-all duration-300 ${
                      s < currentStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Desktop 2-Column Layout ── */}
      <div className="flex gap-8">
        {/* ── Left Sidebar (desktop only) ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-ocean-700 tracking-wider uppercase block">
              WATER ASSESSMENT
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">
              Usage Profile
            </h2>
          </div>

          {/* Step Navigation */}
          <div className="space-y-1.5">
            {STEPS.map((s) => {
              const isActive = s.num === currentStep;
              const isDone = s.num < currentStep;
              const Icon = s.icon;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (isDone || isActive) setCurrentStep(s.num);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-ocean-50/80 border-l-[3px] border-l-ocean-700 shadow-xs'
                      : isDone
                      ? 'hover:bg-slate-50 border-l-[3px] border-l-emerald-500'
                      : 'border-l-[3px] border-l-transparent opacity-50 cursor-default'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-ocean-700 text-white'
                        : isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <span className={`text-xs font-bold block ${isActive ? 'text-ocean-800' : 'text-slate-700'}`}>
                      0{s.num} — {s.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{s.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img
              src={stepImages[currentStep - 1]}
              alt={STEPS[currentStep - 1].title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                Step 0{currentStep}
              </span>
              <span className="text-xs font-bold text-white block">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Completion
            </span>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-ocean-600 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {currentStep - 1} of 3 sections completed
            </span>
          </div>
        </div>

        {/* ── Right Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Desktop title (hidden on mobile since shown above) */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {STEPS[currentStep - 1].title}
            </h1>
            <span className="text-xs font-mono font-bold text-slate-400">
              Step 0{currentStep} / 03
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* ═══════════ STEP 1: Household & Bathing ═══════════ */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Card: Household Profile */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-700 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Household Profile</h3>
                      <p className="text-xs text-slate-500">Household size and dwelling configuration</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SliderField
                      label="Occupants"
                      sublabel="People living in home"
                      value={formData.num_people}
                      unit="people"
                      min={1}
                      max={10}
                      onChange={(v) => updateFormData('num_people', parseInt(v))}
                    />
                    <SliderField
                      label="Bathrooms"
                      sublabel="Number of plumbed baths"
                      value={formData.num_bathrooms}
                      unit="bathrooms"
                      min={1}
                      max={5}
                      onChange={(v) => updateFormData('num_bathrooms', parseInt(v))}
                    />
                  </div>

                  {/* Dwelling Type */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Dwelling Type</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'apartment', title: 'Apartment', desc: 'Shared plumbing infrastructure' },
                        { value: 'independent_house', title: 'Independent House', desc: 'Private water tank supply' },
                        { value: 'villa', title: 'Villa', desc: 'Extended grounds & garden' },
                      ].map((t) => (
                        <SelectCard
                          key={t.value}
                          selected={formData.house_type === t.value}
                          onClick={() => updateFormData('house_type', t.value)}
                          title={t.title}
                          desc={t.desc}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card: Bathing Routine */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-aqua-50 text-aqua-700 flex items-center justify-center">
                        <ShowerHead className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Bathing Routine</h3>
                        <p className="text-xs text-slate-500">Duration and daily frequency per person</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      Est. flow: ~9.5 L/min
                    </span>
                  </div>

                  <SliderField
                    label="Shower Duration"
                    sublabel="Average time per shower"
                    value={formData.shower_duration_minutes}
                    unit="minutes"
                    extra={`≈ ${(formData.shower_duration_minutes * 9.5).toFixed(0)} L/shower`}
                    min={2}
                    max={25}
                    onChange={(v) => updateFormData('shower_duration_minutes', v)}
                  />

                  <SliderField
                    label="Daily Showers"
                    sublabel="Showers per person per day"
                    value={formData.showers_per_person_per_day}
                    unit="showers/day"
                    min={0}
                    max={3}
                    step={0.5}
                    onChange={(v) => updateFormData('showers_per_person_per_day', v)}
                  />

                  {/* Bucket Baths Counter */}
                  <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Bucket Baths</span>
                      <span className="text-[11px] text-slate-500">Standard 18L bucket capacity</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => updateFormData('bucket_baths_per_day', Math.max(0, formData.bucket_baths_per_day - 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-black text-ocean-700 text-lg">
                        {formData.bucket_baths_per_day}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateFormData('bucket_baths_per_day', formData.bucket_baths_per_day + 1)}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ STEP 2: Sanitation & Kitchen ═══════════ */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Card: Toilet Sanitation */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Toilet Sanitation</h3>
                      <p className="text-xs text-slate-500">Cistern volume and flushing frequency</p>
                    </div>
                  </div>

                  <SliderField
                    label="Flushes Per Person"
                    sublabel="Daily average visits per occupant"
                    value={formData.flushes_per_person_per_day}
                    unit="flushes/day"
                    min={1}
                    max={8}
                    onChange={(v) => updateFormData('flushes_per_person_per_day', v)}
                  />

                  {/* Cistern Type */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Toilet Cistern Type</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SelectCard
                        selected={formData.toilet_flush_type === 'dual_flush'}
                        onClick={() => updateFormData('toilet_flush_type', 'dual_flush')}
                        title="Dual Flush Mechanism"
                        desc="Separate 3-liter liquid and 6-liter solid buttons."
                        badge="Eco: ~4.5 L/flush"
                      />
                      <SelectCard
                        selected={formData.toilet_flush_type === 'standard_flush'}
                        onClick={() => updateFormData('toilet_flush_type', 'standard_flush')}
                        title="Standard Single Flush"
                        desc="Single lever conventional gravity tank (9 to 12 L)."
                      >
                        <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          ~9.0 L/flush
                        </span>
                      </SelectCard>
                    </div>
                  </div>
                </div>

                {/* Card: Kitchen & Cooking */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Kitchen & Cooking</h3>
                      <p className="text-xs text-slate-500">Dishwashing method and preparation frequency</p>
                    </div>
                  </div>

                  {/* Dishwashing Method */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Dishwashing Method</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'running_tap', title: 'Running Tap', volume: '~70 L', desc: 'Tap open while scrubbing plates' },
                        { value: 'sink_basin', title: 'Two-Basin Method', volume: '~24 L', desc: 'Soak in basin 1, rinse in basin 2' },
                        { value: 'dishwasher', title: 'Dishwasher', volume: '~15 L', desc: 'Full cycle appliance wash' },
                      ].map((m) => (
                        <SelectCard
                          key={m.value}
                          selected={formData.dishwashing_method === m.value}
                          onClick={() => updateFormData('dishwashing_method', m.value)}
                          title={m.title}
                          desc={m.desc}
                        >
                          <span className="inline-block mt-1.5 text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {m.volume}
                          </span>
                        </SelectCard>
                      ))}
                    </div>
                  </div>

                  {/* Frequency & Cooking */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SliderField
                      label="Dish Sessions"
                      sublabel="Washing cycles per day"
                      value={formData.dishwashing_frequency_per_day}
                      unit="sessions/day"
                      min={1}
                      max={4}
                      onChange={(v) => updateFormData('dishwashing_frequency_per_day', v)}
                    />

                    <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60 space-y-3">
                      <span className="text-xs font-bold text-slate-800 block">Cooking Intensity</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['low', 'moderate', 'high'].map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => updateFormData('cooking_intensity', lvl)}
                            className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                              formData.cooking_intensity === lvl
                                ? 'bg-ocean-700 text-white border-ocean-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ STEP 3: Laundry, Cleaning & Leaks ═══════════ */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Card: Laundry */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Laundry Appliances</h3>
                      <p className="text-xs text-slate-500">Washing machine efficiency and weekly loads</p>
                    </div>
                  </div>

                  <SliderField
                    label="Laundry Loads"
                    sublabel="Cycles run per week"
                    value={formData.washing_machine_loads_per_week}
                    unit="loads/week"
                    min={0}
                    max={10}
                    onChange={(v) => updateFormData('washing_machine_loads_per_week', v)}
                  />

                  {/* Machine Type */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">Appliance Specification</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'top_load', title: 'Top Load', desc: '~110 L/load' },
                        { value: 'front_load', title: 'Front Load (HE)', desc: '~55 L/load' },
                        { value: 'manual_hand_wash', title: 'Manual Wash', desc: '~35 L/load' },
                      ].map((m) => (
                        <SelectCard
                          key={m.value}
                          selected={formData.machine_type === m.value}
                          onClick={() => updateFormData('machine_type', m.value)}
                          title={m.title}
                          desc={m.desc}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card: Leaks & Outdoor */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Leaks & Maintenance</h3>
                      <p className="text-xs text-slate-500">Unnoticed leaks and outdoor watering habits</p>
                    </div>
                  </div>

                  {/* Leak Detection */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-3">
                      Observed or Suspected Household Leaks
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { value: 'none', title: 'None Detected', desc: 'No dripping taps or leaks observed' },
                        { value: 'dripping_faucet', title: 'Dripping Faucet', desc: 'Slow tap drip (~25 L/day)' },
                        { value: 'running_toilet', title: 'Running Toilet Tank', desc: 'Silent flapper leak (~220 L/day)' },
                        { value: 'pipe_seepage', title: 'Pipe Seepage', desc: 'Damp joint or valve seep (~80 L/day)' },
                      ].map((leak) => (
                        <button
                          type="button"
                          key={leak.value}
                          onClick={() => updateFormData('leak_detected', leak.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                            formData.leak_detected === leak.value
                              ? 'border-rose-500 bg-rose-50/60 shadow-sm ring-1 ring-rose-400/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          {formData.leak_detected === leak.value && (
                            <CheckCircle2 className="w-4 h-4 text-rose-600 absolute top-3 right-3" />
                          )}
                          <span className="font-bold text-sm text-slate-900 block">{leak.title}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">{leak.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle & Garden */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    {/* Vehicle Washing */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                        <Car className="w-4 h-4 text-slate-600" />
                        <span>Vehicle Washing</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'none', label: 'None' },
                          { value: 'bucket', label: 'Bucket (~30L)' },
                          { value: 'hose', label: 'Hose (~180L)' },
                        ].map((v) => (
                          <button
                            type="button"
                            key={v.value}
                            onClick={() => updateFormData('vehicle_washing_method', v.value)}
                            className={`py-2 rounded-xl text-[11px] font-bold border-2 transition-all ${
                              formData.vehicle_washing_method === v.value
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Garden Irrigation */}
                    <div className="p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-white border border-slate-200/60 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                        <Flower2 className="w-4 h-4 text-emerald-600" />
                        <span>Garden Irrigation</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'none', label: 'None' },
                          { value: 'drip_or_can', label: 'Can / Drip' },
                          { value: 'hose', label: 'Open Hose' },
                        ].map((g) => (
                          <button
                            type="button"
                            key={g.value}
                            onClick={() => updateFormData('garden_watering_method', g.value)}
                            className={`py-2 rounded-xl text-[11px] font-bold border-2 transition-all ${
                              formData.garden_watering_method === g.value
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Validation / Error Banners ── */}
          {validationError && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Navigation Footer ── */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <span className="text-xs font-mono text-slate-400">
              Step {currentStep} of 3
            </span>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-2.5 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-semibold text-xs transition-all shadow-md shadow-ocean-700/15 flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-ocean-700 hover:bg-ocean-800 text-white font-bold text-sm shadow-lg shadow-ocean-700/20 flex items-center space-x-2 transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Computing Water Footprint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate & View Dashboard</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
