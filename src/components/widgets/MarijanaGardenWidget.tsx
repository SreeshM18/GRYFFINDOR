import React, { useState } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { Eye, Camera, Palette, Sparkles, RefreshCw, Terminal, Check } from 'lucide-react';

interface Swatch {
  id: string;
  name: string;
  pantone: string;
  hex: string;
  rgb: string;
}

const PANTONE_SWATCHES: Swatch[] = [
  { id: 'scarlet', name: 'Flame Scarlet', pantone: '18-1662 TCX', hex: '#E11D48', rgb: '225, 29, 72' },
  { id: 'yellow', name: 'Illuminating', pantone: '13-0647 TCX', hex: '#F59E0B', rgb: '245, 158, 11' },
  { id: 'lime', name: 'Sharp Lime', pantone: '14-0452 TCX', hex: '#84CC16', rgb: '132, 204, 22' },
  { id: 'cyan', name: 'Biscay Green', pantone: '15-5718 TCX', hex: '#06B6D4', rgb: '6, 182, 212' },
  { id: 'lavender', name: 'Very Peri', pantone: '17-3938 TCX', hex: '#8B5CF6', rgb: '139, 92, 246' },
  { id: 'charcoal', name: 'Jet Black', pantone: '19-0303 TCX', hex: '#374151', rgb: '55, 65, 81' },
];

const CAMERA_ROLL_PHOTOS = [
  {
    title: 'Workspace Desk Setup • Late Night Focus',
    location: 'Bengaluru R&D Lab',
    note: 'Dual Pro Display XDRs running Antigravity Neural OS build #842.',
    aspect: '4/3',
    gradient: 'from-burgundy/40 via-surface-card to-canvas',
  },
  {
    title: 'Architecture Blueprint Review',
    location: 'Common Room Chamber',
    note: 'Mapping 17 dimensions and cross-platform synchronization protocols.',
    aspect: '16/9',
    gradient: 'from-emerald-950/40 via-surface-card to-canvas',
  },
  {
    title: 'Design Token Convergence Session',
    location: 'Studio Atelier',
    note: 'Testing micro-interactions, spring damping, and audio synthesis feedback.',
    aspect: '3/4',
    gradient: 'from-amber-950/40 via-surface-card to-canvas',
  },
  {
    title: 'Hardware Telemetry Benchmark',
    location: 'Apple Silicon Cluster',
    note: '60 FPS sustained GPU canvas rendering under intense particle load.',
    aspect: '16/9',
    gradient: 'from-cyan-950/40 via-surface-card to-canvas',
  },
];

export const MarijanaGardenWidget: React.FC = () => {
  // 1. Swatch State
  const [activeSwatch, setActiveSwatch] = useState<Swatch>(PANTONE_SWATCHES[0]);

  // 2. Sneak Peek State (Blur steps: 16px -> 12px -> 8px -> 4px -> 0px)
  const blurSteps = [16, 12, 8, 4, 0];
  const [sneakPeekStep, setSneakPeekStep] = useState<number>(0);

  // 3. Camera Roll State
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);

  // 4. System Monitor counter
  const [clickCount, setClickCount] = useState<number>(14);

  const handleAdvanceSneakPeek = () => {
    soundFx.playClick();
    setSneakPeekStep((prev) => (prev + 1) % blurSteps.length);
    setClickCount((c) => c + 1);
  };

  const currentBlur = blurSteps[sneakPeekStep];

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-border-subtle bg-surface-card/60 backdrop-blur-xl">
      {/* Header Attribution / Soul of marijanapav.com */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Palette className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-content-primary">
                Marijana Pavlinić — Digital Garden Suite
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Folder 02 Mirror
              </span>
            </div>
            <p className="text-xs text-content-muted">
              Interactive Pantone RGB Swatches, Click-to-Unblur Sneak-Peek, and Segmented Camera Roll
            </p>
          </div>
        </div>

        {/* Live System Monitor Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-xs font-mono text-content-secondary">
          <Terminal className="w-3.5 h-3.5 text-pink-400" />
          <span>Konami Ready</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-content-muted">Clicks: {clickCount}</span>
        </div>
      </div>

      {/* Grid: 3 Live Interactive Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =========================================================
            COMPONENT A: PANTONE COLOR SWATCH & CANVAS DOT MATRIX
        ========================================================= */}
        <div className="p-5 rounded-xl border border-border-subtle bg-surface-elevated/70 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1.5 text-content-primary font-medium">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Pantone Matrix
            </span>
            <span>{activeSwatch.pantone}</span>
          </div>

          {/* Interactive Dot Grid that reacts to selected color */}
          <div
            className="h-32 rounded-lg border border-border-subtle p-3 flex flex-col justify-between transition-colors duration-500 relative overflow-hidden"
            style={{
              backgroundColor: `${activeSwatch.hex}15`,
              borderColor: `${activeSwatch.hex}40`,
            }}
          >
            {/* SVG Dot Matrix */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${activeSwatch.hex} 1.5px, transparent 1.5px)`,
                backgroundSize: '12px 12px',
              }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-card/80 text-content-primary border border-border-subtle">
                {activeSwatch.name}
              </span>
              <span className="text-[10px] font-mono text-content-secondary">
                RGB({activeSwatch.rgb})
              </span>
            </div>
            <div className="relative z-10 text-right font-mono text-xs font-bold tracking-wider" style={{ color: activeSwatch.hex }}>
              {activeSwatch.hex}
            </div>
          </div>

          {/* 6 Clickable Swatches */}
          <div className="grid grid-cols-6 gap-2 pt-1">
            {PANTONE_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveSwatch(swatch);
                  setClickCount((c) => c + 1);
                }}
                className={`group relative h-9 rounded-lg border transition-all flex items-center justify-center ${
                  activeSwatch.id === swatch.id
                    ? 'scale-110 border-white shadow-lg'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.hex }}
                title={`${swatch.name} (${swatch.pantone})`}
              >
                {activeSwatch.id === swatch.id && (
                  <Check className="w-4 h-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-content-muted italic">
            Click any swatch to modulate the generative dot field.
          </p>
        </div>

        {/* =========================================================
            COMPONENT B: SNEAK PEEK CLICK-TO-UNBLUR PROGRESS CARD
        ========================================================= */}
        <div className="p-5 rounded-xl border border-border-subtle bg-surface-elevated/70 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1.5 text-content-primary font-medium">
              <Eye className="w-3.5 h-3.5 text-pink-400" />
              Sneak Peek
            </span>
            <span>
              {sneakPeekStep === blurSteps.length - 1 ? '100% Unveiled' : `${sneakPeekStep * 25}% Unblurred`}
            </span>
          </div>

          {/* Blur Card */}
          <div
            onClick={handleAdvanceSneakPeek}
            className="group cursor-pointer relative h-32 rounded-lg border border-border-subtle overflow-hidden p-3 flex flex-col justify-end select-none"
          >
            {/* Background Content with Dynamic Blur */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-burgundy via-indigo-900 to-amber-700 transition-all duration-300 flex items-center justify-center p-4 text-center"
              style={{ filter: `blur(${currentBlur}px)` }}
            >
              <div className="text-white space-y-1">
                <p className="font-display font-bold text-sm">Aethel Intelligence v3</p>
                <p className="text-[11px] opacity-80">Autonomous Multi-Agent Workflow Core</p>
              </div>
            </div>

            {/* Tap Overlay when blurred */}
            {currentBlur > 0 && (
              <div className="relative z-10 flex items-center justify-between px-2.5 py-1.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
                <span>Click to reveal ({currentBlur}px)</span>
                <span className="font-mono text-[10px] text-pink-400">Step {sneakPeekStep + 1}/5</span>
              </div>
            )}
            {currentBlur === 0 && (
              <div className="relative z-10 flex items-center justify-between px-2.5 py-1.5 rounded bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span>✓ Fully Focused</span>
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </div>
            )}
          </div>

          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {blurSteps.map((b, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx <= sneakPeekStep ? 'bg-pink-400' : 'bg-border-strong'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-content-muted italic">
            Adapted from Marijana's signature click-to-unblur case study card.
          </p>
        </div>

        {/* =========================================================
            COMPONENT C: SEGMENTED CAMERA ROLL CAROUSEL
        ========================================================= */}
        <div className="p-5 rounded-xl border border-border-subtle bg-surface-elevated/70 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1.5 text-content-primary font-medium">
              <Camera className="w-3.5 h-3.5 text-pink-400" />
              Camera Roll
            </span>
            <span>
              photo {currentPhotoIdx + 1} of {CAMERA_ROLL_PHOTOS.length}
            </span>
          </div>

          {/* Photo Display Card */}
          <div
            onClick={() => {
              soundFx.playChime();
              setCurrentPhotoIdx((prev) => (prev + 1) % CAMERA_ROLL_PHOTOS.length);
              setClickCount((c) => c + 1);
            }}
            className="cursor-pointer group relative h-32 rounded-lg border border-border-subtle overflow-hidden p-3 flex flex-col justify-between select-none"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CAMERA_ROLL_PHOTOS[currentPhotoIdx].gradient} group-hover:scale-105 transition-transform duration-500`}
            />
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/80">
              <span className="bg-black/50 px-2 py-0.5 rounded backdrop-blur">
                {CAMERA_ROLL_PHOTOS[currentPhotoIdx].location}
              </span>
              <span className="text-white/60">{CAMERA_ROLL_PHOTOS[currentPhotoIdx].aspect}</span>
            </div>
            <div className="relative z-10 space-y-0.5">
              <p className="font-display font-bold text-xs text-white">
                {CAMERA_ROLL_PHOTOS[currentPhotoIdx].title}
              </p>
              <p className="text-[10px] text-white/70 line-clamp-1">
                {CAMERA_ROLL_PHOTOS[currentPhotoIdx].note}
              </p>
            </div>
          </div>

          {/* Segmented Progress Bars (Direct replica of Marijana's SVG segment bars) */}
          <div className="flex items-center gap-1">
            {CAMERA_ROLL_PHOTOS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentPhotoIdx(idx);
                  setClickCount((c) => c + 1);
                }}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentPhotoIdx
                    ? 'bg-pink-400 scale-y-125'
                    : 'bg-border-strong hover:bg-content-muted'
                }`}
                title={`Photo ${idx + 1}`}
              />
            ))}
          </div>
          <p className="text-[11px] text-content-muted italic">
            Click to cycle through the physical studio archive photos.
          </p>
        </div>
      </div>
    </div>
  );
};

