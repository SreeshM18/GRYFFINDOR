import React, { useState, useEffect, useMemo } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { useSuperAdaptiveTheme } from '../../context/SuperAdaptiveThemeContext';
import {
  Pipette,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Palette,
  Sliders,
  ShieldCheck,
  Sun,
  Moon,
  ExternalLink,
  Crosshair,
  Layers,
} from 'lucide-react';

// Math helpers for Color Physics & WCAG Compliance
interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  if (cleaned.length !== 6 && cleaned.length !== 8) return null;

  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> (cleaned.length === 8 ? 24 : 16)) & 255,
    g: (num >> (cleaned.length === 8 ? 16 : 8)) & 255,
    b: (num >> (cleaned.length === 8 ? 8 : 0)) & 255,
    a: cleaned.length === 8 ? ((num & 255) / 255) : 1,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Relative Luminance for WCAG 2.1
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(1));
}

// Generate Hexagonal honeycomb color nodes across concentric rings (61 hexagons)
interface HexNode {
  hex: string;
  x: number;
  y: number;
  q: number;
  r: number;
}

function generateHoneycombNodes(): HexNode[] {
  const nodes: HexNode[] = [];
  const radius = 4; // 4 rings of hexagons = 61 cells
  const size = 16; // hex side
  
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = size * ((3 / 2) * r);

      const dist = Math.sqrt(q * q + r * r + q * r);
      if (dist === 0) {
        nodes.push({ hex: '#FFFFFF', x, y, q, r });
      } else {
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        const normalizedAngle = (angle + 360) % 360;
        const sat = Math.min(100, Math.round((dist / radius) * 100));
        const light = Math.max(25, Math.min(75, Math.round(90 - (dist / radius) * 45)));
        const rgb = hslToRgb(normalizedAngle, sat, light);
        nodes.push({ hex: rgbToHex(rgb.r, rgb.g, rgb.b), x, y, q, r });
      }
    }
  }
  return nodes;
}

export const UniversalColorLabWidget: React.FC = () => {
  const {
    setGlobalToken,
    setComponentOverride,
    designModeActive,
    toggleDesignMode,
    resetToDefaults,
  } = useSuperAdaptiveTheme();

  // Current active color (starts at reference #66ccff from screenshot)
  const [currentHex, setCurrentHex] = useState<string>(() => {
    return localStorage.getItem('sm_custom_accent_gold') || '#66ccff';
  });
  const [inputVal, setInputVal] = useState<string>('#66ccff');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [appliedState, setAppliedState] = useState<string | null>(null);
  const [alphaVal, setAlphaVal] = useState<number>(100);
  const [showAlpha, setShowAlpha] = useState<boolean>(false);

  // Parse RGB & HSL
  const rgb = useMemo(() => hexToRgb(currentHex) || { r: 102, g: 204, b: 255 }, [currentHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  // Contrast ratios
  const blackContrast = useMemo(() => getContrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb]);
  const whiteContrast = useMemo(() => getContrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb]);

  // Generate 21-step Tint & Shade Ladder (100% white to 0% black)
  const tintShadeLadder = useMemo(() => {
    const steps = [];
    // Tints: blend with pure white (100% to 75%)
    for (let pct = 100; pct > 70; pct -= 5) {
      const factor = (pct - 70) / 30; // 1 at 100%, 0 at 70%
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
    }

    // Exact Base color (70% marker)
    steps.push({ pct: 70, hex: currentHex, isBase: true });

    // Shades: blend with pure black (65% down to 0%)
    for (let pct = 65; pct >= 0; pct -= 5) {
      const factor = pct / 70; // 1 at 70%, 0 at 0%
      const r = Math.round(rgb.r * factor);
      const g = Math.round(rgb.g * factor);
      const b = Math.round(rgb.b * factor);
      steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
    }

    return steps;
  }, [rgb, currentHex]);

  // Honeycomb nodes memoized
  const honeycombNodes = useMemo(() => generateHoneycombNodes(), []);

  // Update handlers
  const handleHexChange = (newHex: string) => {
    soundFx.playClick();
    setCurrentHex(newHex);
    setInputVal(newHex);
  };

  const handleRgbSlider = (channel: 'r' | 'g' | 'b', val: number) => {
    const newRgb = { ...rgb, [channel]: val };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentHex(hex);
    setInputVal(hex);
  };

  const handleHslSlider = (channel: 'h' | 's' | 'l', val: number) => {
    const newHsl = { ...hsl, [channel]: val };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentHex(hex);
    setInputVal(hex);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let val = inputVal.trim();
    if (!val.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(val)) {
      val = '#' + val;
    }
    // Check if valid hex
    if (hexToRgb(val)) {
      soundFx.playChime();
      setCurrentHex(val);
    } else {
      // Try named color via dummy canvas
      try {
        const ctx = document.createElement('canvas').getContext('2d');
        if (ctx) {
          ctx.fillStyle = val;
          const computed = ctx.fillStyle;
          if (computed.startsWith('#')) {
            soundFx.playChime();
            setCurrentHex(computed);
            setInputVal(computed);
          }
        }
      } catch {
        // Invalid color name
      }
    }
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        soundFx.playClick();
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          soundFx.playChime();
          setCurrentHex(result.sRGBHex);
          setInputVal(result.sRGBHex);
        }
      } catch {
        // User cancelled picker
      }
    } else {
      alert('The native EyeDropper API is supported in Google Chrome, Edge, and Opera desktop browsers.');
    }
  };

  const copyToClipboard = (text: string) => {
    soundFx.playClick();
    void navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // =========================================================================
  // LIVE WEBSITE-WIDE COLOR MODULATION & LOCALSTORAGE PERSISTENCE
  // =========================================================================
  const applyAsAccent = () => {
    soundFx.playChime();
    setGlobalToken('accent', currentHex);
    setGlobalToken('buttonBg', currentHex);
    document.documentElement.style.setProperty('--accent-gold', currentHex);
    document.documentElement.style.setProperty('--accent-gold-soft', tintShadeLadder[4]?.hex || currentHex);
    document.documentElement.style.setProperty('--accent-burgundy', tintShadeLadder[12]?.hex || currentHex);
    localStorage.setItem('sm_custom_accent_gold', currentHex);
    setAppliedState('accent');
    setTimeout(() => setAppliedState(null), 2500);
  };

  const applyAsBackground = () => {
    soundFx.playChime();
    setGlobalToken('canvas', currentHex);
    document.documentElement.style.setProperty('--bg-canvas', currentHex);
    localStorage.setItem('sm_custom_bg_canvas', currentHex);
    
    // Auto-adjust text contrast if background is very light
    if (whiteContrast < 2.5 && blackContrast > 6) {
      setGlobalToken('text', '#0B0B0C');
      document.documentElement.style.setProperty('--text-primary', '#0B0B0C');
      document.documentElement.style.setProperty('--text-secondary', '#242428');
      document.documentElement.style.setProperty('--text-muted', '#4A4A52');
      document.documentElement.style.setProperty('--bg-surface-card', '#FFFFFF');
      document.documentElement.style.setProperty('--bg-surface-elevated', tintShadeLadder[2]?.hex || '#F0F4F8');
    }
    setAppliedState('bg');
    setTimeout(() => setAppliedState(null), 2500);
  };

  const applyAsSurfaces = () => {
    soundFx.playChime();
    const cardColor = tintShadeLadder[16]?.hex || currentHex;
    const elevatedColor = tintShadeLadder[14]?.hex || currentHex;
    setGlobalToken('surface', cardColor);
    setGlobalToken('cardBg', cardColor);
    document.documentElement.style.setProperty('--bg-surface-card', cardColor);
    document.documentElement.style.setProperty('--bg-surface-elevated', elevatedColor);
    localStorage.setItem('sm_custom_surface_card', cardColor);
    localStorage.setItem('sm_custom_surface_elevated', elevatedColor);
    setAppliedState('surface');
    setTimeout(() => setAppliedState(null), 2500);
  };

  const applyToNavbar = () => {
    soundFx.playChime();
    setComponentOverride('nav', { bg: currentHex });
    setAppliedState('nav');
    setTimeout(() => setAppliedState(null), 2500);
  };

  const applyToButtons = () => {
    soundFx.playChime();
    setComponentOverride('button', { bg: currentHex });
    setAppliedState('button');
    setTimeout(() => setAppliedState(null), 2500);
  };

  const resetWebsiteColors = () => {
    soundFx.playClick();
    resetToDefaults();
    document.documentElement.style.removeProperty('--accent-gold');
    document.documentElement.style.removeProperty('--accent-gold-soft');
    document.documentElement.style.removeProperty('--accent-burgundy');
    document.documentElement.style.removeProperty('--bg-canvas');
    document.documentElement.style.removeProperty('--bg-surface-card');
    document.documentElement.style.removeProperty('--bg-surface-elevated');
    document.documentElement.style.removeProperty('--text-primary');
    document.documentElement.style.removeProperty('--text-secondary');
    document.documentElement.style.removeProperty('--text-muted');

    localStorage.removeItem('sm_custom_accent_gold');
    localStorage.removeItem('sm_custom_bg_canvas');
    localStorage.removeItem('sm_custom_surface_card');
    localStorage.removeItem('sm_custom_surface_elevated');

    setCurrentHex('#66ccff');
    setInputVal('#66ccff');
    setAppliedState('reset');
    setTimeout(() => setAppliedState(null), 2000);
  };

  return (
    <div id="universal-color-lab" className="space-y-6 scroll-mt-24">
      {/* Top Banner & Website Modulation Controls */}
      <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card/90 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: currentHex }}
            />
            <h3 className="font-display font-bold text-xl text-content-primary">
              Universal Color & Shade Laboratory
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold/10 text-gold border border-gold/30">
              Live Site Customizer
            </span>
          </div>
          <p className="text-xs text-content-muted">
            Pick, shade, and apply any color directly across the entire website interface in real-time.
          </p>
        </div>

        {/* Global Modulation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={applyAsAccent}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 border border-white/20 active:scale-95"
            style={{
              backgroundColor: currentHex,
              color: blackContrast > whiteContrast ? '#000000' : '#FFFFFF',
            }}
            title="Set this color as the primary accent across buttons, badges, glows, and borders"
          >
            {appliedState === 'accent' ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Accent</span>
          </button>

          <button
            onClick={applyAsBackground}
            className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95"
            title="Apply this exact color to the website background canvas"
          >
            {appliedState === 'bg' ? '✓ Canvas' : 'Canvas'}
          </button>

          <button
            onClick={applyAsSurfaces}
            className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95"
            title="Apply matching shades to cards, modals and elevated surfaces"
          >
            {appliedState === 'surface' ? '✓ Surfaces' : 'Surfaces'}
          </button>

          <button
            onClick={applyToNavbar}
            className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95"
            title="Apply this color specifically to the top navigation bar"
          >
            {appliedState === 'nav' ? '✓ Navbar' : 'Navbar'}
          </button>

          <button
            onClick={applyToButtons}
            className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95"
            title="Apply this color specifically to interactive buttons"
          >
            {appliedState === 'button' ? '✓ Buttons' : 'Buttons'}
          </button>

          <button
            onClick={toggleDesignMode}
            className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border active:scale-95 ${
              designModeActive
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-gold/15 hover:bg-gold/25 text-gold border-gold/30'
            }`}
            title="Click any element on your website to edit its appearance live"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{designModeActive ? '● Design Mode ON' : 'Click-to-Edit'}</span>
          </button>

          <button
            onClick={resetWebsiteColors}
            className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-muted hover:text-content-primary border border-border-subtle transition-all active:scale-95"
            title="Reset to default Gryffindor Obsidian & Gold palette"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE FULL COLOR LAB CONTAINER (EXACT CLONE OF USER SCREENSHOT)
      ========================================================================= */}
      <div
        className="rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors duration-500 relative overflow-hidden border border-black/10"
        style={{
          backgroundColor: currentHex,
          color: blackContrast > whiteContrast ? '#000000' : '#FFFFFF',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* =====================================================================
              LEFT PANEL (COL 1-4): HONEYCOMB WHEEL, INPUT, EYEDROPPER
          ===================================================================== */}
          <div className="lg:col-span-4 bg-white/95 text-slate-900 rounded-3xl p-6 shadow-xl space-y-6 border border-white/60">
            {/* SVG Hexagonal Honeycomb Color Wheel (61 Cells) */}
            <div className="flex justify-center items-center py-2">
              <svg viewBox="-85 -85 170 170" className="w-60 h-60 drop-shadow-md cursor-pointer overflow-visible">
                {honeycombNodes.map((node, i) => {
                  const isSelected = node.hex.toLowerCase() === currentHex.toLowerCase();
                  return (
                    <polygon
                      key={i}
                      points="0,-14.5 12.5,-7.2 12.5,7.2 0,14.5 -12.5,7.2 -12.5,-7.2"
                      transform={`translate(${node.x}, ${node.y})`}
                      fill={node.hex}
                      stroke={isSelected ? '#000000' : 'rgba(0,0,0,0.15)'}
                      strokeWidth={isSelected ? 2.5 : 0.8}
                      className="transition-transform duration-150 hover:scale-125 hover:stroke-black hover:z-20 cursor-pointer"
                      onClick={() => handleHexChange(node.hex)}
                    >
                      <title>{node.hex}</title>
                    </polygon>
                  );
                })}
              </svg>
            </div>

            {/* "Enter a color value" Input & OK Button */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-medium text-slate-600 block">
                Enter a color value
              </label>
              <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. tomato, #ff6347"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-sans text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00a86b] hover:bg-[#008f5a] text-white font-sans text-sm font-semibold shadow transition-colors active:scale-95"
                >
                  OK
                </button>
              </form>
            </div>

            {/* Eyedropper & Current Color Preview Square */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleEyeDropper}
                className="w-11 h-11 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-sm transition-colors active:scale-95"
                title="Eyedropper: Pick any color from your screen"
              >
                <Pipette className="w-5 h-5 text-slate-800" />
              </button>

              <div
                className="w-12 h-11 rounded-lg border border-slate-300 shadow-inner transition-colors duration-300"
                style={{ backgroundColor: currentHex }}
              />

              <div className="flex-1 text-right">
                <span className="text-xs font-mono font-bold text-slate-500 block uppercase">
                  Hex Code
                </span>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {currentHex.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              CENTER STAGE (COL 5-9): BIG COLOR DISPLAY & DUAL SLIDERS
          ===================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Center Massive Color Typography & Contrast Ratios */}
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8 space-y-3">
              <h1 className="text-6xl sm:text-7xl font-sans font-extrabold tracking-tight drop-shadow-sm select-all">
                {currentHex.toLowerCase()}
              </h1>

              <div className="space-y-0.5 font-mono text-sm sm:text-base opacity-95">
                <p>rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                <p>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
              </div>

              {/* Black / White Text Contrast Ratios with Thumbs Indicator */}
              <div className="flex items-center gap-8 pt-3 text-sm font-sans font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-90">Black text</span>
                  <span className="font-mono font-bold">{blackContrast}:1</span>
                  {blackContrast >= 4.5 ? (
                    <ThumbsUp className="w-4 h-4 fill-current text-slate-900" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 fill-current opacity-70" />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="opacity-90">White text</span>
                  <span className="font-mono font-bold">{whiteContrast}:1</span>
                  {whiteContrast >= 4.5 ? (
                    <ThumbsUp className="w-4 h-4 fill-current text-white" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 fill-current opacity-70" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Sliders Card (RGB & HSL) */}
            <div className="bg-white/95 text-slate-900 rounded-3xl p-6 shadow-xl space-y-5 border border-white/60">
              {/* RGB Row */}
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-3 text-center">
                  {/* R */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">R</span>
                    <span className="text-xs font-mono block text-slate-600">{rgb.r}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={(e) => handleRgbSlider('r', Number(e.target.value))}
                      className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono font-semibold text-slate-500 block">
                      {rgb.r.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* G */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">G</span>
                    <span className="text-xs font-mono block text-slate-600">{rgb.g}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={(e) => handleRgbSlider('g', Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono font-semibold text-slate-500 block">
                      {rgb.g.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* B */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">B</span>
                    <span className="text-xs font-mono block text-slate-600">{rgb.b}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={(e) => handleRgbSlider('b', Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                    <span className="text-xs font-mono font-semibold text-slate-500 block">
                      {rgb.b.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Alpha A */}
                  <div className="space-y-1 opacity-70">
                    <label className="text-xs font-sans font-bold text-slate-800 flex items-center justify-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAlpha}
                        onChange={(e) => setShowAlpha(e.target.checked)}
                        className="rounded text-blue-600 cursor-pointer"
                      />
                      <span>A</span>
                    </label>
                    <span className="text-xs font-mono block text-slate-600">
                      {showAlpha ? `${alphaVal}%` : '50%'}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      disabled={!showAlpha}
                      value={alphaVal}
                      onChange={(e) => setAlphaVal(Number(e.target.value))}
                      className="w-full accent-slate-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none disabled:opacity-40"
                    />
                    <span className="text-xs font-mono font-semibold text-slate-500 block">
                      {Math.round((alphaVal / 100) * 255).toString(16).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* HSL Row */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* H */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">H</span>
                    <span className="text-xs font-mono block text-slate-600">{hsl.h}</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={(e) => handleHslSlider('h', Number(e.target.value))}
                      className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                      style={{
                        background:
                          'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                      }}
                    />
                  </div>

                  {/* S */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">S</span>
                    <span className="text-xs font-mono block text-slate-600">{hsl.s}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={(e) => handleHslSlider('s', Number(e.target.value))}
                      className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>

                  {/* L */}
                  <div className="space-y-1">
                    <span className="text-xs font-sans font-bold text-slate-800">L</span>
                    <span className="text-xs font-mono block text-slate-600">{hsl.l}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) => handleHslSlider('l', Number(e.target.value))}
                      className="w-full accent-slate-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT PANEL (COL 10-12): 21 TINTS & SHADES LADDER (100% to 0%)
          ===================================================================== */}
          <div className="lg:col-span-3 space-y-1.5">
            {tintShadeLadder.map((step) => {
              const stepRgb = hexToRgb(step.hex) || { r: 0, g: 0, b: 0 };
              const isDark = getLuminance(stepRgb.r, stepRgb.g, stepRgb.b) < 0.45;
              const isSelected = step.hex.toLowerCase() === currentHex.toLowerCase();

              return (
                <div
                  key={step.pct}
                  onClick={() => handleHexChange(step.hex)}
                  className={`group px-3 py-1.5 rounded-lg flex items-center justify-between font-mono text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-black font-extrabold shadow-md scale-[1.02] z-10'
                      : 'hover:scale-[1.01] border border-transparent'
                  }`}
                  style={{
                    backgroundColor: step.hex,
                    color: isDark ? '#FFFFFF' : '#000000',
                  }}
                >
                  <span className="tracking-tight">{step.hex}</span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] opacity-80">{step.pct}%</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(step.hex);
                      }}
                      className="p-1 rounded hover:bg-black/20 transition-colors"
                      title="Copy Hex"
                    >
                      {copiedHex === step.hex ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
