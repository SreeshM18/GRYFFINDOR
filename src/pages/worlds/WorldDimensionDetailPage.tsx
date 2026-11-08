import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Compass,
  Sparkles,
  CheckCircle2,
  Sliders,
  Maximize2,
  Box,
  RotateCcw,
  Activity,
  Layers,
} from 'lucide-react';
import { DIMENSION_WORLDS, DimensionWorld } from '../../data/dimensionsData';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { PerspectiveCard } from '../../components/ui/PerspectiveCard';
import { MarijanaGardenWidget } from '../../components/widgets/MarijanaGardenWidget';
import { AritroTelemetryWidget } from '../../components/widgets/AritroTelemetryWidget';
import { FudaliMomentumWidget } from '../../components/widgets/FudaliMomentumWidget';
import { EyeballsBroadcastWidget } from '../../components/widgets/EyeballsBroadcastWidget';

export const WorldDimensionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find matching world or default to 01
  const currentIndex = DIMENSION_WORLDS.findIndex((w) => w.id === id);
  const worldIndex = currentIndex !== -1 ? currentIndex : 0;
  const world: DimensionWorld = DIMENSION_WORLDS[worldIndex];

  // Neighbor navigation
  const prevWorld = DIMENSION_WORLDS[(worldIndex - 1 + DIMENSION_WORLDS.length) % DIMENSION_WORLDS.length];
  const nextWorld = DIMENSION_WORLDS[(worldIndex + 1) % DIMENSION_WORLDS.length];

  // Interactive state variations per world
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<'architecture' | 'interaction' | 'source'>('architecture');
  const [prismFace, setPrismFace] = useState<number>(0);
  const [customNote, setCustomNote] = useState<string>(
    'Reflecting on this dimension: tactile physical metaphors make complex software feel human.'
  );

  // Keyboard navigation: left/right arrows for prev/next world, Escape to return to atlas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        soundFx.playClick();
        navigate(`/worlds/${prevWorld.id}`);
      } else if (e.key === 'ArrowRight') {
        soundFx.playClick();
        navigate(`/worlds/${nextWorld.id}`);
      } else if (e.key === 'Escape') {
        soundFx.playClick();
        navigate('/worlds');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, prevWorld.id, nextWorld.id]);

  return (
    <div
      className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500"
      style={{
        background: `radial-gradient(ellipse at 80% 20%, ${world.palette.card} 0%, ${world.palette.bg} 75%)`,
        color: world.palette.text,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Navigation Bar between Worlds */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 text-xs font-mono">
          <Link
            to="/worlds"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 text-content-muted hover:text-content-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dimension Atlas (Esc)</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/worlds/${prevWorld.id}`}
              onClick={() => soundFx.playClick()}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-surface-card hover:bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1.5"
              title="Previous Dimension (← Arrow)"
            >
              <span>←</span>
              <span className="hidden sm:inline">{prevWorld.name}</span>
            </Link>

            <span className="text-gold font-bold px-2">
              {world.number} / 17
            </span>

            <Link
              to={`/worlds/${nextWorld.id}`}
              onClick={() => soundFx.playClick()}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-surface-card hover:bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1.5"
              title="Next Dimension (→ Arrow)"
            >
              <span className="hidden sm:inline">{nextWorld.name}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Hero Section of this Dimension */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold border"
              style={{
                borderColor: world.palette.accent,
                color: world.palette.accent,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              DIMENSION {world.number} • {world.category.toUpperCase()}
            </span>
            <span className="text-content-muted">•</span>
            <span className="text-content-secondary">
              Informed by <strong className="text-content-primary">{world.sourceName}</strong>
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-display font-extrabold tracking-tight leading-[0.92]">
            {world.title}
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-gold/90 max-w-2xl leading-relaxed">
            "{world.subtitle}"
          </p>

          <p className="text-sm sm:text-base text-content-secondary max-w-3xl leading-relaxed font-sans">
            {world.principle}
          </p>
        </section>

        {/* Dimension Key Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {world.keyStats.map((st, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-surface-card/60 backdrop-blur-md space-y-2"
            >
              <span className="text-xs font-mono text-content-muted uppercase tracking-wider">
                {st.label}
              </span>
              <p
                className="text-2xl sm:text-3xl font-display font-extrabold"
                style={{ color: world.palette.accent }}
              >
                {st.value}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Feature Sandbox */}
        <section className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-surface-card/80 backdrop-blur-xl space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Dimension Sandbox</span>
              </span>
              <h2 className="text-2xl font-display font-bold">
                {world.interactiveFeature}
              </h2>
            </div>

            <div className="flex rounded-xl p-1 bg-surface-elevated border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'architecture' ? 'bg-burgundy text-white font-bold' : 'text-content-muted'
                }`}
              >
                Live Work
              </button>
              <button
                onClick={() => setActiveTab('interaction')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'interaction' ? 'bg-burgundy text-white font-bold' : 'text-content-muted'
                }`}
              >
                Sandbox Control
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'source' ? 'bg-burgundy text-white font-bold' : 'text-content-muted'
                }`}
              >
                Source Audit
              </button>
            </div>
          </div>

          {/* Tab 1: Live Work from Sreesh & Mrithula */}
          {activeTab === 'architecture' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono text-gold uppercase tracking-wider">
                  Featured Case Study Application
                </span>
                <h3 className="text-3xl font-display font-extrabold leading-tight">
                  {world.sampleWorkSnippet.title}
                </h3>
                <p className="text-xs font-mono text-content-muted">
                  {world.sampleWorkSnippet.role}
                </p>
                <p className="text-sm text-content-secondary leading-relaxed font-sans">
                  {world.sampleWorkSnippet.outcome}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {world.sampleWorkSnippet.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg border border-white/10 bg-surface-elevated text-xs font-mono text-content-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <PerspectiveCard intensity={15} glareOpacity={0.3}>
                  <div
                    className="p-8 rounded-2xl border flex flex-col justify-between space-y-6 shadow-xl"
                    style={{
                      borderColor: world.palette.accent,
                      background: `linear-gradient(145deg, ${world.palette.card}, #0A0A0E)`,
                    }}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gold font-bold">DIMENSION TEST SPEC</span>
                      <span>60 FPS Active</span>
                    </div>
                    <div className="space-y-2">
                      <p className="font-serif italic text-lg text-content-primary">
                        "{world.originalReinterpretation}"
                      </p>
                      <small className="text-[11px] font-mono text-content-muted block">
                        Observed Pattern: {world.observablePattern}
                      </small>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400">✓ Verified Clean</span>
                      <Maximize2 className="w-3.5 h-3.5 text-gold" />
                    </div>
                  </div>
                </PerspectiveCard>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Sandbox */}
          {activeTab === 'interaction' && (
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm text-content-secondary">
                Adjust parameters to experience how this dimension modulates visual and structural density:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>Dimension Intensity Modifier</span>
                  <span className="text-gold font-bold">{sliderVal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <div
                className="p-6 rounded-2xl border border-white/10 transition-all duration-300"
                style={{
                  padding: `${16 + (sliderVal / 100) * 24}px`,
                  transform: `scale(${1 + (sliderVal - 50) * 0.002})`,
                  backgroundColor: world.palette.card,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase" style={{ color: world.palette.accent }}>
                    Active Feedback
                  </span>
                  <Activity className="w-4 h-4 text-gold animate-pulse" />
                </div>
                <p className="text-sm text-content-primary mt-2">
                  Dynamic scale, padding, and lighting adapt in real time to your preferences.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundFx.playChime();
                    setSliderVal(50);
                  }}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-surface-elevated text-xs font-mono text-content-primary hover:bg-surface-card flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold" />
                  <span>Reset to Balanced Defaults</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Source Audit & Attribution */}
          {activeTab === 'source' && (
            <div className="space-y-6 max-w-2xl text-xs font-mono">
              <div className="p-6 rounded-2xl border border-white/10 bg-surface-elevated space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gold font-bold uppercase">Original Reference Provenance</span>
                  <span className="text-content-muted">Independently Audited</span>
                </div>
                <div className="space-y-1.5">
                  <div><strong>Reference Studio:</strong> {world.sourceName}</div>
                  <div><strong>Original URL:</strong> <a href={world.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{world.sourceUrl}</a></div>
                  <div><strong>Observed Pattern:</strong> {world.observablePattern}</div>
                  <div><strong>Original Reinterpretation:</strong> {world.originalReinterpretation}</div>
                </div>
                <p className="text-content-muted leading-relaxed pt-2 border-t border-white/10">
                  Per <code>MASTER_PROMPT.md</code> guidelines: Design principles and structural rhythms are synthesized into an original dark-academia language. No copyrighted source assets, code, or trademarks were copied.
                </p>
                <a
                  href={world.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs"
                >
                  <span>Visit {world.sourceName} Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Signature Live Interactive Suite if applicable to this dimension */}
          <div className="pt-8 border-t border-white/10">
            {world.id === '02-sketch' && <MarijanaGardenWidget />}
            {world.id === '01-signal' && <EyeballsBroadcastWidget />}
            {world.id === '15-system' && <AritroTelemetryWidget />}
            {world.id === '16-synthesis' && <FudaliMomentumWidget />}
            {!['02-sketch', '01-signal', '15-system', '16-synthesis'].includes(world.id) && (
              <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-content-primary">
                    Try Any Design Style in the Design Studio
                  </h4>
                  <p className="text-xs text-content-muted mt-0.5">
                    Switch between 8 world-class website designs with live interactive widgets and color physics.
                  </p>
                </div>
                <Link
                  to="/designs"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold font-mono text-xs font-semibold border border-gold/30 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open Design Studio →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Navigation Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs font-mono">
          <Link
            to={`/worlds/${prevWorld.id}`}
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 text-content-secondary hover:text-content-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Previous: Dimension {prevWorld.number} — {prevWorld.name}</span>
          </Link>

          <Link
            to="/worlds"
            onClick={() => soundFx.playClick()}
            className="text-gold hover:underline font-bold text-center"
          >
            View All 17 Dimensions
          </Link>

          <Link
            to={`/worlds/${nextWorld.id}`}
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 text-content-secondary hover:text-content-primary transition-colors text-right justify-end"
          >
            <span>Next: Dimension {nextWorld.number} — {nextWorld.name}</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </div>
    </div>
  );
};

