import React, { useState } from 'react';
import { PerspectiveCard } from '../ui/PerspectiveCard';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  Layers,
  Box,
  Compass,
  Cpu,
  Palette,
  Sparkles,
  ArrowRight,
  Maximize2,
  Terminal,
  Activity,
  Globe,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export type ViewDimension = 'spatial' | 'editorial' | 'blueprint';

export const KillerDimensionShowcase: React.FC = () => {
  const [activeDimension, setActiveDimension] = useState<ViewDimension>('spatial');
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const dimensionCases = [
    {
      id: 'kinetic-depth',
      badge: '01 / SPATIAL KINETICS',
      title: '3D Interactive Physics & Specular Glare',
      subtitle: 'Inspired by Eyeballs.co • Likely Story • Fudali Studio',
      description:
        'Tactile gyroscopic card tilt with multi-depth layer projection. Badges pop 30px above the canvas, bathed in cursor-tracking specular lighting and spring-damped physics.',
      metric: '60 FPS WebGL & CSS 3D',
      accentColor: 'text-gold',
      borderColor: 'border-gold/40',
      bgGlow: 'bg-gold/10',
      highlights: ['Perspective: 1200px', 'Specular Light Shader', 'Spring-Damped Return', 'Depth Layer Stacking'],
    },
    {
      id: 'tactile-hud',
      badge: '02 / TACTILE TELEMETRY',
      title: 'Hardware-Inspired HUD & Procedural Audio',
      subtitle: 'Inspired by Aritro.xyz • Yuki Asakura • Jackie Zhang',
      description:
        'Biometric device states, multi-device sync telemetry, and Web Audio API synthesized haptic clicks, deep resonant chimes, and frequency sweeps on interaction.',
      metric: '< 10ms Audio Latency',
      accentColor: 'text-sreesh-light',
      borderColor: 'border-sreesh/40',
      bgGlow: 'bg-sreesh/10',
      highlights: ['Synthesized Web Audio', 'Device Telemetry Grid', '5-Status Synchronization', 'HUD Control Panel'],
    },
    {
      id: 'architectural-spec',
      badge: '03 / ARCHITECTURAL BLUEPRINT',
      title: 'Precision Structural Grid & Telemetry',
      subtitle: 'Inspired by Cardenas Design • Outpace Studios • Jackie Hu',
      description:
        'Architectural coordinate lines, modular measurement scales, strict typographic baselines, and enterprise engineering metrics with zero visual clutter.',
      metric: '99.9% Deterministic State',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgGlow: 'bg-emerald-500/10',
      highlights: ['CAD-Style Coordinates', 'Dimension Measure Markers', 'Telemetry Gauges', 'Enterprise Strictness'],
    },
    {
      id: 'editorial-craft',
      badge: '04 / EDITORIAL LUXURY',
      title: 'High-Fashion Editorial Typography',
      subtitle: 'Inspired by Mike Kus • With Honey • Marijana Pav • Natalia Timea',
      description:
        'Dramatic typographic juxtaposition pairing razor-sharp architectural sans-serif with delicate italic serifs, gold foil embellishments, and intimate handwritten marginalia.',
      metric: 'Bespoke Typographic Rhythm',
      accentColor: 'text-mrithula-light',
      borderColor: 'border-mrithula/40',
      bgGlow: 'bg-mrithula/10',
      highlights: ['Instrument Serif Italic', 'Dark Academia Gold Foil', 'Handwritten Parchment Marginalia', 'Asymmetric Split Rhythms'],
    },
  ];

  const currentCase = dimensionCases[selectedCase];

  return (
    <section className="space-y-12">
      {/* Dimension Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold font-bold uppercase tracking-widest">
              Multi-Dimensional Showcase
            </span>
            <span className="text-content-muted">/</span>
            <span className="text-content-secondary">Synthesized from 17 Global Portfolios</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight">
            Dimensions of Engineering & Craft
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-content-secondary max-w-2xl">
            Where 3D spatial kinetics, procedural audio, architectural precision, and editorial luxury converge.
          </p>
        </div>

        {/* 3D Perspective Dimension Switcher */}
        <div className="p-1 rounded-2xl bg-surface-card border border-border-strong flex items-center gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveDimension('spatial');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDimension === 'spatial'
                ? 'bg-burgundy text-gold font-bold border border-gold/40 shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Spatial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveDimension('editorial');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDimension === 'editorial'
                ? 'bg-burgundy text-gold font-bold border border-gold/40 shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Editorial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveDimension('blueprint');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeDimension === 'blueprint'
                ? 'bg-burgundy text-gold font-bold border border-gold/40 shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Blueprint</span>
          </button>
        </div>
      </div>

      {/* Dimensional Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: 4 Dimension Pillars */}
        <div className="lg:col-span-5 space-y-3">
          {dimensionCases.map((dim, idx) => {
            const isSelected = selectedCase === idx;
            return (
              <div
                key={dim.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCase(idx);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-gold bg-surface-elevated shadow-[0_10px_30px_rgba(211,166,37,0.15)] ring-1 ring-gold/40'
                    : 'border-border-subtle bg-surface-card hover:bg-surface-elevated/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-bold ${isSelected ? 'text-gold' : 'text-content-muted'}`}>
                    {dim.badge}
                  </span>
                  <span className="text-[10px] text-content-muted">{dim.metric}</span>
                </div>
                <h3 className="font-display font-bold text-base text-content-primary mt-1.5">
                  {dim.title}
                </h3>
                <p className="text-xs text-content-secondary mt-1 line-clamp-2">
                  {dim.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive 3D Perspective Canvas Card */}
        <div className="lg:col-span-7">
          <PerspectiveCard
            intensity={activeDimension === 'spatial' ? 20 : activeDimension === 'blueprint' ? 6 : 0}
            glareOpacity={activeDimension === 'spatial' ? 0.35 : 0.05}
            className="h-full min-h-[460px]"
          >
            <div
              className={`w-full h-full p-8 sm:p-12 rounded-3xl border bg-surface-card flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                activeDimension === 'blueprint'
                  ? 'border-dashed border-emerald-500/40 bg-[#0B0F0E]'
                  : activeDimension === 'editorial'
                  ? 'border-gold/30 bg-[#120F10]'
                  : 'border-gold/40 bg-gradient-to-br from-[#140D0F] via-surface-card to-[#0A0A0B]'
              }`}
            >
              {/* Architectural Blueprint Overlay Grid */}
              {activeDimension === 'blueprint' && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #10B981 1px, transparent 1px), linear-gradient(to right, #10B981 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}

              {/* Ambient Glow Orb */}
              <div
                className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${currentCase.bgGlow}`}
              />

              {/* Top Bar with Perspective Telemetry */}
              <div className="relative z-20 flex items-center justify-between text-xs font-mono border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span className="font-bold text-content-primary uppercase tracking-wider">
                    {currentCase.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-content-muted text-[11px]">
                  <span>DEPTH: {activeDimension.toUpperCase()}</span>
                  <span>•</span>
                  <span>Z-INDEX: 40px</span>
                </div>
              </div>

              {/* Main Content with Layered Depth Projection */}
              <div className="relative z-20 my-auto py-8 space-y-6">
                <div>
                  <span className="font-mono text-xs text-gold/90 uppercase tracking-widest">
                    {currentCase.subtitle}
                  </span>
                  <h3
                    className="text-2xl sm:text-4xl font-display font-extrabold text-content-primary mt-2 leading-tight"
                    style={{ transform: activeDimension === 'spatial' ? 'translateZ(25px)' : 'none' }}
                  >
                    {currentCase.title}
                  </h3>
                </div>

                <p
                  className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-xl font-sans"
                  style={{ transform: activeDimension === 'spatial' ? 'translateZ(15px)' : 'none' }}
                >
                  {currentCase.description}
                </p>

                {/* Highlights Chips */}
                <div
                  className="flex flex-wrap gap-2 pt-2"
                  style={{ transform: activeDimension === 'spatial' ? 'translateZ(35px)' : 'none' }}
                >
                  {currentCase.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/30 bg-surface-elevated text-xs font-mono text-gold shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3 text-gold" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-20 pt-6 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-content-muted">
                  <Activity className="w-3.5 h-3.5 text-gold" />
                  <span>Interactive 3D Perspective Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gold font-bold">
                    MOVE CURSOR TO TILT
                  </span>
                  <Maximize2 className="w-3.5 h-3.5 text-gold" />
                </div>
              </div>
            </div>
          </PerspectiveCard>
        </div>
      </div>
    </section>
  );
};

