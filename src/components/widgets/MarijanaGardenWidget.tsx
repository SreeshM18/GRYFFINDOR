import React, { useState, useMemo } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { Eye, Camera, Palette, Sparkles, RefreshCw, Terminal, Check, Copy, Pipette, Sliders } from 'lucide-react';

// Mathematical Color Helpers & Honeycomb generator
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) cleaned = cleaned.split('').map((c) => c + c).join('');
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 102, g: 204, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const f = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = f(p, q, h + 1 / 3);
    g = f(p, q, h);
    b = f(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function generateMiniHoneycomb() {
  const nodes: { hex: string; x: number; y: number }[] = [];
  const radius = 3;
  const size = 11;
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = size * ((3 / 2) * r);
      const dist = Math.sqrt(q * q + r * r + q * r);
      if (dist === 0) {
        nodes.push({ hex: '#FFFFFF', x, y });
      } else {
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        const normAngle = (angle + 360) % 360;
        const sat = Math.min(100, Math.round((dist / radius) * 100));
        const light = Math.max(30, Math.min(75, Math.round(85 - (dist / radius) * 40)));
        const rgb = hslToRgb(normAngle, sat, light);
        nodes.push({ hex: rgbToHex(rgb.r, rgb.g, rgb.b), x, y });
      }
    }
  }
  return nodes;
}

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
  // 1. Honeycomb Color & Shade State (Default from screenshot #66ccff)
  const [currentHex, setCurrentHex] = useState<string>(() => {
    return localStorage.getItem('sm_custom_accent_gold') || '#66ccff';
  });
  const [inputVal, setInputVal] = useState<string>(currentHex);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const rgb = hexToRgb(currentHex);
  const miniHoneycomb = useMemo(() => generateMiniHoneycomb(), []);

  // 21-Step Tint & Shade Ladder (100% to 0% in 5% increments)
  const shadeLadder = useMemo(() => {
    const steps = [];
    for (let pct = 100; pct > 70; pct -= 5) {
      const factor = (pct - 70) / 30;
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      steps.push({ pct, hex: rgbToHex(r, g, b) });
    }
    steps.push({ pct: 70, hex: currentHex });
    for (let pct = 65; pct >= 0; pct -= 5) {
      const factor = pct / 70;
      const r = Math.round(rgb.r * factor);
      const g = Math.round(rgb.g * factor);
      const b = Math.round(rgb.b * factor);
      steps.push({ pct, hex: rgbToHex(r, g, b) });
    }
    return steps;
  }, [rgb, currentHex]);

  // Relative luminance for contrast
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  const isDark = luminance < 0.5;

  const handleApplyAccent = (hexToApply: string = currentHex) => {
    soundFx.playChime();
    document.documentElement.style.setProperty('--accent-gold', hexToApply);
    document.documentElement.style.setProperty('--theme-accent', hexToApply);
    localStorage.setItem('sm_custom_accent_gold', hexToApply);
    setAppliedNotice(`Applied ${hexToApply} as Website Accent`);
    setTimeout(() => setAppliedNotice(null), 2000);
  };

  const handleApplyCanvas = (hexToApply: string = currentHex) => {
    soundFx.playChime();
    document.documentElement.style.setProperty('--bg-canvas', hexToApply);
    document.documentElement.style.setProperty('--theme-canvas', hexToApply);
    localStorage.setItem('sm_custom_bg_canvas', hexToApply);
    setAppliedNotice(`Applied ${hexToApply} as Canvas`);
    setTimeout(() => setAppliedNotice(null), 2000);
  };

  const handleApplySurfaces = (hexToApply: string = currentHex) => {
    soundFx.playChime();
    document.documentElement.style.setProperty('--bg-surface-card', hexToApply);
    document.documentElement.style.setProperty('--theme-surface', hexToApply);
    localStorage.setItem('sm_custom_surface_card', hexToApply);
    setAppliedNotice(`Applied ${hexToApply} to Surfaces`);
    setTimeout(() => setAppliedNotice(null), 2000);
  };

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
            COMPONENT A: HONEYCOMB WHEEL & 21-SHADE LAB (Adapted to Gryffindor Theme)
        ========================================================= */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-elevated/70 space-y-4 shadow-xl flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Ambient Backlight Glow in Selected Shade */}
          <div
            className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[80px] opacity-25 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: currentHex }}
          />

          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-content-muted">
            <span className="flex items-center gap-1.5 text-content-primary font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Honeycomb & 21-Shade Studio
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              Live Modulation
            </span>
          </div>

          {/* Applied Notice Banner */}
          {appliedNotice && (
            <div className="relative z-10 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
              <Check className="w-3 h-3" />
              <span>{appliedNotice}</span>
            </div>
          )}

          {/* SVG Honeycomb Mini Wheel + Color Hero Card (Dark Glass with Ambient Glow) */}
          <div className="relative z-10 rounded-2xl p-4 border border-border-subtle bg-surface-card/90 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            {/* Ambient Radial Mesh Glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${currentHex} 0%, transparent 75%)`,
              }}
            />

            {/* Active Hex Telemetry Header */}
            <div className="text-center z-10 mb-3 flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: currentHex }}
                />
                <span className="text-xl font-display font-extrabold tracking-tight text-content-primary">
                  {currentHex.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-mono text-content-muted">
                RGB({rgb.r}, {rgb.g}, {rgb.b}) • HSL({rgbToHsl(rgb.r, rgb.g, rgb.b)[0]}°, {rgbToHsl(rgb.r, rgb.g, rgb.b)[1]}%, {rgbToHsl(rgb.r, rgb.g, rgb.b)[2]}%)
              </span>
            </div>

            {/* SVG Honeycomb Color Wheel */}
            <svg viewBox="-55 -55 110 110" className="w-36 h-36 drop-shadow-md cursor-pointer z-10 overflow-visible">
              {miniHoneycomb.map((node, i) => {
                const isSelected = node.hex.toLowerCase() === currentHex.toLowerCase();
                return (
                  <polygon
                    key={i}
                    points="0,-9.5 8.2,-4.7 8.2,4.7 0,9.5 -8.2,4.7 -8.2,-4.7"
                    transform={`translate(${node.x}, ${node.y})`}
                    fill={node.hex}
                    stroke={isSelected ? '#D3A625' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={isSelected ? 2.5 : 0.6}
                    className="transition-transform hover:scale-125 cursor-pointer"
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentHex(node.hex);
                      setInputVal(node.hex);
                    }}
                  >
                    <title>{node.hex}</title>
                  </polygon>
                );
              })}
            </svg>
          </div>

          {/* 21 Tints & Shades Ladder (100% to 0%) */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>21-STEP TINT & SHADE LADDER</span>
              <span>100% → 0%</span>
            </div>
            <div className="grid grid-cols-7 gap-1 p-2 rounded-xl bg-surface-card border border-border-subtle max-h-24 overflow-y-auto no-scrollbar">
              {shadeLadder.map((step) => {
                const isSelected = step.hex.toLowerCase() === currentHex.toLowerCase();
                const stepRgb = hexToRgb(step.hex);
                const stepLum = (0.2126 * stepRgb.r + 0.7152 * stepRgb.g + 0.0722 * stepRgb.b) / 255;
                const isLight = stepLum >= 0.5;

                return (
                  <button
                    key={step.pct}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentHex(step.hex);
                      setInputVal(step.hex);
                    }}
                    className={`h-6 rounded-md text-[9px] font-mono flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-gold scale-105 shadow font-bold z-10' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: step.hex,
                      color: isLight ? '#000000' : '#FFFFFF',
                    }}
                    title={`${step.hex} (${step.pct}%) - Click to select & shade`}
                  >
                    {step.pct}%
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Apply Action Row */}
          <div className="relative z-10 grid grid-cols-3 gap-1.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleApplyAccent()}
              className="py-2 px-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 font-bold transition-all active:scale-95 text-center shadow-sm"
              title="Apply as primary website accent"
            >
              Accent
            </button>
            <button
              type="button"
              onClick={() => handleApplyCanvas()}
              className="py-2 px-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-content-primary border border-border-subtle transition-all active:scale-95 text-center shadow-sm"
              title="Apply as canvas background"
            >
              Canvas
            </button>
            <button
              type="button"
              onClick={() => handleApplySurfaces()}
              className="py-2 px-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-content-primary border border-border-subtle transition-all active:scale-95 text-center shadow-sm"
              title="Apply to cards & surfaces"
            >
              Surfaces
            </button>
          </div>

          {/* Input Box & Full Lab Button */}
          <div className="relative z-10 flex items-center gap-1.5 pt-1 border-t border-border-subtle">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="#66ccff"
              className="flex-1 bg-surface-card border border-border-subtle rounded-xl px-3 py-1.5 text-xs font-mono text-content-primary focus:outline-none focus:border-gold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = inputVal.trim();
                  if (val) {
                    soundFx.playChime();
                    const hex = val.startsWith('#') ? val : `#${val}`;
                    setCurrentHex(hex);
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const val = inputVal.trim();
                if (val) {
                  soundFx.playChime();
                  const hex = val.startsWith('#') ? val : `#${val}`;
                  setCurrentHex(hex);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gold hover:bg-gold-soft text-black text-xs font-mono font-bold transition-colors active:scale-95"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('universal-color-lab');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-gold border border-gold/30 text-xs font-mono font-semibold whitespace-nowrap transition-colors"
            >
              Full Lab ↑
            </button>
          </div>
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

