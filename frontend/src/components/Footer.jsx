import React from 'react';
import { Droplets, Heart, ShieldCheck, ExternalLink, Users, Globe, Leaf } from 'lucide-react';
import { scenicNatureWater } from '../assets/images';

export default function Footer({ onOpenSdgModal }) {
  return (
    <footer className="mt-auto">
      {/* ── Scenic Water Background Section ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${scenicNatureWater})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/90 via-ocean-900/85 to-ocean-950/95" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Inspirational Quote */}
          <div className="text-center mb-12">
            <p className="text-xl sm:text-2xl lg:text-3xl font-light italic text-white/90 max-w-2xl mx-auto leading-relaxed">
              "Every litre saved today builds a brighter tomorrow."
            </p>
            <div className="w-16 h-px bg-white/20 mx-auto mt-6" />
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Droplets,
                title: 'Conserve Water',
                desc: 'Track, understand, and reduce daily household water consumption.',
              },
              {
                icon: Users,
                title: 'Stronger Communities',
                desc: 'Community-level conservation creates resilient water infrastructure.',
              },
              {
                icon: Globe,
                title: 'Healthier Planet',
                desc: 'Every drop saved contributes to global freshwater sustainability.',
              },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5 text-white/90" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Standard Dark Footer ── */}
      <div className="bg-ocean-950 text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-ocean-700 to-aqua-500 flex items-center justify-center text-white">
                  <Droplets className="w-4 h-4 fill-white/20" />
                </div>
                <span className="font-bold text-white tracking-tight">Smart Water Usage Advisor</span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed max-w-md">
                An AI-powered sustainability initiative aligned with UN Sustainable Development Goal 6 (Clean Water & Sanitation).
                Helping households track, understand, and reduce daily domestic water wastage through transparent deterministic models and RAG knowledge retrieval.
              </p>
              <div className="flex items-center space-x-2 text-xs text-white/50 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Client-side privacy & deterministic calculation engine.</span>
              </div>
            </div>

            {/* Col 2: SDG 6 */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">SDG 6 Focus</h4>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li>
                  <button
                    onClick={onOpenSdgModal}
                    className="hover:text-aqua-400 transition-colors text-left flex items-center space-x-1"
                  >
                    <span>Target 6.4: Water-use Efficiency</span>
                    <ExternalLink className="w-3 h-3 text-white/30" />
                  </button>
                </li>
                <li>Responsible Household Consumption</li>
                <li>Leak Prevention & Conservation</li>
                <li>Aquifer Replenishment</li>
              </ul>
            </div>

            {/* Col 3: Methodology */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">Methodology</h4>
              <p className="text-white/50 text-xs leading-relaxed">
                Estimates are derived from empirical flow benchmarks (EPA WaterSense, WHO, CPHEEO). Values are approximate models to guide behavioral conservation, not utility billing meters.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Smart Water Usage Advisor. Built for water sustainability.
            </div>
            <div className="flex items-center space-x-1.5">
              <span>Aligned with UN Sustainable Development Goal 6</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
