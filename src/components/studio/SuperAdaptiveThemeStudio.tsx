import React, { useState, useMemo } from 'react';
import {
  useSuperAdaptiveTheme,
  SUPER_THEME_PRESETS,
  DEFAULT_THEME_TOKENS,
  ThemeTokens,
} from '../../context/SuperAdaptiveThemeContext';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  Palette,
  Sparkles,
  Sliders,
  Check,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Layers,
  Crosshair,
  Type,
  Sun,
  Moon,
  ShieldCheck,
  Maximize2,
  FileText,
} from 'lucide-react';

export const SuperAdaptiveThemeStudio: React.FC = () => {
  const {
    tokens,
    componentOverrides,
    designModeActive,
    toggleDesignMode,
    setGlobalToken,
    setComponentOverride,
    applyPreset,
    resetToDefaults,
    exportCss,
    exportJson,
    importJson,
  } = useSuperAdaptiveTheme();

  const [activeSection, setActiveSection] = useState<'presets' | 'master' | 'components' | 'typography' | 'export'>('presets');
  const [masterColor, setMasterColor] = useState<string>(tokens.accent);
  const [harmonyType, setHarmonyType] = useState<'shades' | 'analogous' | 'complementary' | 'triadic' | 'monochrome'>('shades');
  const [paletteCount, setPaletteCount] = useState<number>(16);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Generate color harmony swatches based on master color
  const harmonySwatches = useMemo(() => {
    function hexToRgb(hex: string) {
      const num = parseInt(hex.replace('#', ''), 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
    function rgbToHex(r: number, g: number, b: number) {
      const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
      return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
    }
    function hsv(hex: string) {
      let [r, g, b] = hexToRgb(hex).map((x) => x / 255);
      let v = Math.max(r, g, b),
        m = Math.min(r, g, b),
        d = v - m,
        s = v ? d / v : 0,
        h = 0;
      if (d) {
        switch (v) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          default:
            h = (r - g) / d + 4;
        }
        h *= 60;
      }
      return [h, s, v];
    }
    function hsvToRgb(h: number, s: number, v: number) {
      let f = (n: number) => {
        let k = (n + h / 60) % 6;
        return Math.round((v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)) * 255);
      };
      return [f(5), f(3), f(1)];
    }

    try {
      const [h, s, v] = hsv(masterColor);
      const arr: string[] = [];
      for (let i = 0; i < paletteCount; i++) {
        let t = i / (paletteCount - 1);
        let hh = h,
          ss = s,
          vv = v;
        if (harmonyType === 'shades') {
          ss = t < 0.5 ? s * (t / 0.5) : s;
          vv = 1 - t * 0.91;
        } else if (harmonyType === 'analogous') {
          hh = (h - 50 + 100 * t + 360) % 360;
          ss = 0.4 + 0.55 * ((i % 4) / 3);
          vv = 0.95 - 0.4 * (Math.floor(i / 4) / Math.max(1, Math.ceil(paletteCount / 4) - 1));
        } else if (harmonyType === 'complementary') {
          hh = (h + (i % 2) * 180) % 360;
          ss = 0.3 + 0.65 * (Math.floor(i / 2) / Math.max(1, Math.ceil(paletteCount / 2) - 1));
          vv = 1 - 0.6 * ((i % 4) / 3);
        } else if (harmonyType === 'triadic') {
          hh = (h + (i % 3) * 120) % 360;
          ss = 0.35 + 0.6 * ((i % 5) / 4);
          vv = 1 - 0.6 * (Math.floor(i / 3) / Math.max(1, Math.ceil(paletteCount / 3) - 1));
        } else {
          ss = Math.min(1, 0.12 + 0.82 * t);
          vv = 1 - 0.75 * t;
        }
        const [r, g, b] = hsvToRgb(hh, Math.max(0, Math.min(1, ss)), Math.max(0, Math.min(1, vv)));
        arr.push(rgbToHex(r, g, b));
      }
      return arr;
    } catch {
      return [masterColor];
    }
  }, [masterColor, harmonyType, paletteCount]);

  const handleCopyCss = () => {
    soundFx.playChime();
    void navigator.clipboard.writeText(exportCss());
    setCopyFeedback('CSS Tokens copied to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDownloadCss = () => {
    soundFx.playClick();
    const blob = new Blob([exportCss()], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gryffindor-super-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    soundFx.playClick();
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gryffindor-theme-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importJson(content);
        if (success) {
          setCopyFeedback('Theme JSON imported successfully!');
          setTimeout(() => setCopyFeedback(null), 2500);
        } else {
          alert('Invalid Theme JSON file format.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface-card/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 space-y-8 select-none">
      {/* Studio Header & Global Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-burgundy flex items-center justify-center text-white shadow-lg">
              <Palette className="w-5 h-5 text-gold" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-2xl text-content-primary">
                  Super Adaptive Theme Studio
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold/10 text-gold border border-gold/30">
                  Global & Per-Element Customizer
                </span>
              </div>
              <p className="text-xs text-content-muted mt-0.5">
                Customize global palettes, typography, spacing, component themes, and click any element on the website to style it directly.
              </p>
            </div>
          </div>
        </div>

        {/* Global Design Mode Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={toggleDesignMode}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 border active:scale-95 ${
              designModeActive
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-gold hover:bg-gold-soft text-black border-gold'
            }`}
            title="Click any element on your website to edit its appearance live"
          >
            <Crosshair className="w-4 h-4" />
            <span>{designModeActive ? '● Design Mode ACTIVE' : '⚡ Turn ON Design Mode'}</span>
          </button>

          <button
            onClick={resetToDefaults}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-muted hover:text-content-primary border border-border-subtle transition-all active:scale-95"
            title="Reset to default Gryffindor Dark Academia theme"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-surface-elevated border border-border-subtle text-xs font-mono">
        {[
          { id: 'presets', label: '01 / Style Presets' },
          { id: 'master', label: '02 / Harmonies & Pigments' },
          { id: 'components', label: '03 / Component Themes' },
          { id: 'typography', label: '04 / Typography & Shape' },
          { id: 'export', label: '05 / Export & Backup' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setActiveSection(tab.id as any);
            }}
            className={`px-3.5 py-2 rounded-xl transition-colors ${
              activeSection === tab.id
                ? 'bg-surface-card text-content-primary font-bold shadow-sm border border-border-subtle'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Copy / Action Feedback Alert */}
      {copyFeedback && (
        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: THEME PRESETS
      ========================================================================= */}
      {activeSection === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted border-b border-border-subtle pb-3">
            <span>6 CURATED ARCHITECTURAL PRESETS</span>
            <span>Instant One-Click Application</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPER_THEME_PRESETS.map((preset) => (
              <div
                key={preset.name}
                onClick={() => applyPreset(preset.name)}
                className="group p-5 rounded-2xl border border-border-subtle bg-surface-elevated/70 hover:bg-surface-card hover:border-gold/50 transition-all cursor-pointer space-y-3 shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-content-primary group-hover:text-gold transition-colors">
                    {preset.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    {[preset.tokens.canvas, preset.tokens.surface, preset.tokens.accent, preset.tokens.buttonBg].map(
                      (c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      )
                    )}
                  </div>
                </div>

                <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-content-muted">
                  <span>Radius: {preset.tokens.radius}px</span>
                  <span className="text-gold group-hover:underline">Apply Theme →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: MASTER COLOR & HARMONY GENERATOR
      ========================================================================= */}
      {activeSection === 'master' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Master Color Input */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-4">
              <span className="text-xs font-mono text-content-muted block uppercase tracking-wider font-bold">
                Master Pigment Origin
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={masterColor}
                  onChange={(e) => {
                    setMasterColor(e.target.value);
                    setGlobalToken('accent', e.target.value);
                  }}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={masterColor}
                  onChange={(e) => {
                    setMasterColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setGlobalToken('accent', e.target.value);
                    }
                  }}
                  className="flex-1 bg-surface-card border border-border-subtle rounded-xl px-3 py-2 text-sm font-mono text-content-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-content-muted block mb-1">Harmony Type</label>
                  <select
                    value={harmonyType}
                    onChange={(e) => setHarmonyType(e.target.value as any)}
                    className="w-full bg-surface-card border border-border-subtle rounded-xl p-2 text-content-primary"
                  >
                    <option value="shades">Tints & Shades</option>
                    <option value="analogous">Analogous</option>
                    <option value="complementary">Complementary</option>
                    <option value="triadic">Triadic</option>
                    <option value="monochrome">Monochrome</option>
                  </select>
                </div>

                <div>
                  <label className="text-content-muted block mb-1">Palette Size</label>
                  <select
                    value={paletteCount}
                    onChange={(e) => setPaletteCount(Number(e.target.value))}
                    className="w-full bg-surface-card border border-border-subtle rounded-xl p-2 text-content-primary"
                  >
                    <option value={8}>8 Swatches</option>
                    <option value={16}>16 Swatches</option>
                    <option value={24}>24 Swatches</option>
                    <option value={32}>32 Swatches</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generated Swatches Grid */}
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-mono text-content-muted block uppercase tracking-wider font-bold">
                Derived Palette Harmonies (Click any swatch to apply as master)
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 rounded-2xl bg-surface-elevated border border-border-subtle">
                {harmonySwatches.map((hex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setMasterColor(hex);
                      setGlobalToken('accent', hex);
                    }}
                    className={`h-11 rounded-xl border transition-transform hover:scale-110 active:scale-95 shadow-sm relative ${
                      hex.toLowerCase() === masterColor.toLowerCase() ? 'ring-2 ring-white border-black scale-105' : 'border-black/20'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: INDEPENDENT COMPONENT THEMES
      ========================================================================= */}
      {activeSection === 'components' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-content-muted border-b border-border-subtle pb-3">
            <span>INDEPENDENT COMPONENT OVERRIDES</span>
            <span>Style parts of the website without changing others</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Navigation Bar */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>Top Navigation Bar</span>
                <span className="text-[10px] font-mono text-gold">Header</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Background:</span>
                  <input
                    type="color"
                    value={componentOverrides.nav?.bg || tokens.navBg}
                    onChange={(e) => setComponentOverride('nav', { bg: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Typography:</span>
                  <input
                    type="color"
                    value={componentOverrides.nav?.text || tokens.navText}
                    onChange={(e) => setComponentOverride('nav', { text: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>

            {/* 2. Common Room Dashboard */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>Common Room Cockpit</span>
                <span className="text-[10px] font-mono text-gold">Dashboard</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Card Background:</span>
                  <input
                    type="color"
                    value={componentOverrides.dashboard?.cardBg || tokens.cardBg}
                    onChange={(e) => setComponentOverride('dashboard', { cardBg: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Card Text:</span>
                  <input
                    type="color"
                    value={componentOverrides.dashboard?.text || tokens.text}
                    onChange={(e) => setComponentOverride('dashboard', { text: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>

            {/* 3. The Quest Board */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>The Quest Board</span>
                <span className="text-[10px] font-mono text-gold">Tasks</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Accent Gold:</span>
                  <input
                    type="color"
                    value={componentOverrides.tasks?.accent || tokens.accent}
                    onChange={(e) => setComponentOverride('tasks', { accent: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Button Fill:</span>
                  <input
                    type="color"
                    value={componentOverrides.tasks?.bg || tokens.buttonBg}
                    onChange={(e) => setComponentOverride('tasks', { bg: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>

            {/* 4. The Ledger (Attendance) */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>The Ledger</span>
                <span className="text-[10px] font-mono text-emerald-400">Attendance</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Active Shift Color:</span>
                  <input
                    type="color"
                    value={componentOverrides.attendance?.accent || '#10B981'}
                    onChange={(e) => setComponentOverride('attendance', { accent: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>

            {/* 5. My Space (Personal Chamber) */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>My Chamber & Journal</span>
                <span className="text-[10px] font-mono text-purple-400">Private Life</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Chamber Canvas:</span>
                  <input
                    type="color"
                    value={componentOverrides.mySpace?.bg || '#110D15'}
                    onChange={(e) => setComponentOverride('mySpace', { bg: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Chamber Accent:</span>
                  <input
                    type="color"
                    value={componentOverrides.mySpace?.accent || '#A855F7'}
                    onChange={(e) => setComponentOverride('mySpace', { accent: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>

            {/* 6. The Observatory (Analytics) */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <h4 className="font-display font-bold text-sm text-content-primary flex items-center justify-between">
                <span>The Observatory</span>
                <span className="text-[10px] font-mono text-cyan-400">Analytics</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span>Chart Accent:</span>
                  <input
                    type="color"
                    value={componentOverrides.analytics?.accent || '#06B6D4'}
                    onChange={(e) => setComponentOverride('analytics', { accent: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: TYPOGRAPHY & SHAPE
      ========================================================================= */}
      {activeSection === 'typography' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-4">
              <span className="text-xs font-mono text-content-muted block uppercase tracking-wider font-bold">
                Font Pairings
              </span>
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="text-content-muted block mb-1">Body Text Font</label>
                  <select
                    value={tokens.font}
                    onChange={(e) => setGlobalToken('font', e.target.value)}
                    className="w-full bg-surface-card border border-border-subtle rounded-xl p-2 text-content-primary"
                  >
                    <option value="Inter, system-ui, sans-serif">Modern / Clean (Inter)</option>
                    <option value="Georgia, serif">Editorial Literary (Georgia)</option>
                    <option value="'Courier New', monospace">Technical Terminal (Monospace)</option>
                    <option value="'Playfair Display', serif">Luxury Serif (Playfair)</option>
                  </select>
                </div>

                <div>
                  <label className="text-content-muted block mb-1">Heading Display Font</label>
                  <select
                    value={tokens.headingFont}
                    onChange={(e) => setGlobalToken('headingFont', e.target.value)}
                    className="w-full bg-surface-card border border-border-subtle rounded-xl p-2 text-content-primary"
                  >
                    <option value="Georgia, serif">Editorial Serif (Georgia)</option>
                    <option value="Inter, system-ui, sans-serif">Satoshi / Bold Modern (Inter)</option>
                    <option value="'Cinzel', serif">Imperial Roman (Cinzel)</option>
                    <option value="'Courier New', monospace">Raw Technical (Monospace)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sliders: Radius & Density */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-4">
              <span className="text-xs font-mono text-content-muted block uppercase tracking-wider font-bold">
                Layout Density & Geometric Radius
              </span>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Corner Radius</span>
                    <span className="text-gold font-bold">{tokens.radius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={tokens.radius}
                    onChange={(e) => setGlobalToken('radius', Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Spacing Density</span>
                    <span className="text-gold font-bold">{tokens.density}%</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="145"
                    value={tokens.density}
                    onChange={(e) => setGlobalToken('density', Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Typography Preview Banner */}
          <div
            className="p-8 rounded-3xl border border-border-subtle bg-surface-elevated text-center space-y-2 transition-all"
            style={{
              borderRadius: `${tokens.radius}px`,
              fontFamily: tokens.font,
            }}
          >
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight"
              style={{ fontFamily: tokens.headingFont, color: tokens.headingColor }}
            >
              The Common Room — Folio 2026
            </h2>
            <p className="text-sm text-content-secondary max-w-xl mx-auto italic font-serif">
              "Two independent minds, one unified operating system. Meticulously engineered, enduring, and beautifully adapted to your personal craft."
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: EXPORT & BACKUP
      ========================================================================= */}
      {activeSection === 'export' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-elevated border border-border-subtle space-y-4">
            <span className="text-xs font-mono text-content-muted block uppercase tracking-wider font-bold">
              Export Design Tokens to Code
            </span>
            <p className="text-xs text-content-secondary">
              Use your customized CSS tokens or backup JSON format to deploy across environments, save configurations, or share between your HP OMEN, MacBook, and iPhone.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleCopyCss}
                className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-soft text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-md active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>Copy CSS Variables</span>
              </button>

              <button
                onClick={handleDownloadCss}
                className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-content-primary font-mono text-xs border border-border-subtle transition-colors flex items-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4 text-gold" />
                <span>Download CSS File</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-content-primary font-mono text-xs border border-border-subtle transition-colors flex items-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Theme JSON</span>
              </button>

              <label className="px-4 py-2.5 rounded-xl bg-surface-card hover:bg-surface-elevated text-content-primary font-mono text-xs border border-border-subtle transition-colors flex items-center gap-2 cursor-pointer active:scale-95">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Code Output Box */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-content-muted block uppercase">
              Generated CSS Variable Spec
            </span>
            <pre className="p-4 rounded-2xl bg-black/80 border border-border-subtle text-xs font-mono text-emerald-400 overflow-x-auto max-h-60">
              {exportCss()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
