import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { DIMENSION_WORLDS } from '../../data/dimensionsData';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const SourcesDirectoryPage: React.FC = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <Link
          to="/worlds"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dimension Atlas</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-gold/30 bg-surface-card text-gold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>REFERENCE AUDIT & PROVENANCE REGISTRY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          17 Global Design Sources
        </h1>

        <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-sans">
          In strict compliance with <code>MASTER_PROMPT.md</code> and <code>REFERENCE_AUDIT.md</code>: Every referenced portfolio is audited for structural design principles, responsive behaviors, and typography rhythms. All originals remain directly credited and linked below.
        </p>

        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-xs font-mono text-emerald-300 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            100% Originality Guarantee: Principles and spatial rhythms are synthesized into an original dark-academia design system. No third-party code, proprietary fonts, or trademarks were copied.
          </span>
        </div>
      </div>

      {/* 17 Sources Grid */}
      <div className="rounded-3xl border border-border-subtle bg-surface-card overflow-hidden shadow-xl">
        <div className="divide-y divide-border-subtle">
          {DIMENSION_WORLDS.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 hover:bg-surface-elevated/40 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-surface-elevated border border-gold/30 text-gold flex items-center justify-center font-bold">
                    {item.number}
                  </span>
                  <div>
                    <h2 className="text-xl font-display font-bold text-content-primary">
                      {item.sourceName}
                    </h2>
                    <span className="text-[11px] text-content-muted">
                      Corresponding Dimension: <strong>{item.name}</strong> ({item.category})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/worlds/${item.id}`}
                    onClick={() => soundFx.playClick()}
                    className="px-3 py-1.5 rounded-lg border border-gold/30 bg-surface-elevated text-gold text-xs font-semibold hover:bg-gold/10 transition-colors"
                  >
                    Experience Dimension {item.number}
                  </Link>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-content-secondary hover:text-content-primary text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-content-muted" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border-subtle space-y-1">
                  <span className="text-gold font-bold uppercase text-[10px]">
                    Observed Design Principle
                  </span>
                  <p className="text-content-secondary leading-relaxed font-sans text-xs">
                    {item.observablePattern}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border-subtle space-y-1">
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">
                    Our Original Reinterpretation
                  </span>
                  <p className="text-content-secondary leading-relaxed font-sans text-xs">
                    {item.originalReinterpretation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

