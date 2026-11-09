import React, { useState, useEffect } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  Sparkles,
  Zap,
  Layers,
  Activity,
  Check,
  Smartphone,
  MousePointer,
  Gauge,
  Sliders,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export const EmilCraftEngineWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apple' | 'cheatsheet' | 'skills' | 'rules'>('apple');
  const [testCounter, setTestCounter] = useState(1284);
  const [tabularActive, setTabularActive] = useState(true);
  const [activeButtonFired, setActiveButtonFired] = useState(false);
  const [appleSpringOpen, setAppleSpringOpen] = useState(true);
  const [springBounce, setSpringBounce] = useState<number>(0); // 0 = critically damped (Apple HIG default)

  // Auto-increment test counter to show tabular vs non-tabular stability
  useEffect(() => {
    const timer = setInterval(() => {
      setTestCounter((c) => (c >= 9999 ? 1000 : c + Math.floor(Math.random() * 7) + 1));
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const emilSkillsList = [
    { name: 'emil-design-eng', desc: "Master philosophy on UI polish, compound details, and taste that elevates software." },
    { name: 'animate', desc: "Correct curves, durations, properties; avoid layout thrashing and build from scratch." },
    { name: 'animation-performance', desc: "60/120fps GPU compositing (transform/opacity), avoiding layout shift." },
    { name: 'animation-vocabulary', desc: "Spring stiffness, damping, mass, anticipation, overshoot shared grammar." },
    { name: 'apple-design', desc: "WWDC HIG principles, fluid tactile physics, spatial hierarchy, vibrancy, and blur." },
    { name: 'ask-sonner', desc: "Sonner toast system: gestures, stacking, swipe-to-dismiss, and keyboard focus." },
    { name: 'break-ui', desc: "Stress-testing with worst-case data: long strings, zero states, overflows." },
    { name: 'choreograph', desc: "Sequence timing: what leads, what follows, parallel runs, and what shouldn't move." },
    { name: 'find-animation-opportunities', desc: "Locate state changes that benefit from motion vs what must remain static." },
    { name: 'gestures', desc: "1:1 pointer tracking, velocity-aware release, and catchable mid-flight physics." },
    { name: 'improve-animations', desc: "Auditing animations, replacing stiffness with natural organic dampening." },
    { name: 'mobile-native', desc: "Fix 300ms tap delay, tap highlight flash, 100vh bugs, and input zoom on phones." },
    { name: 'pick-ui-library', desc: "Choosing battle-tested primitives (Radix, Ark UI) instead of fragile packages." },
    { name: 'prototype', desc: "Multi-version rapid design switcher for comparative UI exploration." },
    { name: 'remove-animations', desc: "Killing unnecessary animations on 100x/day keyboard actions (Raycast speed)." },
    { name: 'review-animations', desc: "Strict Before/After Markdown review rubric for motion correctness." },
    { name: 'animate-expo', desc: "React Native and Expo gesture performance kept entirely off JS thread." },
    { name: 'write-swift', desc: "Modern Swift 6 concurrency, value types, and native Apple performance." },
  ];

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-card/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg">
            <Sparkles className="w-5 h-5 text-black" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-xl text-content-primary">
                Emil Kowalski Design Engineering Engine
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Craft Standards
              </span>
            </div>
            <p className="text-xs text-content-muted mt-0.5">
              Integrated directly from <code className="text-gold">github.com/emilkowalski/skills.git</code> — taste, tactile physics & 60fps craft.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('apple');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'apple'
                ? 'bg-surface-card text-content-primary font-bold shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            <span> Apple Design</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('cheatsheet');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'cheatsheet'
                ? 'bg-surface-card text-content-primary font-bold shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Interactive Cheatsheet
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('skills');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'skills'
                ? 'bg-surface-card text-content-primary font-bold shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            18 Skills Matrix
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('rules');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-surface-card text-content-primary font-bold shadow-sm'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            Golden Rules
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 0: APPLE UI DESIGN SYSTEM & WWDC FLUID INTERFACES (apple-design)
      ========================================================================= */}
      {activeTab === 'apple' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Apple Glass Translucency & Light Bevel */}
            <div className="p-5 rounded-2xl apple-glass space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Apple Glass Material
                </span>
                <span className="text-[10px] text-gold font-mono">blur(20px) sat(180%)</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Translucent functional layer that organizes content without stealing focus. Features a light-catching top bevel (<code className="font-mono text-[11px] text-content-primary">border-top: 1px solid rgba(255,255,255,0.15)</code>).
              </p>
              <div className="pt-2 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-content-muted">
                <span className="text-white block font-bold">Vibrancy Hierarchy:</span>
                Never stack light translucent surfaces on top of each other. Darker materials anchor structure; lighter surfaces direct focus.
              </div>
            </div>

            {/* 2. Interruptible Springs (Apple HIG WWDC 2018) */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Interruptible Springs
                </span>
                <span className="text-[10px] text-blue-400 font-mono">Damping 1.0 (Critical)</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Apple uses <strong>Damping Ratio + Response</strong> instead of fixed durations. Animations are always grabable and redirectable mid-flight from their current on-screen value.
              </p>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAppleSpringOpen(!appleSpringOpen);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all active:scale-95 shadow"
                >
                  {appleSpringOpen ? 'Simulate Sheet Dismissal' : 'Simulate Spring Open'}
                </button>
                <div
                  className={`p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-xs font-mono transition-all duration-300 ${
                    appleSpringOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-40'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <span className="text-blue-300 font-bold block">Status: {appleSpringOpen ? 'Spring Settled' : 'Collapsed'}</span>
                  <span className="text-[10px] text-content-muted">Response: 0.35s • Damping: 1.0</span>
                </div>
              </div>
            </div>

            {/* 3. Apple Optical Typography (WWDC 2020) */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  Optical Typography
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Dynamic Tracking</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Apple type scales inversely with size. Large headlines receive negative tracking (<code className="text-emerald-400">-0.035em</code>); small captions receive positive tracking (<code className="text-emerald-400">+0.025em</code>).
              </p>
              <div className="pt-2 p-3 rounded-xl bg-surface-card border border-border-subtle space-y-1">
                <h4 className="apple-display text-2xl font-bold text-content-primary">
                  SREESH × MRITHULA
                </h4>
                <p className="apple-caption text-gold">
                  GRYFFINDOR LIFE & WORK OPERATING SYSTEM
                </p>
              </div>
            </div>
          </div>

          {/* WWDC 2018 Fluid Interfaces 4 Core Human Needs */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <span className="font-mono text-xs font-bold text-content-primary uppercase">
                Apple's 4 Human Needs for Fluid Interfaces (WWDC 2018)
              </span>
              <span className="text-[10px] font-mono text-gold">
                Translated for Web & Antigravity
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
                <span className="font-bold text-blue-400 block">1. Predictability</span>
                <p className="text-content-muted text-[11px]">Symmetric paths: if a modal enters from the right, it dismisses to the right. Never in-right, out-bottom.</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
                <span className="font-bold text-emerald-400 block">2. Understanding</span>
                <p className="text-content-muted text-[11px]">Origin anchoring: popovers scale from their trigger button (<code className="text-emerald-400">transform-origin</code>), making spatial relationships obvious.</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
                <span className="font-bold text-amber-400 block">3. Achievement</span>
                <p className="text-content-muted text-[11px]">Zero latency: respond on pointer-down, not touch-up. Kill every artificial debounce on input paths.</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-1">
                <span className="font-bold text-purple-400 block">4. Joy & Tactility</span>
                <p className="text-content-muted text-[11px]">Momentum projection: flicks throw elements based on release velocity with exponential decay, not linear stops.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: INTERACTIVE BEFORE vs AFTER CHEATSHEET
      ========================================================================= */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Tactile Button Press Physics */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                  Tactile Press Physics
                </span>
                <span className="text-[10px] text-amber-400 font-mono">scale(0.975)</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Buttons without an active state feel dead and unresponsive. Real buttons respond with an immediate physical micro-compression.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveButtonFired(true);
                    setTimeout(() => setActiveButtonFired(false), 800);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-black font-semibold text-xs transition-transform active:scale-[0.97] active:duration-75 shadow-md flex items-center gap-1.5"
                >
                  <span>Press Me to Feel</span>
                  {activeButtonFired && <Check className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[11px] font-mono text-content-muted">
                  {activeButtonFired ? '✓ Responsive' : 'Click & Hold'}
                </span>
              </div>
            </div>

            {/* 2. Numerical Tabular Stability */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  Tabular Numbers
                </span>
                <button
                  onClick={() => setTabularActive(!tabularActive)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-card text-gold hover:underline"
                >
                  {tabularActive ? 'Tabular: ON' : 'Tabular: OFF'}
                </button>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Proportional numbers cause widths to constantly wobble when values increment. Tabular figures fix character slot widths.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-border-subtle pt-3">
                <span className="text-xs font-mono text-content-muted">Live Stream:</span>
                <span
                  className={`text-2xl font-bold font-mono transition-colors ${
                    tabularActive ? 'tabular-nums text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ₹{testCounter.toLocaleString('en-IN')}.84
                </span>
              </div>
            </div>

            {/* 3. Fluid Easing Curves */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Fluid Easing
                </span>
                <span className="text-[10px] font-mono text-emerald-400">cubic-bezier</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                <code className="text-red-400 font-mono">ease-in</code> starts sluggish and feels unresponsive. Enter transitions must use <code className="text-emerald-400 font-mono">ease-out</code> so the user gets instant visual confirmation.
              </p>
              <div className="pt-2 text-xs font-mono text-content-muted bg-surface-card p-2 rounded-xl border border-border-subtle">
                cubic-bezier(0.16, 1, 0.3, 1)
              </div>
            </div>

            {/* 4. Popover & Modal Origins */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Transform Origins
                </span>
                <span className="text-[10px] font-mono text-purple-400">0.95 Scale</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Never animate modals from <code className="text-red-400 font-mono">scale(0)</code> (nothing appears from a singularity). Scale from <code className="text-emerald-400 font-mono">scale(0.95)</code> to <code className="text-emerald-400 font-mono">scale(1)</code>.
              </p>
              <div className="text-[11px] font-mono text-content-muted pt-1">
                Popovers scale from their trigger button; dialogs stay centered.
              </div>
            </div>

            {/* 5. GPU Composited Motion */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  GPU Compositing
                </span>
                <span className="text-[10px] font-mono text-yellow-400">60 / 120 FPS</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Never animate <code className="text-red-400 font-mono">top</code>, <code className="text-red-400 font-mono">left</code>, or <code className="text-red-400 font-mono">width</code> (triggers costly layout reflows). Animate only <code className="text-emerald-400 font-mono">transform</code> and <code className="text-emerald-400 font-mono">opacity</code>.
              </p>
              <div className="text-[11px] font-mono text-content-muted pt-1">
                Avoid <code className="text-red-400">transition: all</code> — always declare exact properties.
              </div>
            </div>

            {/* 6. Mobile Native Polish */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-content-muted">
                <span className="font-bold text-content-primary flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                  Mobile Polish
                </span>
                <span className="text-[10px] font-mono text-rose-400">iPhone / Android</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Applied <code className="text-emerald-400 font-mono">-webkit-tap-highlight-color: transparent</code> and <code className="text-emerald-400 font-mono">touch-action: manipulation</code> to eliminate mobile tap latency.
              </p>
              <div className="text-[11px] font-mono text-content-muted pt-1">
                Input font size set to 16px to prevent unwanted iOS viewport auto-zoom.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: THE 18 INSTALLED EMIL KOWALSKI SKILLS
      ========================================================================= */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted border-b border-border-subtle pb-3">
            <span>18 SKILLS INSTALLED IN REPOSITORY (.agents/skills/emilkowalski)</span>
            <span className="text-gold">Ready for AI & Developers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {emilSkillsList.map((skill) => (
              <div
                key={skill.name}
                className="p-4 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-card transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono font-bold text-gold">
                    {skill.name}
                  </code>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-content-secondary leading-snug">
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: THE GOLDEN ANIMATION DECISION FRAMEWORK
      ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle space-y-6 text-xs font-sans">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-base text-content-primary">
              1. Should this animate at all? Frequency Matrix
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-border-subtle rounded-xl">
                <thead className="bg-surface-card text-content-muted border-b border-border-subtle">
                  <tr>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Action Rule</th>
                    <th className="p-2.5">Example in Gryffindor OS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-content-secondary">
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">100+ times/day</td>
                    <td className="p-2.5 text-red-400 font-bold">No animation. Ever.</td>
                    <td className="p-2.5">Command Palette (⌘K) opens instantly like Raycast.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Tens of times/day</td>
                    <td className="p-2.5 text-content-primary">Drastically reduce (under 150ms)</td>
                    <td className="p-2.5">Navigation tabs, button presses, quick toggles.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Occasional</td>
                    <td className="p-2.5 text-emerald-400">Standard fluid animation (200–300ms)</td>
                    <td className="p-2.5">Modals, drawers, Owl Post notifications.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Rare / Milestone</td>
                    <td className="p-2.5 text-purple-400">Delight & expressive physics</td>
                    <td className="p-2.5">Quest completed celebration, semester exam cleared.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border-subtle">
            <h4 className="font-display font-bold text-base text-content-primary">
              2. Core Tenet: Taste is Trained, Unseen Details Compound
            </h4>
            <blockquote className="p-4 rounded-xl bg-surface-card border-l-4 border-gold text-content-secondary italic font-serif text-sm">
              "All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune." — Paul Graham
            </blockquote>
          </div>
        </div>
      )}
    </div>
  );
};

