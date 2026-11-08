import React, { useState, useRef } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { Sliders, Sparkles, TrendingUp, CheckCircle2, MoveHorizontal } from 'lucide-react';

export const FudaliMomentumWidget: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handlePointerDown = () => {
    setIsDragging(true);
    soundFx.playClick();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-border-subtle bg-surface-card/60 backdrop-blur-xl">
      {/* Header Attribution / Soul of fudali.studio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-content-primary">
                Fudali Studio — Evolution & Momentum Slider
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Folder 16 Mirror
              </span>
            </div>
            <p className="text-xs text-content-muted">
              Interactive Before/After Architecture Comparison Slider and Kinetic Velocity Counters
            </p>
          </div>
        </div>

        {/* Live Momentum Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono text-blue-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
            Momentum: +94.2%
          </span>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE BEFORE / AFTER SLIDER
      ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted">
          <span className="text-content-secondary font-medium">
            ← Before (Wireframe & Schema)
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <MoveHorizontal className="w-3.5 h-3.5 animate-pulse" />
            Drag handle ({Math.round(sliderPos)}%)
          </span>
          <span className="text-blue-400 font-medium">
            After (Production Application) →
          </span>
        </div>

        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          className="relative h-64 sm:h-80 rounded-xl border border-border-subtle overflow-hidden select-none cursor-ew-resize touch-none shadow-inner"
        >
          {/* AFTER: Full Production Render (Underneath) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-surface-card to-canvas p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-mono text-[11px] border border-blue-500/30">
                ● High-Fidelity Production OS
              </span>
              <span className="font-mono text-xs text-content-muted">2,141 Modules • Zero Latency</span>
            </div>
            <div className="space-y-3 max-w-md">
              <h4 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                GRYFFINDOR — The Common Room
              </h4>
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                Dual Workstation Synchronized Platform featuring Live TradingView Financial Charts, 
                Attendance Biometrics, Focus Mode, and 17 Navigable Dimensional Portfolios.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono">React 18</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">TypeScript</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono">Supabase RLS</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Status: Online & Synced</span>
              <span>120Hz Hardware Accelerated</span>
            </div>
          </div>

          {/* BEFORE: Wireframe / Architectural Schema (Clipped layer) */}
          <div
            className="absolute inset-0 overflow-hidden bg-surface-elevated p-6 flex flex-col justify-between border-r border-blue-400/80"
            style={{ width: `${sliderPos}%` }}
          >
            {/* Blueprint Grid Overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 flex items-center justify-between min-w-[300px]">
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-700">
                ◌ Raw Wireframe & Database Spec
              </span>
              <span className="font-mono text-xs text-zinc-500">Schema Draft #01</span>
            </div>

            <div className="relative z-10 space-y-3 min-w-[320px]">
              <h4 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-400 tracking-tight">
                [SYSTEM_SPEC_v0.9]
              </h4>
              <div className="space-y-1.5 font-mono text-xs text-zinc-400">
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">├──</span> core_profiles [sreesh_m, mrithula_m]
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">├──</span> rls_security [attendance, tasks, finances]
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-blue-400">└──</span> websocket_cluster [device_sync: true]
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-500 min-w-[300px]">
              <span>Wireframe State</span>
              <span>Normalized 3NF</span>
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] cursor-ew-resize flex items-center justify-center -translate-x-1/2 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Kinetic Stat Counters in Swiss Grid (Fudali Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {[
          { label: 'Built Components', value: '73+', note: 'Tailwind + Lucide' },
          { label: 'TypeScript Coverage', value: '100%', note: '0 compiler warnings' },
          { label: 'Sync Latency', value: '11.8ms', note: 'Cross-platform pulse' },
          { label: 'Render Pipeline', value: '60 FPS', note: 'Hardware accelerated' },
        ].map((stat, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-border-subtle bg-surface-elevated/60 space-y-1">
            <span className="text-[11px] font-mono text-content-muted block">{stat.label}</span>
            <span className="text-xl font-display font-bold text-content-primary">{stat.value}</span>
            <span className="text-[10px] font-mono text-blue-400/90 block">{stat.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

