import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  useSuperAdaptiveTheme,
  SUPER_THEME_PRESETS,
  ThemeTokens,
} from '../../context/SuperAdaptiveThemeContext';
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
  Crosshair,
  Layers,
  Type,
  Maximize2,
  Download,
  Upload,
  Zap,
  Layout,
  MousePointer,
  Compass,
  Square,
  Circle,
  Hash,
} from 'lucide-react';

// =========================================================================
// COLOR PHYSICS & WCAG 2.1 COMPLIANCE HELPERS
// =========================================================================
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
    a: cleaned.length === 8 ? (num & 255) / 255 : 1,
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

// Generate Hexagonal Honeycomb Color Nodes (61 cells across 4 concentric rings)
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

export type ModulationTarget =
  | 'accent'
  | 'canvas'
  | 'surfaces'
  | 'nav'
  | 'buttons'
  | 'burgundy'
  | 'text'
  | 'heading'
  | 'element';

export const MasterGodModeStudio: React.FC = () => {
  const {
    tokens,
    componentOverrides,
    elementOverrides,
    designModeActive,
    selectedElementId,
    setGlobalToken,
    setComponentOverride,
    setElementOverride,
    applyPreset,
    resetToDefaults,
    exportCss,
    exportJson,
    importJson,
    toggleDesignMode,
  } = useSuperAdaptiveTheme();

  // Active target being modulated
  const [activeTarget, setActiveTarget] = useState<ModulationTarget>('accent');

  // Master active color being edited in the picker
  const [currentHex, setCurrentHex] = useState<string>(() => {
    return localStorage.getItem('sm_custom_accent_gold') || tokens.accent || '#66ccff';
  });
  const [inputVal, setInputVal] = useState<string>(currentHex);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [alphaVal, setAlphaVal] = useState<number>(100);
  const [showAlpha, setShowAlpha] = useState<boolean>(false);

  // Geometry & Typography sub-controls
  const [selectedFont, setSelectedFont] = useState<string>(tokens.font);
  const [selectedHeadingFont, setSelectedHeadingFont] = useState<string>(tokens.headingFont);
  const [currentRadius, setCurrentRadius] = useState<number>(tokens.radius || 16);
  const [currentDensity, setCurrentDensity] = useState<number>(tokens.density || 100);

  // RGB and HSL coordinates
  const rgb = useMemo(() => hexToRgb(currentHex) || { r: 102, g: 204, b: 255 }, [currentHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  // Contrast calculations
  const blackContrast = useMemo(() => getContrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb]);
  const whiteContrast = useMemo(() => getContrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb]);

  // =========================================================================
  // MATHEMATICALLY PERFECTED 21-STEP TINT & SHADE LADDER (100% to 0%)
  // Works flawlessly for ANY color in the universe (including pure #ffffff and #000000)
  // Guaranteed 21 distinct, unique, monotonic shades with zero duplicates!
  // =========================================================================
  const tintShadeLadder = useMemo(() => {
    const steps: { pct: number; hex: string; isBase: boolean }[] = [];

    // Determine where base color naturally anchors (rounded to 5%, clamped 5-95)
    const rawBasePct = Math.round(hsl.l / 5) * 5;
    const basePct = hsl.l >= 98 ? 100 : hsl.l <= 2 ? 0 : Math.max(5, Math.min(95, rawBasePct));

    for (let pct = 100; pct >= 0; pct -= 5) {
      if (pct === basePct) {
        steps.push({ pct, hex: currentHex, isBase: true });
      } else if (pct > basePct) {
        // Tint: blend smoothly towards pure white (#FFFFFF)
        const factor = (pct - basePct) / (100 - basePct);
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
      } else {
        // Shade: blend smoothly towards pure black (#000000)
        const factor = basePct === 0 ? 0 : pct / basePct;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
      }
    }

    return steps;
  }, [rgb, hsl, currentHex]);

  // Honeycomb nodes memoized
  const honeycombNodes = useMemo(() => generateHoneycombNodes(), []);

  // Sync color when target element changes in God Mode inspect
  useEffect(() => {
    if (selectedElementId) {
      setActiveTarget('element');
      const el = document.getElementById(selectedElementId);
      if (el) {
        const compStyle = window.getComputedStyle(el);
        const bg = compStyle.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') {
          const match = bg.match(/\d+/g);
          if (match && match.length >= 3) {
            const hex = rgbToHex(Number(match[0]), Number(match[1]), Number(match[2]));
            setCurrentHex(hex);
            setInputVal(hex);
          }
        }
      }
    }
  }, [selectedElementId]);

  // =========================================================================
  // REAL-TIME MODULATION DISPATCHER: APPLIES COLOR TO THE SELECTED TARGET
  // =========================================================================
  const applyColorToTarget = useCallback(
    (color: string, target: ModulationTarget = activeTarget) => {
      const root = document.documentElement;

      switch (target) {
        case 'accent':
          setGlobalToken('accent', color);
          setGlobalToken('buttonBg', color);
          root.style.setProperty('--accent-gold', color);
          root.style.setProperty('--accent-gold-soft', tintShadeLadder[4]?.hex || color);
          localStorage.setItem('sm_custom_accent_gold', color);
          break;

        case 'canvas':
          setGlobalToken('canvas', color);
          root.style.setProperty('--bg-canvas', color);
          localStorage.setItem('sm_custom_bg_canvas', color);
          // If light canvas is chosen, balance contrast automatically
          if (whiteContrast < 2.5 && blackContrast > 6) {
            setGlobalToken('text', '#0B0B0C');
            root.style.setProperty('--text-primary', '#0B0B0C');
            root.style.setProperty('--text-secondary', '#242428');
            root.style.setProperty('--text-muted', '#4A4A52');
          }
          break;

        case 'surfaces':
          setGlobalToken('surface', color);
          setGlobalToken('cardBg', color);
          root.style.setProperty('--bg-surface-card', color);
          root.style.setProperty('--bg-surface-elevated', tintShadeLadder[14]?.hex || color);
          localStorage.setItem('sm_custom_surface_card', color);
          localStorage.setItem('sm_custom_surface_elevated', tintShadeLadder[14]?.hex || color);
          break;

        case 'nav':
          setComponentOverride('nav', { bg: color });
          root.style.setProperty('--comp-nav-bg', color);
          break;

        case 'buttons':
          setComponentOverride('button', { bg: color });
          setGlobalToken('buttonBg', color);
          root.style.setProperty('--theme-button-bg', color);
          break;

        case 'burgundy':
          root.style.setProperty('--accent-burgundy', color);
          localStorage.setItem('sm_custom_accent_burgundy', color);
          break;

        case 'text':
          setGlobalToken('text', color);
          root.style.setProperty('--text-primary', color);
          break;

        case 'heading':
          setGlobalToken('headingColor', color);
          root.style.setProperty('--text-heading', color);
          break;

        case 'element':
          if (selectedElementId) {
            setElementOverride(selectedElementId, { bg: color });
            const el = document.getElementById(selectedElementId);
            if (el) el.style.backgroundColor = color;
          }
          break;
      }
    },
    [
      activeTarget,
      selectedElementId,
      setGlobalToken,
      setComponentOverride,
      setElementOverride,
      tintShadeLadder,
      whiteContrast,
      blackContrast,
    ]
  );

  // When a hex color is picked in Honeycomb, ladder, or sliders
  const handleColorSelect = (newHex: string) => {
    soundFx.playClick();
    setCurrentHex(newHex);
    setInputVal(newHex);
    applyColorToTarget(newHex);
  };

  const handleRgbSlider = (channel: 'r' | 'g' | 'b', val: number) => {
    const newRgb = { ...rgb, [channel]: val };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentHex(hex);
    setInputVal(hex);
    applyColorToTarget(hex);
  };

  const handleHslSlider = (channel: 'h' | 's' | 'l', val: number) => {
    const newHsl = { ...hsl, [channel]: val };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentHex(hex);
    setInputVal(hex);
    applyColorToTarget(hex);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let val = inputVal.trim();
    if (!val.startsWith('#') && /^[0-9A-Fa-f]{3,6}$/.test(val)) {
      val = '#' + val;
    }
    if (hexToRgb(val)) {
      soundFx.playChime();
      setCurrentHex(val);
      applyColorToTarget(val);
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
          applyColorToTarget(result.sRGBHex);
        }
      } catch {
        // cancelled
      }
    } else {
      alert('The native EyeDropper is supported in Chrome, Edge, and Opera desktop browsers.');
    }
  };

  const copyToClipboard = (text: string) => {
    soundFx.playClick();
    void navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleResetDefaults = () => {
    soundFx.playClick();
    resetToDefaults();
    const root = document.documentElement;
    root.style.removeProperty('--accent-gold');
    root.style.removeProperty('--accent-gold-soft');
    root.style.removeProperty('--accent-burgundy');
    root.style.removeProperty('--bg-canvas');
    root.style.removeProperty('--bg-surface-card');
    root.style.removeProperty('--bg-surface-elevated');
    root.style.removeProperty('--text-primary');
    root.style.removeProperty('--text-secondary');
    root.style.removeProperty('--text-muted');
    root.style.removeProperty('--theme-button-bg');
    root.style.removeProperty('--comp-nav-bg');
    root.style.removeProperty('--theme-radius');
    root.style.removeProperty('--theme-density');

    localStorage.removeItem('sm_custom_accent_gold');
    localStorage.removeItem('sm_custom_bg_canvas');
    localStorage.removeItem('sm_custom_surface_card');
    localStorage.removeItem('sm_custom_surface_elevated');
    localStorage.removeItem('sm_custom_accent_burgundy');

    setCurrentHex('#D3A625');
    setInputVal('#D3A625');
    setStatusMessage('Restored Gryffindor Factory Defaults');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleExportCss = () => {
    soundFx.playClick();
    const css = exportCss();
    void navigator.clipboard.writeText(css);
    setStatusMessage('Copied Full CSS Variables to Clipboard');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Target Options Descriptor
  const TARGET_OPTIONS: { id: ModulationTarget; label: string; icon: any; desc: string }[] = [
    { id: 'accent', label: 'Primary Accent', icon: Sparkles, desc: 'Buttons, active glows, badges & border highlights' },
    { id: 'canvas', label: 'Global Canvas', icon: Layout, desc: 'Deep background canvas of entire Gryffindor OS' },
    { id: 'surfaces', label: 'Cards & Panels', icon: Square, desc: 'Widgets, elevated cards and modal containers' },
    { id: 'nav', label: 'Navigation Bar', icon: Compass, desc: 'Top command header, blur backdrop and nav items' },
    { id: 'buttons', label: 'Buttons & CTAs', icon: Circle, desc: 'Tactile press buttons, pill actions and primary triggers' },
    { id: 'burgundy', label: 'Velvet Secondary', icon: Zap, desc: 'Gryffindor imperial scarlet & deep velvet trims' },
    { id: 'heading', label: 'Heading Text', icon: Type, desc: 'Display font and hero title typography' },
    { id: 'element', label: selectedElementId ? `Element #${selectedElementId}` : 'Click Element', icon: Crosshair, desc: 'Directly style any hovered element live on screen' },
  ];

  return (
    <div id="master-god-mode-controller" className="space-y-6 scroll-mt-24">
      {/* =========================================================================
          COMMAND DECK BANNER & MASTER CONTROLLER STATUS
      ========================================================================= */}
      <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card/90 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentHex }}
        />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm animate-pulse"
              style={{ backgroundColor: currentHex }}
            />
            <h2 className="font-display font-extrabold text-2xl text-content-primary tracking-tight">
              ⚡ MASTER GOD MODE — FULL VISUAL & UI CONTROLLER
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 font-bold">
              SITE-WIDE MODULATOR
            </span>
            {designModeActive && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse font-bold">
                ● LIVE INSPECTOR ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-content-secondary max-w-2xl leading-relaxed">
            Real-time command center for all colors, components, typography, geometry, and live element styling across Gryffindor OS. Every change is applied live to the entire website and persisted across sessions.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={toggleDesignMode}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border active:scale-95 ${
              designModeActive
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-gold/15 hover:bg-gold/25 text-gold border-gold/30'
            }`}
            title="Click any element on your website to select and style it directly"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{designModeActive ? 'Inspector Active' : '⚡ Click-to-Inspect'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCss}
            className="px-3 py-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95 flex items-center gap-1.5"
            title="Copy all custom properties to CSS"
          >
            <Copy className="w-3.5 h-3.5 text-gold" />
            <span>Export CSS</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-muted hover:text-content-primary border border-border-subtle transition-all active:scale-95"
            title="Reset to default Gryffindor Obsidian & Gold system"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Status Notice Toast */}
      {statusMessage && (
        <div className="p-3 rounded-2xl bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TARGET SELECTOR DECK (CONTROL "EACH AND EVERYTHING")
      ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-content-muted px-1">
          <span className="flex items-center gap-1 text-content-primary font-bold">
            <Layers className="w-3.5 h-3.5 text-gold" />
            SELECT TARGET TO MODULATE:
          </span>
          <span className="text-[11px]">
            Active Target: <span className="text-gold font-bold uppercase">{activeTarget}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {TARGET_OPTIONS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTarget === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTarget(t.id);
                  if (t.id === 'element' && !designModeActive) {
                    toggleDesignMode();
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-1.5 ${
                  isActive
                    ? 'bg-surface-elevated border-gold ring-1 ring-gold shadow-lg'
                    : 'bg-surface-card hover:bg-surface-elevated/60 border-border-subtle text-content-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-content-secondary'}`} />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
                </div>
                <div>
                  <span className={`text-xs font-mono font-bold block ${isActive ? 'text-content-primary' : 'text-content-secondary'}`}>
                    {t.label}
                  </span>
                  <span className="text-[10px] text-content-muted line-clamp-1">
                    {t.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          THE FULL MASTER COLOR & SHADE CONTROLLER (HONEYCOMB + 21-SHADE + SLIDERS)
      ========================================================================= */}
      <div className="rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-border-subtle bg-surface-card/90 backdrop-blur-2xl">
        {/* Dynamic Ambient Glow Behind Active Workspace */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentHex }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentHex }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* =====================================================================
              LEFT PANEL (COL 1-4): HONEYCOMB WHEEL, INPUT, EYEDROPPER
          ===================================================================== */}
          <div className="lg:col-span-4 bg-surface-elevated/70 border border-border-subtle rounded-3xl p-5 shadow-xl space-y-5 text-content-primary backdrop-blur-xl">
            {/* SVG Hexagonal Honeycomb Color Wheel (61 Cells) */}
            <div className="flex justify-center items-center py-1">
              <svg viewBox="-85 -85 170 170" className="w-60 h-60 drop-shadow-lg cursor-pointer overflow-visible">
                {honeycombNodes.map((node, i) => {
                  const isSelected = node.hex.toLowerCase() === currentHex.toLowerCase();
                  return (
                    <polygon
                      key={i}
                      points="0,-14.5 12.5,-7.2 12.5,7.2 0,14.5 -12.5,7.2 -12.5,-7.2"
                      transform={`translate(${node.x}, ${node.y})`}
                      fill={node.hex}
                      stroke={isSelected ? '#D3A625' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={isSelected ? 2.8 : 0.8}
                      className="transition-transform duration-150 hover:scale-125 hover:stroke-white hover:z-20 cursor-pointer"
                      onClick={() => handleColorSelect(node.hex)}
                    >
                      <title>{node.hex}</title>
                    </polygon>
                  );
                })}
              </svg>
            </div>

            {/* Input & OK Button */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-content-muted block">
                Enter color value or name:
              </label>
              <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. #66ccff, crimson, gold"
                  className="flex-1 bg-surface-card border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-content-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 shadow-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-soft text-black font-mono text-xs font-bold shadow transition-colors active:scale-95"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Eyedropper & Current Hex Preview */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleEyeDropper}
                className="w-11 h-11 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated flex items-center justify-center text-content-secondary hover:text-gold shadow-sm transition-colors active:scale-95"
                title="Eyedropper: Pick any pixel on screen"
              >
                <Pipette className="w-5 h-5 text-content-primary" />
              </button>

              <div
                className="w-12 h-11 rounded-xl border border-white/20 shadow-md transition-colors duration-300"
                style={{ backgroundColor: currentHex }}
              />

              <div className="flex-1 text-right">
                <span className="text-[10px] font-mono font-bold text-content-muted block uppercase tracking-wider">
                  HEX CODE ({activeTarget.toUpperCase()})
                </span>
                <span className="text-sm font-mono font-bold text-content-primary">
                  {currentHex.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              CENTER STAGE (COL 5-9): BIG COLOR DISPLAY & DUAL SLIDERS & LIVE PREVIEW
          ===================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Massive Display & WCAG Telemetry */}
            <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                Target: {activeTarget}
              </span>

              <h1 className="text-6xl sm:text-7xl font-display font-extrabold tracking-tight select-all text-content-primary">
                {currentHex.toLowerCase()}
              </h1>

              <div className="space-y-0.5 font-mono text-sm text-content-secondary">
                <p>rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                <p>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
              </div>

              {/* Black / White Text Contrast Ratios with Telemetry Badges */}
              <div className="flex items-center gap-3 pt-2 text-xs font-mono font-semibold">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-border-subtle shadow-sm">
                  <span className="text-content-muted">Black text</span>
                  <span className="font-bold text-content-primary">{blackContrast}:1</span>
                  {blackContrast >= 4.5 ? (
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-border-subtle shadow-sm">
                  <span className="text-content-muted">White text</span>
                  <span className="font-bold text-content-primary">{whiteContrast}:1</span>
                  {whiteContrast >= 4.5 ? (
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Precision Sliders Card (RGB & HSL) */}
            <div className="bg-surface-elevated/70 border border-border-subtle text-content-primary rounded-3xl p-5 shadow-xl space-y-4 backdrop-blur-xl">
              {/* RGB Row */}
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {/* R */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-rose-400">R</span>
                    <span className="text-xs font-mono block text-content-secondary">{rgb.r}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={(e) => handleRgbSlider('r', Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-content-muted block">
                      {rgb.r.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* G */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-emerald-400">G</span>
                    <span className="text-xs font-mono block text-content-secondary">{rgb.g}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={(e) => handleRgbSlider('g', Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-content-muted block">
                      {rgb.g.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* B */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-blue-400">B</span>
                    <span className="text-xs font-mono block text-content-secondary">{rgb.b}</span>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={(e) => handleRgbSlider('b', Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-content-muted block">
                      {rgb.b.toString(16).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Alpha A */}
                  <div className="space-y-1 opacity-80">
                    <label className="text-xs font-mono font-bold text-content-primary flex items-center justify-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showAlpha}
                        onChange={(e) => setShowAlpha(e.target.checked)}
                        className="rounded text-gold cursor-pointer"
                      />
                      <span>A</span>
                    </label>
                    <span className="text-xs font-mono block text-content-secondary">
                      {showAlpha ? `${alphaVal}%` : '100%'}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      disabled={!showAlpha}
                      value={alphaVal}
                      onChange={(e) => setAlphaVal(Number(e.target.value))}
                      className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none disabled:opacity-30"
                    />
                    <span className="text-[10px] font-mono text-content-muted block">
                      {Math.round((alphaVal / 100) * 255).toString(16).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* HSL Row */}
              <div className="space-y-2 pt-2 border-t border-border-subtle">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* H */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-content-primary">H</span>
                    <span className="text-xs font-mono block text-content-secondary">{hsl.h}°</span>
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
                    <span className="text-xs font-mono font-bold text-content-primary">S</span>
                    <span className="text-xs font-mono block text-content-secondary">{hsl.s}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={(e) => handleHslSlider('s', Number(e.target.value))}
                      className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                    />
                  </div>

                  {/* L */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-content-primary">L</span>
                    <span className="text-xs font-mono block text-content-secondary">{hsl.l}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) => handleHslSlider('l', Number(e.target.value))}
                      className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE GRYFFINDOR SPECIMEN PREVIEW CARD */}
            <div className="p-4 rounded-2xl border border-border-subtle bg-surface-elevated/40 backdrop-blur-xl space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-content-muted block">
                LIVE COMPONENT TELEMETRY PREVIEW
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-card border border-border-subtle">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-content-primary block">
                    Gryffindor Common Room Specimen
                  </span>
                  <span className="text-[11px] text-content-muted block">
                    Telemetry: Active token applied live
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md transition-all active:scale-95"
                  style={{
                    backgroundColor: tokens.accent,
                    color: blackContrast > whiteContrast ? '#000000' : '#FFFFFF',
                  }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT PANEL (COL 10-12): 21 TINTS & SHADES LADDER (100% to 0%)
          ===================================================================== */}
          <div className="lg:col-span-3 space-y-1.5 bg-surface-elevated/40 border border-border-subtle p-3 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-[11px] font-mono text-content-muted px-2 pb-1 border-b border-border-subtle">
              <span>21 SHADES LADDER</span>
              <span>100% → 0%</span>
            </div>

            <div className="space-y-1 max-h-[580px] overflow-y-auto no-scrollbar pr-0.5">
              {tintShadeLadder.map((step) => {
                const stepRgb = hexToRgb(step.hex) || { r: 0, g: 0, b: 0 };
                const isDarkStep = getLuminance(stepRgb.r, stepRgb.g, stepRgb.b) < 0.45;
                const isSelected = step.hex.toLowerCase() === currentHex.toLowerCase();

                return (
                  <div
                    key={step.pct}
                    onClick={() => handleColorSelect(step.hex)}
                    className={`group px-3 py-1.5 rounded-xl flex items-center justify-between font-mono text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-gold font-extrabold shadow-lg scale-[1.02] z-10'
                        : 'hover:scale-[1.01] border border-transparent hover:border-border-strong'
                    }`}
                    style={{
                      backgroundColor: step.hex,
                      color: isDarkStep ? '#FFFFFF' : '#000000',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="tracking-tight font-bold">{step.hex}</span>
                      {step.isBase && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-gold text-black font-extrabold uppercase">
                          Base
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] opacity-80">{step.pct}%</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(step.hex);
                        }}
                        className="p-1 rounded-lg hover:bg-black/20 transition-colors"
                        title="Copy Hex"
                      >
                        {copiedHex === step.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* =========================================================================
          ONE-CLICK PRESET THEMES & GEOMETRY MODULATORS
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 6 Master Style Presets */}
        <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-content-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Master Style Presets (1-Click Switch)
            </h3>
            <span className="text-[10px] font-mono text-content-muted">6 Signature Systems</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUPER_THEME_PRESETS.map((preset) => {
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    soundFx.playChime();
                    applyPreset(preset.name);
                    setCurrentHex(preset.tokens.accent || '#D3A625');
                    setInputVal(preset.tokens.accent || '#D3A625');
                    setStatusMessage(`Applied preset: ${preset.name}`);
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                  className="p-3.5 rounded-2xl border border-border-subtle bg-surface-elevated hover:border-gold/50 text-left transition-all active:scale-95 space-y-2 group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-content-primary group-hover:text-gold transition-colors">
                      {preset.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.tokens.canvas }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.tokens.accent }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-content-muted line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Geometry & Typography Sliders */}
        <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card/80 backdrop-blur-xl space-y-5">
          <h3 className="font-display font-bold text-base text-content-primary flex items-center gap-2">
            <Sliders className="w-4 h-4 text-gold" />
            Geometry, Radius & Layout Density
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {/* Radius Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-content-muted">
                <span>Corner Radius (Geometry)</span>
                <span className="text-content-primary font-bold">{currentRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={currentRadius}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentRadius(val);
                  setGlobalToken('radius', val);
                  document.documentElement.style.setProperty('--theme-radius', `${val}px`);
                }}
                className="w-full accent-gold cursor-pointer h-1.5 bg-surface-elevated rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-content-muted">
                <span>0px (Sharp)</span>
                <span>16px (Apple Glass)</span>
                <span>32px (Full Pill)</span>
              </div>
            </div>

            {/* Density Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-content-muted">
                <span>Layout Spacing & Density</span>
                <span className="text-content-primary font-bold">{currentDensity}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="130"
                value={currentDensity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCurrentDensity(val);
                  setGlobalToken('density', val);
                  document.documentElement.style.setProperty('--theme-density', (val / 100).toString());
                }}
                className="w-full accent-gold cursor-pointer h-1.5 bg-surface-elevated rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-content-muted">
                <span>70% (Ultra Compact)</span>
                <span>100% (Balanced)</span>
                <span>130% (Spacious)</span>
              </div>
            </div>

            {/* Typography Quick Switcher */}
            <div className="space-y-1.5 pt-2 border-t border-border-subtle">
              <span className="text-content-muted block">Primary Typography Pair</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Space Grotesk + Serif', font: 'Space Grotesk, sans-serif', head: 'Georgia, serif' },
                  { name: 'SF Pro + Display', font: 'Inter, system-ui, sans-serif', head: 'SF Pro Display, sans-serif' },
                  { name: 'Dark Academia Papyrus', font: 'Cormorant Garamond, serif', head: 'Cinzel, serif' },
                  { name: 'Cyber Monospace', font: 'JetBrains Mono, monospace', head: 'Space Grotesk, sans-serif' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedFont(item.font);
                      setSelectedHeadingFont(item.head);
                      setGlobalToken('font', item.font);
                      setGlobalToken('headingFont', item.head);
                      document.documentElement.style.setProperty('--font-primary', item.font);
                      document.documentElement.style.setProperty('--font-display', item.head);
                    }}
                    className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle text-left text-[11px] text-content-primary transition-all active:scale-95"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
