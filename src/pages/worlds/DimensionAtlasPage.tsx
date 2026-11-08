import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Shuffle,
  ExternalLink,
  Layers,
  Box,
  Palette,
  Terminal,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { DIMENSION_WORLDS, DimensionWorld } from '../../data/dimensionsData';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { PerspectiveCard } from '../../components/ui/PerspectiveCard';

export const DimensionAtlasPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const filteredWorlds = DIMENSION_WORLDS.filter(
    (w) => selectedCategory === 'all' || w.category === selectedCategory
  );

  // Keyboard shortcut handler (R for random, Esc for clear filter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'r' || e.key === 'R') {
        soundFx.playChime();
        const randomWorld = DIMENSION_WORLDS[Math.floor(Math.random() * DIMENSION_WORLDS.length)];
        navigate(`/worlds/${randomWorld.id}`);
      }
      if (e.key === 'Escape') {
        setSelectedCategory('all');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleRandom = () => {
    soundFx.playChime();
    const randomWorld = DIMENSION_WORLDS[Math.floor(Math.random() * DIMENSION_WORLDS.length)];
    navigate(`/worlds/${randomWorld.id}`);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 01. LIVING SCULPTURAL HEART HERO (As specified in MASTER_PROMPT.md) */}
      <section className="relative p-8 sm:p-16 rounded-3xl border border-gold/30 bg-gradient-to-br from-[#140E10] via-surface-card to-[#090A0D] overflow-hidden shadow-2xl">
        {/* Orbital Background Rings */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] border border-gold/15 rounded-full pointer-events-none animate-spin-slow" />
        <div className="absolute -top-16 -right-16 w-[450px] h-[450px] border border-gold/20 rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-scarlet/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-gold/30 bg-surface-elevated text-gold">
            <Compass className="w-3.5 h-3.5" />
            <span>DIMENSION ATLAS • 17 LIVING WORLDS</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-content-primary tracking-tight leading-[0.95]">
            One Mind.<br />
            <span className="font-serif italic font-light text-gold">
              Seventeen Dimensions.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-sans max-w-2xl">
            A unified creative universe synthesizing design intelligence, 3D spatial kinetics, and editorial craft from 17 legendary global portfolio references. Every world is an independently navigable experience.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRandom}
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-black text-xs font-bold transition-all shadow-lg flex items-center gap-2"
              title="Jump to a random dimension (Shortcut: R)"
            >
              <Shuffle className="w-4 h-4" />
              <span>Enter Random Dimension [R]</span>
            </button>

            <Link
              to="/sources"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-xl border border-gold/30 bg-surface-card hover:bg-surface-elevated text-xs font-semibold text-content-primary transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
              <span>17 Sources Audit & Credits</span>
            </Link>

            <Link
              to="/atrium"
              onClick={() => soundFx.playClick()}
              className="px-5 py-3 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated text-xs font-semibold text-content-secondary hover:text-content-primary transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-burgundy-soft" />
              <span>Archive Atrium</span>
            </Link>
          </div>
        </div>

        {/* Sculptural Living Heart Emblem in 3D Space */}
        <div className="absolute bottom-6 right-8 sm:bottom-12 sm:right-16 hidden md:flex flex-col items-center pointer-events-none select-none">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Pulsing Organic Heart Glyphs */}
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping opacity-25" />
            <div className="absolute inset-4 rounded-full border border-scarlet/30 animate-pulse" />
            <div className="relative z-10 text-6xl text-gold filter drop-shadow-[0_0_20px_rgba(211,166,37,0.5)]">
              ❦
            </div>
            {/* Orbiting Ring */}
            <div className="absolute inset-2 border-t-2 border-r-2 border-gold/60 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="font-mono text-[10px] text-gold/80 uppercase tracking-widest mt-2">
            Living Kinetic Core
          </span>
        </div>
      </section>

      {/* 02. CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span className="text-content-muted mr-2 uppercase text-[10px] tracking-wider">
            Filter Dimensions:
          </span>
          {[
            { id: 'all', label: 'All 17 Worlds' },
            { id: 'editorial', label: 'Editorial' },
            { id: 'tactile', label: 'Tactile & Desk' },
            { id: 'spatial', label: '3D Spatial' },
            { id: 'system', label: 'System & Spec' },
            { id: 'narrative', label: 'Narrative & Timeline' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-burgundy text-gold font-bold border border-gold/40 shadow-sm'
                  : 'bg-surface-card text-content-secondary hover:text-content-primary border border-border-subtle'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-content-muted flex items-center gap-2">
          <span>Showing <strong>{filteredWorlds.length}</strong> of 17 Worlds</span>
          <span className="text-gold">•</span>
          <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-content-primary">R</kbd> for random</span>
        </div>
      </div>

      {/* 03. 17 LIVING WORLD TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorlds.map((world) => (
          <PerspectiveCard key={world.id} intensity={15} glareOpacity={0.25} className="h-full">
            <Link
              to={`/worlds/${world.id}`}
              onClick={() => soundFx.playClick()}
              className="h-full p-8 rounded-3xl border border-gold/30 bg-surface-card hover:border-gold/70 flex flex-col justify-between space-y-6 transition-colors group block relative overflow-hidden shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${world.palette.card} 0%, #0B0B0E 100%)`,
              }}
            >
              {/* Corner Watermark Number */}
              <span className="absolute -top-2 -right-2 text-7xl font-display font-extrabold text-content-primary/5 group-hover:text-gold/10 transition-colors pointer-events-none select-none">
                {world.number}
              </span>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-xs font-mono border-b border-border-subtle pb-3">
                  <span className="text-gold font-bold uppercase tracking-wider">
                    DIMENSION {world.number}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-content-muted text-[10px] border border-border-subtle">
                    {world.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-display font-extrabold text-content-primary group-hover:text-gold transition-colors leading-tight">
                    {world.name}
                  </h3>
                  <p className="font-serif italic text-sm text-gold/90 mt-1">
                    "{world.subtitle}"
                  </p>
                </div>

                <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed">
                  {world.principle}
                </p>

                {/* Key Stats Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {world.keyStats.slice(0, 2).map((st, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-surface-elevated/70 text-content-primary border border-border-subtle"
                    >
                      {st.label}: <strong className="text-gold">{st.value}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Source Citation & Passage Trigger */}
              <div className="relative z-10 pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-content-muted">
                  Ref: <strong className="text-content-secondary">{world.sourceName}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-gold font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Enter World</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </PerspectiveCard>
        ))}
      </div>
    </div>
  );
};

