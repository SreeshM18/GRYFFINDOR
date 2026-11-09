import React, { useState } from 'react';
import { useDesignSystem, DESIGN_PRESETS, SignatureDesign } from '../context/DesignSystemContext';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { MarijanaGardenWidget } from '../components/widgets/MarijanaGardenWidget';
import { AritroTelemetryWidget } from '../components/widgets/AritroTelemetryWidget';
import { FudaliMomentumWidget } from '../components/widgets/FudaliMomentumWidget';
import { EyeballsBroadcastWidget } from '../components/widgets/EyeballsBroadcastWidget';
import { UniversalColorLabWidget } from '../components/widgets/UniversalColorLabWidget';
import { EmilCraftEngineWidget } from '../components/widgets/EmilCraftEngineWidget';
import {
  Palette,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  FolderOpen,
  Code2,
  Tv,
  Compass,
  Cpu,
  MonitorCheck,
  Sliders,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DesignStudioPage: React.FC = () => {
  const { currentDesign, setDesign, preset } = useDesignSystem();
  const [activeTab, setActiveTab] = useState<'all' | 'emil-craft' | 'color-lab' | 'marijana' | 'aritro' | 'fudali' | 'eyeballs'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      {/* =========================================================================
          HERO & ACTIVE ENGINE STATUS
      ========================================================================= */}
      <div className="relative rounded-3xl border border-border-subtle bg-gradient-to-br from-surface-card via-surface-card to-surface-elevated/70 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow Accent */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: preset.accentColor }}
        />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-border-subtle bg-surface-elevated">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: preset.accentColor }}
            />
            <span className="text-content-secondary">ACTIVE DESIGN ENGINE:</span>
            <span className="text-content-primary font-bold uppercase">{preset.name}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight leading-tight">
            Universal Website Design Engine & Studio
          </h1>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed font-serif italic">
            "Switch to any website design instantly. Extracted directly from the 19 reference portfolio mirrors
            in your <code className="font-mono text-xs text-content-primary bg-surface-elevated px-2 py-1 rounded">Use this now</code> folder,
            synthesizing their real code, interactive widgets, color physics, and typography."
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-content-muted border-t border-border-subtle">
            <div>
              <span className="text-content-secondary block">Mirrored Folders</span>
              <span className="text-content-primary font-bold text-sm">19 Archives</span>
            </div>
            <div>
              <span className="text-content-secondary block">Active Theme</span>
              <span className="text-content-primary font-bold text-sm">{preset.fontBadge}</span>
            </div>
            <div>
              <span className="text-content-secondary block">Source Reference</span>
              <span className="text-content-primary font-bold text-sm">{preset.sourceRef}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE 8 SIGNATURE DESIGN SELECTOR TILES
      ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-content-primary">
              Select Any Website Design
            </h2>
            <p className="text-xs text-content-muted mt-1">
              Click any tile below to apply its layout tokens, color spectrum, and typography across the entire website.
            </p>
          </div>
          <span className="text-xs font-mono text-content-muted">
            8 Ready Systems
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESIGN_PRESETS.map((p) => {
            const isSelected = p.id === currentDesign;
            return (
              <div
                key={p.id}
                onClick={() => setDesign(p.id)}
                className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 select-none ${
                  isSelected
                    ? 'bg-surface-elevated border-border-strong shadow-xl scale-[1.02]'
                    : 'bg-surface-card/70 border-border-subtle hover:border-border-strong hover:bg-surface-elevated/50'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${p.accentColor}25` : undefined,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shadow"
                      style={{ backgroundColor: p.accentColor }}
                    />
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-card border border-border-subtle text-content-muted">
                      Folder {p.folderNum}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-content-primary group-hover:text-content-primary">
                      {p.name}
                    </h3>
                    <p className="text-[11px] font-mono text-content-muted mt-0.5">
                      {p.sourceRef}
                    </p>
                  </div>

                  <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-content-muted truncate max-w-[130px]">
                    {p.fontBadge}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-content-muted group-hover:text-content-primary transition-colors text-[11px]">
                      Apply →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE SIGNATURE COMPONENT SUITE
      ========================================================================= */}
      <div className="space-y-8 pt-8 border-t border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-2xl font-display font-bold text-content-primary">
                Live Interactive Reference Widgets
              </h2>
            </div>
            <p className="text-xs text-content-muted mt-1">
              Real interactive widgets synthesized directly from the HTML/CSS/JS source files of the reference websites.
            </p>
          </div>

          {/* Widget Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-surface-card border border-border-subtle text-xs font-mono">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'emil-craft', label: '✦ Emil Kowalski Craft' },
              { id: 'color-lab', label: 'Universal Color Lab' },
              { id: 'marijana', label: 'Marijana Garden' },
              { id: 'aritro', label: 'Aritro Telemetry' },
              { id: 'fudali', label: 'Fudali Slider' },
              { id: 'eyeballs', label: 'Eyeballs Broadcast' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-surface-elevated text-content-primary font-bold shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 0. EMIL KOWALSKI CRAFT & MOTION STANDARDS (github.com/emilkowalski/skills.git) */}
        {(activeTab === 'all' || activeTab === 'emil-craft') && (
          <div className="space-y-3">
            <EmilCraftEngineWidget />
          </div>
        )}

        {/* 1. UNIVERSAL COLOR & SHADE LABORATORY (Real-Time Website Customizer) */}
        {(activeTab === 'all' || activeTab === 'color-lab') && (
          <div className="space-y-3">
            <UniversalColorLabWidget />
          </div>
        )}

        {/* 1. Marijana Pavlinić Digital Garden */}
        {(activeTab === 'all' || activeTab === 'marijana') && (
          <div className="space-y-3">
            <MarijanaGardenWidget />
          </div>
        )}

        {/* 2. Aritro Paul Minimal Telemetry */}
        {(activeTab === 'all' || activeTab === 'aritro') && (
          <div className="space-y-3">
            <AritroTelemetryWidget />
          </div>
        )}

        {/* 3. Fudali Studio Momentum Before/After Slider */}
        {(activeTab === 'all' || activeTab === 'fudali') && (
          <div className="space-y-3">
            <FudaliMomentumWidget />
          </div>
        )}

        {/* 4. Eyeballs Broadcast Media Library */}
        {(activeTab === 'all' || activeTab === 'eyeballs') && (
          <div className="space-y-3">
            <EyeballsBroadcastWidget />
          </div>
        )}
      </div>

      {/* =========================================================================
          CROSS-DIMENSIONAL ATRIUM PORTAL BANNER
      ========================================================================= */}
      <div className="p-8 rounded-3xl border border-border-subtle bg-gradient-to-r from-surface-card via-surface-elevated to-surface-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="font-mono text-xs text-gold uppercase tracking-widest">
            ✦ Dimensional Navigation
          </span>
          <h3 className="text-2xl font-display font-bold text-content-primary">
            Explore All 17 Navigable Worlds
          </h3>
          <p className="text-xs text-content-muted leading-relaxed">
            Want to dive deeper into every individual reference universe? Visit the Celestial Atrium
            or the 17 Worlds Dimension Atlas to explore their full dedicated environments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/atrium"
            onClick={() => soundFx.playClick()}
            className="px-5 py-2.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold font-mono text-xs font-semibold border border-gold/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Celestial Atrium
          </Link>
          <Link
            to="/worlds"
            onClick={() => soundFx.playClick()}
            className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary font-mono text-xs font-semibold border border-border-subtle transition-all flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5" />
            17 Worlds Atlas
          </Link>
        </div>
      </div>
    </div>
  );
};

