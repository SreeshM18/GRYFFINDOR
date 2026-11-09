import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import {
  themeSyncService,
  GodModeThemeModel,
  StyleRules,
  DeviceBreakpoint,
  ThemeScope,
  GOD_MODE_PRESETS,
  GOD_MODE_FONTS,
  GOD_MODE_SHADOWS,
  validateValue,
  compileGodModeCss,
} from '../../services/themeSyncService';
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
  Eye,
  RotateCcw,
  RotateCw,
  Save,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  SlidersHorizontal,
  FileCode,
  Activity,
  User,
  Settings,
  Flame,
  Radio,
  Clock,
  Briefcase,
  BookOpen,
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

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

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
}

function generateHoneycombNodes(): HexNode[] {
  const nodes: HexNode[] = [];
  const radius = 4;
  const size = 16;

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
        const normalizedAngle = (angle + 360) % 360;
        const sat = Math.min(100, Math.round((dist / radius) * 100));
        const light = Math.max(25, Math.min(75, Math.round(90 - (dist / radius) * 45)));
        const rgb = hslToRgb(normalizedAngle, sat, light);
        nodes.push({ hex: rgbToHex(rgb.r, rgb.g, rgb.b), x, y });
      }
    }
  }
  return nodes;
}

// Pantone-inspired Chromatic Matrix Reference Swatches
const MATRIX_SWATCHES = [
  { name: 'Flame Scarlet', hex: '#E11D48', note: 'PANTONE 18-1662 TCX' },
  { name: 'Imperial Gold', hex: '#D3A625', note: 'PANTONE 14-0848 TCX' },
  { name: 'Marigold Glow', hex: '#F59E0B', note: 'PANTONE 14-1064 TCX' },
  { name: 'Aqua Cyber', hex: '#66CCFF', note: 'PANTONE 14-4318 TCX' },
  { name: 'Velvet Orchid', hex: '#C25D89', note: 'PANTONE 18-2525 TCX' },
  { name: 'Emerald Forest', hex: '#4ADE80', note: 'PANTONE 15-5534 TCX' },
  { name: 'Stealth Slate', hex: '#475569', note: 'PANTONE 18-4005 TCX' },
];

export type GodModeStudioTab =
  | 'design'
  | 'composition'
  | 'motion'
  | 'content'
  | 'system'
  | 'preview-release';

export const MasterGodModeStudio: React.FC = () => {
  // Active Studio Mode (1 of 6 Studios)
  const [activeStudio, setActiveStudio] = useState<GodModeStudioTab>('design');

  // Hierarchy Targets
  const [currentScope, setCurrentScope] = useState<ThemeScope>('global');
  const [currentBreakpoint, setCurrentBreakpoint] = useState<DeviceBreakpoint>('all');
  const [currentTargetKey, setCurrentTargetKey] = useState<string>('all');
  const [currentProperty, setCurrentProperty] = useState<keyof StyleRules>('accent');

  // Live Inspector
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Sync Service Model
  const [themeModel, setThemeModel] = useState<GodModeThemeModel>(() => themeSyncService.getCurrentModel());
  const [currentUser, setCurrentUser] = useState<string>(() => themeSyncService.getActiveUser());

  // History stack for Undo / Redo
  const [historyStack, setHistoryStack] = useState<GodModeThemeModel[]>([]);
  const [redoStack, setRedoStack] = useState<GodModeThemeModel[]>([]);

  // Color picker state
  const [currentHex, setCurrentHex] = useState<string>(() => {
    return themeModel.rules.global.all?.accent || '#D3A625';
  });
  const [inputVal, setInputVal] = useState<string>(currentHex);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [cloudSynced, setCloudSynced] = useState<boolean>(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Named versions list
  const [savedVersions, setSavedVersions] = useState(() => themeSyncService.getSavedVersions());
  const [versionNameInput, setVersionNameInput] = useState<string>('');

  // Device Simulator state for Preview Studio
  const [previewViewport, setPreviewViewport] = useState<'iphone' | 'tablet' | 'laptop' | 'desktop'>('desktop');

  // Content Studio mock state
  const [contentTitles, setContentTitles] = useState({
    dashboard: 'Make your day yours to command.',
    studies: 'Learning, but on your terms.',
    portfolio: 'Two stories. One creative world.',
  });

  // Motion Studio state
  const [motionStiffness, setMotionStiffness] = useState<number>(300);
  const [motionDamping, setMotionDamping] = useState<number>(30);
  const [tactilePress, setTactilePress] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Composition Studio state
  const [containerMaxWidth, setContainerMaxWidth] = useState<string>('1280px');
  const [gridColumns, setGridColumns] = useState<number>(12);
  const [layoutPadding, setLayoutPadding] = useState<string>('24px');

  // Colors and contrast
  const rgb = useMemo(() => hexToRgb(currentHex) || { r: 211, g: 166, b: 37 }, [currentHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const blackContrast = useMemo(() => getContrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb]);
  const whiteContrast = useMemo(() => getContrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb]);

  // Honeycomb nodes memoized
  const honeycombNodes = useMemo(() => generateHoneycombNodes(), []);

  // =========================================================================
  // MATHEMATICALLY PERFECTED 21-STEP TINT & SHADE LADDER (100% to 0%)
  // Monotonic, guaranteed unique steps for ANY color (including pure white & black)
  // =========================================================================
  const tintShadeLadder = useMemo(() => {
    const steps: { pct: number; hex: string; isBase: boolean }[] = [];
    const rawBasePct = Math.round(hsl.l / 5) * 5;
    const basePct = hsl.l >= 98 ? 100 : hsl.l <= 2 ? 0 : Math.max(5, Math.min(95, rawBasePct));

    for (let pct = 100; pct >= 0; pct -= 5) {
      if (pct === basePct) {
        steps.push({ pct, hex: currentHex, isBase: true });
      } else if (pct > basePct) {
        const factor = (pct - basePct) / (100 - basePct);
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
      } else {
        const factor = basePct === 0 ? 0 : pct / basePct;
        const r = Math.round(rgb.r * factor);
        const g = Math.round(rgb.g * factor);
        const b = Math.round(rgb.b * factor);
        steps.push({ pct, hex: rgbToHex(r, g, b), isBase: false });
      }
    }
    return steps;
  }, [rgb, hsl, currentHex]);

  // Subscribe to external sync changes
  useEffect(() => {
    const unsub = themeSyncService.subscribe((updated) => {
      setThemeModel(updated);
    });
    void themeSyncService.initRealtimeSync((updated) => {
      setThemeModel(updated);
      setStatusMessage('Cloud sync: Theme updated from another device');
      setTimeout(() => setStatusMessage(null), 3000);
    });
    return () => unsub();
  }, []);

  // Click-to-inspect listener on live DOM
  useEffect(() => {
    if (!inspectMode) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-theme-id]') as HTMLElement | null;
      if (target) {
        target.style.outline = '2px dashed #D3A625';
        target.style.outlineOffset = '2px';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-theme-id]') as HTMLElement | null;
      if (target) {
        target.style.outline = '';
        target.style.outlineOffset = '';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-theme-id]') as HTMLElement | null;
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        soundFx.playChime();
        const id = target.getAttribute('data-theme-id');
        if (id) {
          setSelectedElementId(id);
          setCurrentScope('element');
          setCurrentTargetKey(id);
          setStatusMessage(`Locked target: #${id}`);
          setTimeout(() => setStatusMessage(null), 2500);
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
    };
  }, [inspectMode]);

  // Apply value to active target
  const applyPropertyValue = useCallback(
    (prop: keyof StyleRules, val: string) => {
      const safe = validateValue(prop, val);
      if (!safe) return;

      // Push history for undo
      setHistoryStack((prev) => [...prev.slice(-30), JSON.parse(JSON.stringify(themeModel))]);
      setRedoStack([]);

      const updated = JSON.parse(JSON.stringify(themeModel)) as GodModeThemeModel;
      if (currentScope === 'global') {
        (updated.rules.global.all as any)[prop] = safe;
      } else {
        updated.rules[currentScope] = updated.rules[currentScope] || {};
        updated.rules[currentScope][currentTargetKey] = updated.rules[currentScope][currentTargetKey] || {};
        updated.rules[currentScope][currentTargetKey][currentBreakpoint] =
          updated.rules[currentScope][currentTargetKey][currentBreakpoint] || {};

        (updated.rules[currentScope][currentTargetKey][currentBreakpoint] as any)[prop] = safe;
      }

      setThemeModel(updated);
      void themeSyncService.saveTheme(updated).then(({ syncedToCloud }) => {
        setCloudSynced(syncedToCloud);
      });
    },
    [themeModel, currentScope, currentTargetKey, currentBreakpoint]
  );

  const handleColorPick = (hex: string) => {
    soundFx.playClick();
    setCurrentHex(hex);
    setInputVal(hex);
    applyPropertyValue(currentProperty, hex);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    soundFx.playClick();
    const prev = historyStack[historyStack.length - 1];
    setRedoStack((r) => [...r, JSON.parse(JSON.stringify(themeModel))]);
    setHistoryStack((h) => h.slice(0, -1));
    setThemeModel(prev);
    themeSyncService.saveTheme(prev);
    setStatusMessage('Undone visual modification');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    soundFx.playClick();
    const next = redoStack[redoStack.length - 1];
    setHistoryStack((h) => [...h, JSON.parse(JSON.stringify(themeModel))]);
    setRedoStack((r) => r.slice(0, -1));
    setThemeModel(next);
    themeSyncService.saveTheme(next);
    setStatusMessage('Redone visual modification');
    setTimeout(() => setStatusMessage(null), 2000);
  };

  const handleSaveNamedVersion = () => {
    if (!versionNameInput.trim()) return;
    soundFx.playChime();
    const list = themeSyncService.saveNamedVersion(versionNameInput.trim());
    setSavedVersions(list);
    setVersionNameInput('');
    setStatusMessage(`Saved version snapshot: "${versionNameInput.trim()}"`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleRestoreVersion = (idx: number) => {
    soundFx.playChime();
    const restored = themeSyncService.restoreVersion(idx);
    if (restored) {
      setThemeModel(restored);
      setStatusMessage(`Restored version: "${savedVersions[idx]?.name}"`);
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const handleExportJson = () => {
    soundFx.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(themeModel, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `gryffindor-godmode-${themeModel.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    dl.click();
    dl.remove();
  };

  const handleExportCss = () => {
    soundFx.playClick();
    const css = compileGodModeCss(themeModel);
    void navigator.clipboard.writeText(css);
    setStatusMessage('Compiled CSS Variables copied to clipboard');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleSwitchUser = (user: 'sreesh' | 'mrithula') => {
    soundFx.playClick();
    setCurrentUser(user);
    localStorage.setItem(
      'sm_auth_user',
      JSON.stringify({
        id: user,
        name: user === 'sreesh' ? 'Sreesh M' : 'Mrithula',
        role: user === 'sreesh' ? 'Lead Systems Architect' : 'Creative Director',
        email: user === 'sreesh' ? 'sreesh716@gmail.com' : 'mrithula@sreeshmrithula.com',
      })
    );
    const userTheme = themeSyncService.loadLocalTheme();
    setThemeModel(userTheme);
    themeSyncService.applyModel(userTheme);
    setStatusMessage(`Switched active workspace profile to ${user === 'sreesh' ? 'Sreesh' : 'Mrithula'}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  return (
    <div id="master-god-mode-controller" className="space-y-6 scroll-mt-24 font-sans text-content-primary">
      {/* =========================================================================
          COMMAND DECK BANNER & MASTER CONTROLLER STATUS
      ========================================================================= */}
      <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card/95 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Dynamic Ambient Flare */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentHex }}
        />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm animate-pulse"
              style={{ backgroundColor: currentHex }}
            />
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
              🦁 GRYFFINDOR OS — MASTER GOD MODE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 font-bold">
              v2.0 PRODUCTION ENGINE
            </span>
            {inspectMode && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse font-bold">
                ● LIVE INSPECTOR ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            One central control center for every color, component, layout, and animation across Gryffindor OS.
            Independent personal profiles for Sreesh & Mrithula with Supabase cloud synchronization.
          </p>

          {/* User Profile Switcher & Device Sync Telemetry */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-elevated border border-border-subtle">
              <span className="text-content-muted pl-2 text-[11px]">PROFILE:</span>
              <button
                type="button"
                onClick={() => handleSwitchUser('sreesh')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentUser === 'sreesh'
                    ? 'bg-gold text-black shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                Sreesh M
              </button>
              <button
                type="button"
                onClick={() => handleSwitchUser('mrithula')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentUser === 'mrithula'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                Mrithula
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-content-muted">
              <span className={`w-2 h-2 rounded-full ${cloudSynced ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              <span>{cloudSynced ? 'Supabase Synced' : 'Offline Storage'}</span>
              <span>•</span>
              <span>Mac • iPhone • Windows</span>
            </div>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary disabled:opacity-30 border border-border-subtle transition-all active:scale-95 shadow-sm"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary disabled:opacity-30 border border-border-subtle transition-all active:scale-95 shadow-sm"
            title="Redo (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setInspectMode(!inspectMode);
            }}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 border active:scale-95 ${
              inspectMode
                ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                : 'bg-gold/15 hover:bg-gold/25 text-gold border-gold/30'
            }`}
            title="Click any element on the live website to inspect and style it"
          >
            <Crosshair className="w-4 h-4" />
            <span>{inspectMode ? 'Inspector ON' : '⚡ Inspect Element'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCss}
            className="px-3.5 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card text-content-primary text-xs font-mono border border-border-subtle transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
            title="Export compiled CSS variables"
          >
            <FileCode className="w-4 h-4 text-gold" />
            <span>Export CSS</span>
          </button>
        </div>
      </div>

      {/* Status Notice Toast */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-gold/15 border border-gold/30 text-gold text-xs font-mono font-bold flex items-center gap-2 animate-fade-in shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* =========================================================================
          THE SIX INTERCONNECTED CONTROL STUDIOS (NAVIGATION TABS)
      ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface-card border border-border-subtle shadow-md">
        {[
          { id: 'design', label: '🎨 Design Studio', desc: 'Colors, Palettes, Typography & Geometry' },
          { id: 'composition', label: '📐 Composition Studio', desc: 'Layouts, Grids & Responsive Spacing' },
          { id: 'motion', label: '✨ Motion Studio', desc: 'Spring Physics, Transitions & 3D' },
          { id: 'content', label: '📝 Content Studio', desc: 'Page Titles, Text & Portfolio Metadata' },
          { id: 'system', label: '⚙️ System Studio', desc: 'Widgets, Modules & Supported Integrations' },
          { id: 'preview-release', label: '🚀 Preview & Release', desc: 'Multi-Device Simulator & Versions' },
        ].map((tab) => {
          const isActive = activeStudio === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveStudio(tab.id as GodModeStudioTab);
              }}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-surface-elevated border border-gold/40 ring-1 ring-gold/20 shadow-md'
                  : 'hover:bg-surface-elevated/40 text-content-muted hover:text-content-primary border border-transparent'
              }`}
            >
              <span className={`text-xs font-mono font-bold block ${isActive ? 'text-gold' : 'text-content-primary'}`}>
                {tab.label}
              </span>
              <span className="text-[10px] text-content-muted block truncate mt-0.5">
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          STUDIO 1: 🎨 DESIGN STUDIO (COLORS, PALETTES, TYPOGRAPHY & GEOMETRY)
      ========================================================================= */}
      {activeStudio === 'design' && (
        <div className="space-y-6 animate-fade-in">
          {/* Target Granularity Deck */}
          <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            {/* Scope Selector */}
            <div className="flex items-center gap-2">
              <span className="text-content-muted font-bold">SCOPE:</span>
              {(['global', 'workspace', 'page', 'component', 'element'] as ThemeScope[]).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentScope(sc);
                  }}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                    currentScope === sc
                      ? 'bg-gold text-black shadow-sm'
                      : 'bg-surface-elevated text-content-muted hover:text-content-primary'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>

            {/* Breakpoint Selector */}
            <div className="flex items-center gap-2">
              <span className="text-content-muted font-bold">BREAKPOINT:</span>
              {(['all', 'desktop', 'tablet', 'mobile'] as DeviceBreakpoint[]).map((bp) => (
                <button
                  key={bp}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentBreakpoint(bp);
                  }}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider text-[11px] font-bold transition-all ${
                    currentBreakpoint === bp
                      ? 'bg-surface-elevated border border-gold text-gold font-extrabold shadow-sm'
                      : 'bg-surface-elevated text-content-muted hover:text-content-primary'
                  }`}
                >
                  {bp}
                </button>
              ))}
            </div>

            {/* Target Property */}
            <div className="flex items-center gap-2">
              <span className="text-content-muted font-bold">PROPERTY:</span>
              <select
                value={currentProperty}
                onChange={(e) => setCurrentProperty(e.target.value as keyof StyleRules)}
                className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-content-primary focus:outline-none focus:border-gold"
              >
                <option value="accent">Primary Accent (--accent-gold)</option>
                <option value="background">Canvas Background (--bg-canvas)</option>
                <option value="card">Cards & Surfaces (--bg-surface-card)</option>
                <option value="text">Primary Text (--text-primary)</option>
                <option value="muted">Muted Text (--text-muted)</option>
                <option value="border">Border Color (--border-subtle)</option>
                <option value="radius">Border Radius</option>
                <option value="font">Typography Font</option>
              </select>
            </div>
          </div>

          {/* Quick Target Modulation Pills (Matching Screenshot #3) */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface-card border border-border-subtle">
            <span className="text-[11px] font-mono text-content-muted font-bold uppercase mr-1">
              Live Modulation:
            </span>
            {[
              { id: 'accent', label: 'Accent', color: themeModel.rules.global.all?.accent || '#D3A625' },
              { id: 'background', label: 'Canvas', color: themeModel.rules.global.all?.background || '#0B0B0C' },
              { id: 'card', label: 'Surfaces', color: themeModel.rules.global.all?.card || '#151518' },
              { id: 'text', label: 'Navbar', color: '#D3A625' },
              { id: 'accent', label: 'Buttons', color: themeModel.rules.global.all?.accent || '#D3A625' },
            ].map((tgt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setCurrentProperty(tgt.id as keyof StyleRules);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                  currentProperty === tgt.id
                    ? 'bg-gold/20 text-gold border-gold/40 shadow-sm'
                    : 'bg-surface-elevated text-content-muted hover:text-content-primary border-border-subtle'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tgt.color }} />
                <span>{tgt.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setInspectMode(!inspectMode);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                inspectMode
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : 'bg-gold/15 hover:bg-gold/25 text-gold border-gold/30'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Click-to-Edit</span>
            </button>
          </div>

          {/* Master 3-Column Studio Deck */}
          <div className="rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-border-subtle bg-surface-card/90 backdrop-blur-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              {/* Left Panel: Honeycomb Wheel & Hex Input */}
              <div className="lg:col-span-4 bg-surface-elevated/70 border border-border-subtle rounded-3xl p-5 shadow-xl space-y-5 backdrop-blur-xl">
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
                          onClick={() => handleColorPick(node.hex)}
                        >
                          <title>{node.hex}</title>
                        </polygon>
                      );
                    })}
                  </svg>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-medium text-content-muted block">
                    Hex or CSS Color Name:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="#66ccff"
                      className="flex-1 bg-surface-card border border-border-subtle rounded-xl px-3 py-2 text-xs font-mono text-content-primary focus:outline-none focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = inputVal.trim();
                        const hex = val.startsWith('#') ? val : `#${val}`;
                        if (hexToRgb(hex)) {
                          handleColorPick(hex);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-gold text-black font-mono text-xs font-bold shadow transition-colors active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Pantone-Inspired Chromatic Matrix Field */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between text-[11px] font-mono text-content-muted">
                    <span className="font-bold text-content-primary flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      PANTONE CHROMATIC FIELD
                    </span>
                    <span>7 Formulas</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {MATRIX_SWATCHES.map((sw) => {
                      const isSel = sw.hex.toLowerCase() === currentHex.toLowerCase();
                      return (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => handleColorPick(sw.hex)}
                          className={`h-9 rounded-xl transition-all flex flex-col justify-end p-1 text-[8px] font-mono ${
                            isSel ? 'ring-2 ring-gold scale-105 shadow-md' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={`${sw.name} • ${sw.hex} (${sw.note})`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Center Panel: Massive Typography & Dual Sliders */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                    Target: {currentScope} • {currentProperty}
                  </span>
                  <h2 className="text-6xl sm:text-7xl font-display font-extrabold tracking-tight select-all">
                    {currentHex.toLowerCase()}
                  </h2>
                  <div className="space-y-0.5 font-mono text-sm text-content-secondary">
                    <p>rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                    <p>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
                  </div>

                  {/* WCAG 2.1 Contrast Telemetry Badges */}
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono font-semibold">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-border-subtle shadow-sm">
                      <span className="text-content-muted">Body text</span>
                      <span className="font-bold text-content-primary">{blackContrast}:1</span>
                      {blackContrast >= 4.5 ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-border-subtle shadow-sm">
                      <span className="text-content-muted">Button text</span>
                      <span className="font-bold text-content-primary">{whiteContrast}:1</span>
                      {whiteContrast >= 4.5 ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Precision Sliders */}
                <div className="bg-surface-elevated/70 border border-border-subtle rounded-3xl p-5 shadow-xl space-y-4 backdrop-blur-xl font-mono text-xs">
                  {/* RGB Channels */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {(['r', 'g', 'b'] as const).map((ch) => (
                      <div key={ch} className="space-y-1">
                        <span className="font-bold uppercase text-content-secondary">{ch}</span>
                        <span className="block text-content-muted">{rgb[ch]}</span>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgb[ch]}
                          onChange={(e) => {
                            const newRgb = { ...rgb, [ch]: Number(e.target.value) };
                            const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
                            handleColorPick(hex);
                          }}
                          className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* HSL Channels */}
                  <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-border-subtle">
                    <div className="space-y-1">
                      <span className="font-bold text-content-secondary">H</span>
                      <span className="block text-content-muted">{hsl.h}°</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hsl.h}
                        onChange={(e) => {
                          const newRgb = hslToRgb(Number(e.target.value), hsl.s, hsl.l);
                          handleColorPick(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full cursor-pointer h-2 rounded-lg appearance-none"
                        style={{
                          background:
                            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-content-secondary">S</span>
                      <span className="block text-content-muted">{hsl.s}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsl.s}
                        onChange={(e) => {
                          const newRgb = hslToRgb(hsl.h, Number(e.target.value), hsl.l);
                          handleColorPick(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-content-secondary">L</span>
                      <span className="block text-content-muted">{hsl.l}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsl.l}
                        onChange={(e) => {
                          const newRgb = hslToRgb(hsl.h, hsl.s, Number(e.target.value));
                          handleColorPick(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                        }}
                        className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: 21-Shades Ladder */}
              <div className="lg:col-span-3 space-y-1.5 bg-surface-elevated/40 border border-border-subtle p-3 rounded-3xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-[11px] font-mono text-content-muted px-2 pb-1 border-b border-border-subtle">
                  <span>21 SHADES LADDER</span>
                  <span>100% → 0%</span>
                </div>
                <div className="space-y-1 max-h-[520px] overflow-y-auto no-scrollbar pr-0.5">
                  {tintShadeLadder.map((step) => {
                    const stepRgb = hexToRgb(step.hex) || { r: 0, g: 0, b: 0 };
                    const isDark = getLuminance(stepRgb.r, stepRgb.g, stepRgb.b) < 0.45;
                    const isSel = step.hex.toLowerCase() === currentHex.toLowerCase();

                    return (
                      <div
                        key={step.pct}
                        onClick={() => handleColorPick(step.hex)}
                        className={`group px-3 py-1.5 rounded-xl flex items-center justify-between font-mono text-xs cursor-pointer transition-all ${
                          isSel ? 'ring-2 ring-gold font-extrabold shadow-lg scale-[1.02] z-10' : 'hover:scale-[1.01]'
                        }`}
                        style={{
                          backgroundColor: step.hex,
                          color: isDark ? '#FFFFFF' : '#000000',
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
                            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
                            title="Copy HEX"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(step.hex);
                              soundFx.playPop();
                              setStatusMessage(`Copied ${step.hex} to clipboard`);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Preset Palettes 1-Click Switch */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-3">
            <span className="text-xs font-mono text-content-muted uppercase tracking-wider block font-bold">
              ORIGINAL SIGNATURE PRESET PALETTES:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {Object.entries(GOD_MODE_PRESETS).map(([name, colors]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    soundFx.playChime();
                    const updated = JSON.parse(JSON.stringify(themeModel)) as GodModeThemeModel;
                    Object.assign(updated.rules.global.all, colors);
                    setThemeModel(updated);
                    setCurrentHex(colors.accent);
                    themeSyncService.saveTheme(updated);
                    setStatusMessage(`Applied ${name} palette globally`);
                    setTimeout(() => setStatusMessage(null), 2500);
                  }}
                  className="p-3 rounded-2xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle text-left transition-all active:scale-95 space-y-2 group shadow-sm"
                >
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: colors.background }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: colors.card }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: colors.accent }} />
                  </div>
                  <span className="text-xs font-mono font-bold block truncate text-content-primary group-hover:text-gold">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDIO 2: 📐 COMPOSITION STUDIO (LAYOUTS, GRIDS & RESPONSIVE SPACING)
      ========================================================================= */}
      {activeStudio === 'composition' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6 animate-fade-in">
          <div className="max-w-2xl space-y-1">
            <h3 className="font-display font-bold text-xl text-content-primary flex items-center gap-2">
              <Layout className="w-5 h-5 text-gold" />
              Composition, Grid Columns & Responsive Constraints
            </h3>
            <p className="text-xs text-content-secondary">
              Configure layout columns, maximum canvas boundaries, card spacing, and mobile stacking hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Grid Columns */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-content-muted">Grid Column System</span>
                <span className="font-bold text-gold">{gridColumns} Cols</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[6, 8, 12, 16].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setGridColumns(col)}
                    className={`py-2 rounded-xl text-center border font-bold transition-all ${
                      gridColumns === col ? 'bg-gold text-black border-gold shadow' : 'bg-surface-card border-border-subtle'
                    }`}
                  >
                    {col} Col
                  </button>
                ))}
              </div>
            </div>

            {/* Container Max Width */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-content-muted">Max Canvas Boundary</span>
                <span className="font-bold text-gold">{containerMaxWidth}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['1120px', '1280px', '1440px', '1680px'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setContainerMaxWidth(w)}
                    className={`py-2 rounded-xl text-center border font-bold transition-all ${
                      containerMaxWidth === w ? 'bg-gold text-black border-gold shadow' : 'bg-surface-card border-border-subtle'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Padding */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-content-muted">Section Insets (Padding)</span>
                <span className="font-bold text-gold">{layoutPadding}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['16px', '24px', '32px', '40px', '48px', '64px'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setLayoutPadding(p);
                      applyPropertyValue('space', p);
                    }}
                    className={`py-2 rounded-xl text-center border font-bold transition-all ${
                      layoutPadding === p ? 'bg-gold text-black border-gold shadow' : 'bg-surface-card border-border-subtle'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDIO 3: ✨ MOTION STUDIO (SPRING PHYSICS, TRANSITIONS & 3D)
      ========================================================================= */}
      {activeStudio === 'motion' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6 animate-fade-in">
          <div className="max-w-2xl space-y-1">
            <h3 className="font-display font-bold text-xl text-content-primary flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" />
              Emil Kowalski Motion Physics & Interaction Standards
            </h3>
            <p className="text-xs text-content-secondary">
              Fluid spring physics, targeted active button press feedback, and 60fps GPU acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Spring Stiffness */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-content-muted">Spring Stiffness</span>
                <span className="font-bold text-gold">{motionStiffness}</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                value={motionStiffness}
                onChange={(e) => setMotionStiffness(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
              />
              <span className="text-[10px] text-content-muted block">
                Controls natural return force on sheets, drawers and dialog dismissals.
              </span>
            </div>

            {/* Spring Damping */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3">
              <div className="flex justify-between">
                <span className="text-content-muted">Spring Damping Ratio</span>
                <span className="font-bold text-gold">{motionDamping}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={motionDamping}
                onChange={(e) => setMotionDamping(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-1.5 bg-surface-card rounded-lg appearance-none"
              />
              <span className="text-[10px] text-content-muted block">
                Higher damping eliminates oscillations for Raycast/Spotlight instantaneous feel.
              </span>
            </div>
          </div>

          {/* Tactile & Reduced Motion Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold block text-content-primary">
                  Selective Tactile Press (transform: scale 0.98)
                </span>
                <span className="text-[11px] text-content-muted block">
                  Only applied to interactive buttons, preserving component transforms.
                </span>
              </div>
              <input
                type="checkbox"
                checked={tactilePress}
                onChange={(e) => setTactilePress(e.target.checked)}
                className="rounded accent-gold w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="p-4 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold block text-content-primary">
                  Reduced Motion Mode (prefers-reduced-motion)
                </span>
                <span className="text-[11px] text-content-muted block">
                  Replaces movement with subtle crossfades for accessibility.
                </span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded accent-gold w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDIO 4: 📝 CONTENT STUDIO (PAGE TEXT, HERO TITLES & METADATA)
      ========================================================================= */}
      {activeStudio === 'content' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6 animate-fade-in">
          <div className="max-w-2xl space-y-1">
            <h3 className="font-display font-bold text-xl text-content-primary flex items-center gap-2">
              <Type className="w-5 h-5 text-gold" />
              Content Studio — Headline & Environment Customizer
            </h3>
            <p className="text-xs text-content-secondary">
              Update visible copy, hero headlines, and environment tags across the three connected environments.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-content-muted block font-bold">1. Dashboard Hero Headline</label>
              <input
                type="text"
                value={contentTitles.dashboard}
                onChange={(e) => setContentTitles({ ...contentTitles, dashboard: e.target.value })}
                className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-content-primary focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-content-muted block font-bold">2. Studies & Academics Headline</label>
              <input
                type="text"
                value={contentTitles.studies}
                onChange={(e) => setContentTitles({ ...contentTitles, studies: e.target.value })}
                className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-content-primary focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-content-muted block font-bold">3. Public Portfolio Headline</label>
              <input
                type="text"
                value={contentTitles.portfolio}
                onChange={(e) => setContentTitles({ ...contentTitles, portfolio: e.target.value })}
                className="w-full bg-surface-elevated border border-border-subtle rounded-xl px-3.5 py-2.5 text-content-primary focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playChime();
                setStatusMessage('Saved content headline overrides to local session');
                setTimeout(() => setStatusMessage(null), 2500);
              }}
              className="px-4 py-2 rounded-xl bg-gold text-black font-bold font-mono transition-all active:scale-95 shadow"
            >
              Save Content Copy
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDIO 5: ⚙️ SYSTEM STUDIO (DASHBOARD WIDGETS & INTEGRATION STATUS)
      ========================================================================= */}
      {activeStudio === 'system' && (
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6 animate-fade-in">
          <div className="max-w-2xl space-y-1">
            <h3 className="font-display font-bold text-xl text-content-primary flex items-center gap-2">
              <Settings className="w-5 h-5 text-gold" />
              System Studio — Dashboard Modules & Integration Status
            </h3>
            <p className="text-xs text-content-secondary">
              Toggle live dashboard widgets, verify device sessions, and audit Supabase database connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Widget Visibility Toggles */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3 font-mono text-xs">
              <span className="font-bold text-content-primary block uppercase">
                Active Dashboard Widgets
              </span>
              {[
                { name: 'Attendance & Clock-In Timer', active: true },
                { name: 'Gryffindor Quest Board & Tasks', active: true },
                { name: 'Focus Mode Pomodoro & Sound Engine', active: true },
                { name: 'Academics & Study Course Manager', active: true },
                { name: 'Financial Runway & Expense Ledger', active: true },
                { name: 'Systems Telemetry HUD (Konami Ready)', active: true },
              ].map((w) => (
                <div key={w.name} className="flex items-center justify-between p-2 rounded-xl bg-surface-card">
                  <span className="text-content-secondary">{w.name}</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>
              ))}
            </div>

            {/* Device & Session Telemetry */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-border-subtle space-y-3 font-mono text-xs">
              <span className="font-bold text-content-primary block uppercase">
                Connected Device Cluster
              </span>
              {[
                { device: 'MacBook Pro 16" M3 Max', os: 'macOS 15 Sequoia', status: 'Online', icon: Laptop },
                { device: 'iPhone 16 Pro Max', os: 'iOS 18.2', status: 'Synced', icon: Smartphone },
                { device: 'HP OMEN 30L Workstation', os: 'Windows 11 Pro', status: 'Active (Current)', icon: Monitor },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.device} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-card">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-gold" />
                      <div>
                        <span className="font-bold text-content-primary block">{d.device}</span>
                        <span className="text-[10px] text-content-muted">{d.os}</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold">{d.status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDIO 6: 🚀 PREVIEW & RELEASE STUDIO (DEVICE SIMULATOR & VERSIONING)
      ========================================================================= */}
      {activeStudio === 'preview-release' && (
        <div className="space-y-6 animate-fade-in">
          {/* Viewport Simulator Control Bar */}
          <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-content-muted font-bold">VIEWPORT:</span>
              {[
                { id: 'iphone', label: 'iPhone (390px)', icon: Smartphone },
                { id: 'tablet', label: 'iPad (768px)', icon: Tablet },
                { id: 'laptop', label: 'MacBook (1280px)', icon: Laptop },
                { id: 'desktop', label: 'Desktop (1920px)', icon: Monitor },
              ].map((v) => {
                const Icon = v.icon;
                const isSel = previewViewport === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPreviewViewport(v.id as any)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                      isSel ? 'bg-gold text-black shadow-sm' : 'bg-surface-elevated text-content-muted hover:text-content-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Version Snapshot Saver */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={versionNameInput}
                onChange={(e) => setVersionNameInput(e.target.value)}
                placeholder="Name this version snapshot..."
                className="bg-surface-elevated border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-content-primary focus:outline-none focus:border-gold w-56"
              />
              <button
                type="button"
                onClick={handleSaveNamedVersion}
                className="px-3.5 py-1.5 rounded-lg bg-gold text-black font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Snapshot</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Preview Frame */}
          <div className="flex justify-center p-6 rounded-3xl bg-black/40 border border-border-subtle overflow-x-auto">
            <div
              className="transition-all duration-300 rounded-3xl border border-white/20 shadow-2xl p-6 space-y-6"
              style={{
                width:
                  previewViewport === 'iphone'
                    ? '390px'
                    : previewViewport === 'tablet'
                    ? '768px'
                    : previewViewport === 'laptop'
                    ? '1024px'
                    : '100%',
                backgroundColor: themeModel.rules.global.all?.background || '#0B0B0C',
                color: themeModel.rules.global.all?.text || '#F5F0E6',
              }}
            >
              {/* Sample Header inside Simulated Preview */}
              <div
                data-theme-component="nav"
                data-theme-id="sample-preview-nav"
                className="p-4 rounded-2xl flex items-center justify-between border border-white/10"
                style={{
                  backgroundColor: themeModel.rules.global.all?.surface || '#141416',
                }}
              >
                <span className="font-display font-bold text-sm tracking-tight">
                  GRYFFINDOR • COMMON ROOM
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: themeModel.rules.global.all?.accent || '#D3A625',
                    color: blackContrast > whiteContrast ? '#000000' : '#FFFFFF',
                  }}
                >
                  LIVE PREVIEW
                </span>
              </div>

              {/* Sample Attendance & Tasks Card */}
              <div
                data-theme-component="card"
                data-theme-id="attendance-card-specimen"
                className="p-5 rounded-2xl border border-white/10 space-y-4 shadow-lg"
                style={{
                  backgroundColor: themeModel.rules.global.all?.card || '#1C1C1F',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-display font-bold text-base">
                      Today's Work Session
                    </h4>
                    <span className="text-xs text-content-muted block">
                      Logged hours: 7h 45m • Target: 8h 00m
                    </span>
                  </div>
                  <button
                    data-theme-component="button"
                    data-theme-id="clock-in-specimen"
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 shadow"
                    style={{
                      backgroundColor: themeModel.rules.global.all?.accent || '#D3A625',
                      color: blackContrast > whiteContrast ? '#000000' : '#FFFFFF',
                    }}
                  >
                    Clock In
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Snapshots List & JSON Export */}
          <div className="p-6 rounded-3xl bg-surface-card border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-content-primary uppercase">
                Saved Version History ({savedVersions.length} Snapshots)
              </span>
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Export Theme JSON</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedVersions.map((v, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="truncate">
                    <span className="font-bold text-content-primary block truncate">{v.name}</span>
                    <span className="text-[10px] text-content-muted">{v.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreVersion(i)}
                    className="px-2.5 py-1 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 font-bold transition-all"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
