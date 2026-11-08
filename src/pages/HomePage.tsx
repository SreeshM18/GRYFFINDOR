import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Terminal,
  Palette,
  Cpu,
  ShieldCheck,
  Compass,
  GitMerge,
  Box,
  Activity,
  Code2,
  Laptop,
  Radio,
  Layers,
  Flame,
} from 'lucide-react';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { PROFILES_DATA, INITIAL_PROJECTS } from '../data/initialData';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { DimensionalHUD, DimensionMode } from '../components/ui/DimensionalHUD';
import { KillerDimensionShowcase } from '../components/showcase/KillerDimensionShowcase';

export const HomePage: React.FC = () => {
  const [activeSplit, setActiveSplit] = useState<'sreesh' | 'mrithula' | null>(null);
  const [currentDimension, setCurrentDimension] = useState<DimensionMode>('spatial');

  const antigravity = INITIAL_PROJECTS.find((p) => p.id === 'antigravity-neural-os')!;
  const atelier = INITIAL_PROJECTS.find((p) => p.id === 'studio-design-system')!;
  const bmwm4 = INITIAL_PROJECTS.find((p) => p.id === 'aether-bmw-m4')!;
  const aethel = INITIAL_PROJECTS.find((p) => p.id === 'aethel-intelligence')!;

  return (
    <div className="relative z-10 pb-36">
      {/* Floating Spatial Telemetry HUD (Fixed viewport overlay, separated from flow) */}
      <DimensionalHUD onDimensionChange={(dim) => setCurrentDimension(dim)} />

      {/* Main Flow Content Container */}
      <div className="space-y-28 sm:space-y-36">
        {/* =========================================================================
            01. ASYMMETRIC OVERSIZED EDITORIAL HERO
        ========================================================================= */}
        <section className="relative min-h-[90vh] flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-3 sm:pt-4 pb-12 overflow-hidden select-none">
          {/* Subtle Warm Atmospheric Glow */}
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-burgundy/10 rounded-full blur-[160px] pointer-events-none" />

          {/* Top Editorial Ticker & Coordinates */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-content-muted border-b border-border-subtle pb-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-content-secondary">Bengaluru, India • GMT +05:30</span>
              <span className="hidden md:inline text-border-strong">/</span>
              <span className="hidden md:inline">Open for 2026 Fellowships & Select Collaborations</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-hand text-lg text-burgundy-soft -rotate-1">two minds, one creative space</span>
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-content-muted">Folio 2026</span>
            </div>
          </div>

          {/* Oversized Asymmetric Title Composition */}
          <div className="my-auto py-12 sm:py-20 space-y-6">
            <div className="relative">
              {/* SREESH — Left Anchored */}
              <div className="relative inline-block text-left group">
                <Link
                  to="/sreesh"
                  onMouseEnter={() => {
                    soundFx.playHover();
                    setActiveSplit('sreesh');
                  }}
                  onMouseLeave={() => setActiveSplit(null)}
                  className="block text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-extrabold tracking-tighter text-content-primary hover:text-sreesh-light transition-colors leading-[0.88] select-none cursor-pointer"
                >
                  SREESH
                </Link>
                <span className="absolute -top-4 -right-8 sm:-right-16 font-hand text-xl sm:text-2xl text-sreesh-light rotate-6 hidden sm:block pointer-events-none">
                  the systems architect ↗
                </span>
              </div>

              {/* Italicized Serif Ampersand / Cross */}
              <div className="my-2 sm:my-4 sm:ml-24 flex items-center gap-4">
                <span className="font-serif italic text-4xl sm:text-6xl md:text-7xl text-burgundy-soft font-light select-none">
                  ×
                </span>
                <span className="h-px flex-1 max-w-xs bg-border-strong hidden md:block" />
                <p className="font-mono text-xs text-content-muted uppercase tracking-widest hidden md:block">
                  Digital Engineering & Product Design Studio
                </p>
              </div>

              {/* MRITHULA — Right Offset */}
              <div className="relative text-left sm:text-right group">
                <Link
                  to="/mrithula"
                  onMouseEnter={() => {
                    soundFx.playHover();
                    setActiveSplit('mrithula');
                  }}
                  onMouseLeave={() => setActiveSplit(null)}
                  className="block text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display font-extrabold tracking-tighter text-content-primary hover:text-mrithula-light transition-colors leading-[0.88] select-none cursor-pointer"
                >
                  MRITHULA
                </Link>
                <span className="absolute -bottom-6 left-0 sm:left-auto sm:right-32 font-hand text-xl sm:text-2xl text-mrithula-light -rotate-3 hidden sm:block pointer-events-none">
                  ↖ the product & design lead
                </span>
              </div>
            </div>
          </div>

        {/* Bottom Editorial Callout & Quick Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-subtle items-end">
          <div className="md:col-span-2 space-y-2">
            <p className="font-serif italic text-xl sm:text-2xl text-content-primary leading-snug max-w-xl">
              "We believe software should feel intentional, enduring, and meticulously engineered."
            </p>
            <p className="text-xs text-content-secondary max-w-lg leading-relaxed">
              An independent creative technology studio bridging autonomous AI architectures, distributed full-stack systems, bespoke design tokens, and human-first accessibility.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end justify-end gap-3">
            <Link
              to="/designs"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-full border border-gold/40 text-gold font-medium text-xs hover:bg-gold/10 transition-colors flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Use Any Website Design</span>
            </Link>
            <Link
              to="/work"
              onClick={() => soundFx.playClick()}
              className="px-6 py-3 rounded-full bg-content-primary text-canvas font-medium text-xs hover:bg-burgundy-soft hover:text-white transition-all flex items-center gap-2 group"
            >
              <span>Explore Selected Work</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-full border border-border-strong text-content-primary font-medium text-xs hover:bg-surface-elevated transition-colors"
            >
              Initiate Dialogue
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02. EDITORIAL MANIFESTO: 3 THINGS WE STRONGLY BELIEVE IN
      ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="border-t border-b border-border-subtle py-16 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-hand text-2xl text-burgundy-soft">our philosophical compass</span>
              <h2 className="text-3xl sm:text-4xl font-serif italic text-content-primary">
                3 Things We Strongly Believe In
              </h2>
            </div>
            <span className="text-xs font-mono text-content-muted uppercase tracking-widest">Principles of Craft</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Belief 1 */}
            <div className="space-y-3 p-6 rounded-2xl bg-surface-card/40 border border-border-subtle hover:border-sreesh/40 transition-colors">
              <span className="font-mono text-xs text-sreesh-light font-bold">01 / SREESH'S AXIOM</span>
              <h3 className="font-display font-bold text-lg text-content-primary leading-snug">
                Code is an architectural craft, not mere syntax.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                A system's longevity is decided before writing a single line of code. We prioritize deterministic state, zero-trust credential isolation, and sub-second latency over superficial complexity.
              </p>
            </div>

            {/* Belief 2 */}
            <div className="space-y-3 p-6 rounded-2xl bg-surface-card/40 border border-border-subtle hover:border-mrithula/40 transition-colors">
              <span className="font-mono text-xs text-mrithula-light font-bold">02 / MRITHULA'S AXIOM</span>
              <h3 className="font-display font-bold text-lg text-content-primary leading-snug">
                Interfaces should respect attention, not exploit it.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Quiet visual restraint, rigorous typographic hierarchy, and genuine WCAG AA accessibility convey confidence far more effectively than loud gradients or gratuitous animations.
              </p>
            </div>

            {/* Belief 3 */}
            <div className="space-y-3 p-6 rounded-2xl bg-surface-card/40 border border-border-subtle hover:border-burgundy-soft/50 transition-colors">
              <span className="font-mono text-xs text-burgundy-soft font-bold">03 / SHARED CONVICTION</span>
              <h3 className="font-display font-bold text-lg text-content-primary leading-snug">
                Solitary intelligence is fast; paired minds are transformative.
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                When deep systems engineering and empathic product design operate in unison without friction, software graduates from a utility into an unforgettable digital experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03. DUAL CREATOR DEEP-DIVE (Split Editorial Profiles with 3D Tilt)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* SREESH M ESSAY */}
          <PerspectiveCard intensity={12} glareOpacity={0.25} className="h-full">
            <div className="h-full p-8 sm:p-12 rounded-3xl border border-border-strong bg-surface-card space-y-8 flex flex-col justify-between group hover:border-sreesh-light transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-sreesh/20 text-sreesh-light border border-sreesh/30">
                    Profile 01
                  </span>
                  <span className="text-content-muted">Autonomous AI & Systems</span>
                </div>

                <div>
                  <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary">
                    Sreesh M
                  </h3>
                  <p className="text-xs font-mono text-sreesh-light mt-1.5">
                    Computer Science Engineer • System Architect
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
                  <p>
                    "I look at digital systems from the ground up: how data propagates across distributed nodes, how long-term memory can be retained without catastrophic forgetting, and how real-time WebGL loops maintain sustained 60 FPS under heavy geometry loads."
                  </p>
                  <p>
                    Specializing in agentic cognitive architectures, deterministic graph traversal, zero-trust security boundaries, and high-throughput TypeScript microservices.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  {PROFILES_DATA.sreesh.focusAreas.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-elevated text-content-secondary border border-border-subtle">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                <Link
                  to="/sreesh"
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-content-primary hover:text-sreesh-light transition-colors group"
                >
                  <span>Read Sreesh's Complete Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="font-mono text-[11px] text-content-muted">15+ Shipped Systems</span>
              </div>
            </div>
          </PerspectiveCard>

          {/* MRITHULA ESSAY */}
          <PerspectiveCard intensity={12} glareOpacity={0.25} className="h-full">
            <div className="h-full p-8 sm:p-12 rounded-3xl border border-border-strong bg-surface-card space-y-8 flex flex-col justify-between group hover:border-mrithula-light transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-mrithula/20 text-mrithula-light border border-mrithula/30">
                    Profile 02
                  </span>
                  <span className="text-content-muted">Design Systems & Product</span>
                </div>

                <div>
                  <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary">
                    Mrithula
                  </h3>
                  <p className="text-xs font-mono text-mrithula-light mt-1.5">
                    Digital Product Designer • Creative Technologist
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
                  <p>
                    "A product's aesthetic value is directly tied to its usability. I build comprehensive design systems that bridge Figma variables with production CSS custom properties, ensuring every interaction feels physically responsive, natural, and accessible."
                  </p>
                  <p>
                    Focused on atomic component scalability, user research methodologies, WCAG 2.1 AA contrast compliance, and seamless design-to-engineering delivery.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  {PROFILES_DATA.mrithula.focusAreas.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-elevated text-content-secondary border border-border-subtle">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                <Link
                  to="/mrithula"
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-content-primary hover:text-mrithula-light transition-colors group"
                >
                  <span>Read Mrithula's Complete Story</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="font-mono text-[11px] text-content-muted">Atomic Design Systems</span>
              </div>
            </div>
          </PerspectiveCard>
        </div>
      </section>

      {/* =========================================================================
          03.5 MULTI-DIMENSIONAL SHOWCASE (Synthesizing 17 Global Killer Portfolios)
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <KillerDimensionShowcase />
      </div>

      {/* =========================================================================
          04. EXPRESSIVE EDITORIAL PROJECT SHOWCASES (Replacing Repetitive Cards)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-24">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <span className="font-hand text-2xl text-burgundy-soft">curated case studies</span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight">
              Selected Works & Architectural Explorations
            </h2>
          </div>
          <Link
            to="/work"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-content-primary transition-colors"
          >
            <span>Complete Archive ({INITIAL_PROJECTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* COMPOSITION 1: ANTIGRAVITY NEURAL OS — Full Width Monumental Editorial with 3D Depth */}
        <PerspectiveCard intensity={8} glareOpacity={0.2} className="w-full">
          <article className="p-8 sm:p-14 rounded-3xl border border-border-strong bg-surface-card space-y-10 group hover:border-sreesh-light transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-sreesh-light" />
                <span className="text-sreesh-light font-bold">CASE STUDY 01</span>
                <span className="text-content-muted">• {antigravity.year}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-elevated border border-border-subtle text-content-muted">
                Architected by Sreesh M
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight group-hover:text-sreesh-light transition-colors">
                  {antigravity.title}
                </h3>
                <p className="font-serif italic text-lg sm:text-xl text-content-secondary leading-snug">
                  "{antigravity.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed pt-2">
                  {antigravity.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-3">
                  {antigravity.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-surface-elevated text-content-secondary border border-border-subtle">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architectural Highlight Callout */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-elevated/60 border border-border-subtle space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-content-muted uppercase">Architecture Metric</span>
                  <Sparkles className="w-4 h-4 text-sreesh-light" />
                </div>
                <p className="text-xl sm:text-2xl font-display font-bold text-content-primary">
                  {antigravity.metrics}
                </p>
                <div className="text-xs text-content-secondary space-y-2 border-t border-border-subtle pt-3">
                  <p><strong>Challenge:</strong> {antigravity.challenge}</p>
                  <p><strong>Solution:</strong> {antigravity.solution}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
              <span className="font-mono text-xs text-content-muted">Verified Autonomous Execution</span>
              <Link
                to={`/work/${antigravity.slug}`}
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-sreesh/20 text-xs font-semibold text-content-primary transition-colors"
              >
                <span>Read Architectural Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        </PerspectiveCard>

        {/* COMPOSITION 2 & 3: ASYMMETRIC DUAL FEATURE SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* COMPOSITION 2: ATELIER DESIGN SYSTEM (Mrithula) */}
          <div className="lg:col-span-6">
            <PerspectiveCard intensity={10} glareOpacity={0.2} className="h-full">
              <article className="h-full p-8 sm:p-10 rounded-3xl border border-border-strong bg-surface-card space-y-8 flex flex-col justify-between group hover:border-mrithula-light transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mrithula-light" />
                      <span className="text-mrithula-light font-bold">CASE STUDY 02</span>
                    </div>
                    <span className="text-content-muted">Designed by Mrithula</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-4xl font-display font-extrabold text-content-primary group-hover:text-mrithula-light transition-colors">
                      {atelier.title}
                    </h3>
                    <p className="font-serif italic text-base text-content-secondary">
                      "{atelier.tagline}"
                    </p>
                    <p className="text-xs text-content-secondary leading-relaxed">
                      {atelier.description}
                    </p>
                  </div>

                  {/* Visual Design Token Preview Chips */}
                  <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-3">
                    <span className="text-[10px] font-mono uppercase text-content-muted">Semantic Token Specimen</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-burgundy flex items-center justify-center text-[10px] font-mono text-white" title="#722237">B</div>
                      <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border-strong flex items-center justify-center text-[10px] font-mono text-content-primary" title="Elevated">E</div>
                      <div className="w-8 h-8 rounded-lg bg-mrithula flex items-center justify-center text-[10px] font-mono text-white" title="Rose">R</div>
                      <div className="w-8 h-8 rounded-lg bg-sreesh flex items-center justify-center text-[10px] font-mono text-white" title="Slate">S</div>
                    </div>
                    <p className="text-[11px] font-mono text-emerald-400">✓ 100% WCAG 2.1 AA Contrast Compliance</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs font-mono text-content-muted">500+ Design Tokens</span>
                  <Link
                    to={`/work/${atelier.slug}`}
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-primary hover:text-mrithula-light transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </PerspectiveCard>
          </div>

          {/* COMPOSITION 3: AETHER BMW M4 3D (Sreesh) */}
          <div className="lg:col-span-6">
            <PerspectiveCard intensity={10} glareOpacity={0.2} className="h-full">
              <article className="h-full p-8 sm:p-10 rounded-3xl border border-border-strong bg-surface-card space-y-8 flex flex-col justify-between group hover:border-burgundy-soft transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-burgundy-soft" />
                      <span className="text-burgundy-soft font-bold">CASE STUDY 03</span>
                    </div>
                    <span className="text-content-muted">Three.js / WebGL Spatial</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-4xl font-display font-extrabold text-content-primary group-hover:text-burgundy-soft transition-colors">
                      {bmwm4.title}
                    </h3>
                    <p className="font-serif italic text-base text-content-secondary">
                      "{bmwm4.tagline}"
                    </p>
                    <p className="text-xs text-content-secondary leading-relaxed">
                      {bmwm4.description}
                    </p>
                  </div>

                  {/* 3D WebGL Technical Callout */}
                  <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-content-muted">
                      <span>Render Loop:</span>
                      <span className="text-emerald-400 font-bold">Sustained 60 FPS</span>
                    </div>
                    <div className="flex items-center justify-between text-content-muted">
                      <span>Shader Pipeline:</span>
                      <span className="text-content-primary">Custom Draco GLSL</span>
                    </div>
                    <div className="flex items-center justify-between text-content-muted">
                      <span>Materials:</span>
                      <span className="text-content-primary">4K HDR Cubemaps</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs font-mono text-content-muted">Draco Mesh Optimized</span>
                  <Link
                    to={`/work/${bmwm4.slug}`}
                    onClick={() => soundFx.playClick()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-primary hover:text-burgundy-soft transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </PerspectiveCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05. THE CONVERGENCE ZONE: WHERE DUAL IDENTITIES MEET (Shared Work)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl border border-burgundy-soft/40 bg-gradient-to-br from-surface-card via-surface-elevated to-surface-card p-8 sm:p-16 overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-burgundy/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-burgundy-soft bg-burgundy/20 text-burgundy-soft">
              <GitMerge className="w-3.5 h-3.5" />
              <span>The Studio Convergence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight">
              Aethel Collaborative Studio Platform
            </h2>

            <p className="font-serif italic text-lg sm:text-xl text-content-secondary">
              "Where Sreesh's systems architecture and Mrithula's human-centered design converge into one unified software platform."
            </p>

            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Designed as the operational cockpit for paired creative technologists, Aethel centralizes real-time Kanban pipelines, Markdown knowledge graphs, asset management, and portfolio synchronization under strict PostgreSQL Row Level Security (RLS).
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/collaborations"
                onClick={() => soundFx.playClick()}
                className="px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-lg transition-colors flex items-center gap-2"
              >
                <span>Explore Collaborative Works</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/work/${aethel.slug}`}
                onClick={() => soundFx.playClick()}
                className="px-5 py-3 rounded-xl border border-border-strong bg-surface-card hover:bg-surface-elevated text-xs font-semibold text-content-primary transition-colors"
              >
                View Architecture Case Study
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          06. CLOSING EDITORIAL INVITATION
      ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6 pt-12">
        <span className="font-hand text-3xl text-burgundy-soft">let's build together</span>
        <h2 className="text-4xl sm:text-6xl font-serif italic text-content-primary tracking-tight">
          "Two minds. Endless possibilities."
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary max-w-lg mx-auto leading-relaxed">
          Available for selected high-impact engineering engagements, design leadership, hackathons, and technical advisory.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/contact"
            onClick={() => soundFx.playClick()}
            className="px-8 py-3.5 rounded-full bg-content-primary text-canvas font-semibold text-xs sm:text-sm hover:bg-burgundy-soft hover:text-white transition-all shadow-xl"
          >
            Start a Conversation
          </Link>
          <Link
            to="/resumes"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-full border border-border-strong bg-surface-card text-content-primary font-semibold text-xs sm:text-sm hover:bg-surface-elevated transition-colors"
          >
            Review Curriculum Vitae
          </Link>
        </div>
      </section>
    </div>
  </div>
);
};
