import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  colorLadder,
  compileTheme,
  deleteRule,
  EMPTY,
  FONT_OPTIONS,
  GodModeConfig,
  NUMERIC_RANGE,
  TargetScope,
  Breakpoint,
  updateRule,
  validateConfig,
} from './GodModeEngine';
import { themeSyncService } from '../../services/themeSyncService';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import {
  Pipette,
  Sliders,
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Crosshair,
  Maximize2,
  X,
  RotateCcw,
  RotateCw,
  Save,
  Download,
  Upload,
  Layout,
  Type,
  Layers,
  Palette,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import './GryffindorGodMode.css';

interface Props {
  /** Current authenticated user ID, e.g. 'sreesh' or 'mrithula' */
  userId: string;
  /** Current router page ID, e.g. 'attendance', 'dashboard', 'tasks' */
  pageId: string;
  /** Existing app authorization must gate this component before rendering */
  authorized: boolean;
  /** Optional initial theme supplied by authenticated backend */
  initialConfig?: GodModeConfig;
  /** Optional persistence adapter */
  onSave?: (config: GodModeConfig) => Promise<void>;
}

const STORAGE_PREFIX = 'gryffindor:visual-preferences:v2:';

// Mathematical Color Conversions & WCAG Telemetry
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

function hexToRgb(hex: string): RGB {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) cleaned = cleaned.split('').map((c) => c + c).join('');
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return { r: 102, g: 204, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1,
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

// 61 Hexagonal Honeycomb Nodes (Concentric Rings with White Center)
interface HexNode {
  hex: string;
  x: number;
  y: number;
}

function generateHoneycombNodes(): HexNode[] {
  const nodes: HexNode[] = [];
  const radius = 4;
  const size = 15;

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

const PRESETS: Record<string, { background: string; color: string; accent: string }> = {
  'Gryffindor Original': { background: '#0B0B0C', color: '#F5F0E6', accent: '#D3A625' },
  'Flame Scarlet': { background: '#1B0C13', color: '#FFF3F3', accent: '#E11D48' },
  'Aqua Cyber': { background: '#0B1622', color: '#E8F5FF', accent: '#66CCFF' },
  'Burgundy Velvet': { background: '#160E14', color: '#FFF0F5', accent: '#C25D89' },
  'Forest Emerald': { background: '#0C1613', color: '#F0F7F4', accent: '#4ADE80' },
  'Ivory Papyrus': { background: '#F7F4EE', color: '#1C1917', accent: '#8B2C43' },
  'Obsidian Noir': { background: '#000000', color: '#EDEDED', accent: '#E5E5E5' },
};

const PANTONE_SWATCHES = [
  { name: 'Flame Scarlet', hex: '#E11D48' },
  { name: 'Imperial Gold', hex: '#D3A625' },
  { name: 'Aqua Cyber', hex: '#66CCFF' },
  { name: 'Velvet Orchid', hex: '#C25D89' },
  { name: 'Emerald Forest', hex: '#4ADE80' },
  { name: 'Stealth Slate', hex: '#475569' },
];

const NUM_LABELS: Array<[keyof typeof NUMERIC_RANGE, string, number]> = [
  ['fontSize', 'Text size', 1],
  ['fontWeight', 'Font weight', 100],
  ['borderRadius', 'Corner radius', 1],
  ['padding', 'Inner spacing (padding)', 1],
  ['gap', 'Grid / flex gap', 1],
  ['borderWidth', 'Border width', 1],
  ['letterSpacing', 'Letter spacing', 0.1],
  ['lineHeight', 'Line height', 0.1],
  ['shadow', 'Shadow elevation', 1],
  ['opacity', 'Opacity', 0.05],
];

const QUICK_COLOR_TARGETS = [
  { id: 'accent', label: 'Accent' },
  { id: 'background', label: 'Canvas / BG' },
  { id: 'color', label: 'Text' },
  { id: 'borderColor', label: 'Border' },
] as const;

type ColorField = (typeof QUICK_COLOR_TARGETS)[number]['id'];

function localRead(userId: string): GodModeConfig {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return raw ? validateConfig(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function download(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const GryffindorGodMode: React.FC<Props> = ({
  userId,
  pageId,
  authorized,
  initialConfig,
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [inspect, setInspect] = useState(false);
  const [scope, setScope] = useState<TargetScope>('site');
  const [selected, setSelected] = useState<{ id: string; role: string; label?: string } | null>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('all');
  const [tab, setTab] = useState<'colors' | 'type' | 'layout' | 'effects'>('colors');
  const [colorTarget, setColorTarget] = useState<ColorField>('accent');
  const [ladderView, setLadderView] = useState<'list' | 'grid'>('list');

  const [draft, setDraft] = useState<GodModeConfig>(() => {
    if (initialConfig) {
      try {
        return validateConfig(initialConfig);
      } catch {
        return localRead(userId);
      }
    }
    return localRead(userId);
  });

  const [saved, setSaved] = useState<GodModeConfig>(() => {
    if (initialConfig) {
      try {
        return validateConfig(initialConfig);
      } catch {
        return localRead(userId);
      }
    }
    return localRead(userId);
  });

  const [status, setStatus] = useState('Personal workspace theme');
  const history = useRef<GodModeConfig[]>([]);
  const future = useRef<GodModeConfig[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  // Target Key Resolution
  const key =
    scope === 'site'
      ? 'root'
      : scope === 'page'
      ? pageId
      : scope === 'role'
      ? selected?.role || 'card'
      : selected?.id || '';

  const current =
    draft.rules.find((r) => r.scope === scope && r.key === key && r.breakpoint === breakpoint)?.props ?? {};

  // Active color value & mathematics
  const activeHex = ((current[colorTarget] as string) || '#66CCFF').toUpperCase();
  const [hexInput, setHexInput] = useState<string>(activeHex);

  useEffect(() => {
    setHexInput(activeHex);
  }, [activeHex]);

  const rgb = useMemo(() => hexToRgb(activeHex), [activeHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const blackContrast = useMemo(() => getContrastRatio(rgb, { r: 0, g: 0, b: 0 }), [rgb]);
  const whiteContrast = useMemo(() => getContrastRatio(rgb, { r: 255, g: 255, b: 255 }), [rgb]);
  const honeycombNodes = useMemo(() => generateHoneycombNodes(), []);
  const ladder = useMemo(() => colorLadder(activeHex), [activeHex]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const css = useMemo(() => compileTheme(draft), [draft]);

  useEffect(() => {
    const next = initialConfig ? validateConfig(initialConfig) : localRead(userId);
    setDraft(next);
    setSaved(next);
    history.current = [];
    future.current = [];
    setSelected(null);
    setInspect(false);
  }, [userId]);

  // Inject compiled theme rules directly into head
  useEffect(() => {
    if (!authorized) return;
    let style = document.querySelector<HTMLStyleElement>('#gryffindor-live-design-rules');
    if (!style) {
      style = document.createElement('style');
      style.id = 'gryffindor-live-design-rules';
      document.head.appendChild(style);
    }
    style.textContent = css;
  }, [css, authorized]);

  // Visual inspection state class on body
  useEffect(() => {
    document.body.classList.toggle('gm-inspecting', authorized && open && inspect);
    return () => document.body.classList.remove('gm-inspecting');
  }, [authorized, open, inspect]);

  // Handle live DOM selection on actual rendered page
  useEffect(() => {
    if (!authorized || !open || !inspect) return;

    const handle = (event: MouseEvent) => {
      const node = event.target as HTMLElement;
      if (node.closest('[data-god-ui]')) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      soundFx.playChime();

      let target: HTMLElement | null = node.closest<HTMLElement>('[data-god-id], [data-theme-id]');
      if (!target) {
        target =
          node.closest<HTMLElement>(
            'button, nav, aside, header, footer, section, article, .card, [class*="card"], [class*="panel"]'
          ) || node;
      }

      let elementId = target.dataset.godId || target.dataset.themeId || target.id;
      if (!elementId) {
        elementId = `elem-${target.tagName.toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;
        target.setAttribute('data-god-id', elementId);
      }

      const elementRole =
        target.dataset.godRole ||
        target.dataset.themeComponent ||
        target.tagName.toLowerCase();

      setSelected({
        id: elementId,
        role: elementRole,
        label: target.innerText?.slice(0, 20) || elementId,
      });
      setScope('element');
      setInspect(false);
      setStatus(`Target locked: #${elementId} (${elementRole})`);
    };

    const cancel = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setInspect(false);
    };

    document.addEventListener('click', handle, true);
    document.addEventListener('keydown', cancel);
    return () => {
      document.removeEventListener('click', handle, true);
      document.removeEventListener('keydown', cancel);
    };
  }, [authorized, open, inspect]);

  const modify = useCallback(
    (patch: Record<string, number | string>) => {
      if (!key) {
        setStatus('Click "◎ Select on page" to lock an element first');
        return;
      }
      history.current = [...history.current.slice(-39), draft];
      future.current = [];
      setDraft((x) => updateRule(x, scope, key, breakpoint, patch));
      setStatus('Live preview • unsaved modifications');
    },
    [draft, key, scope, breakpoint]
  );

  const modifyColor = (hex: string) => {
    modify({ [colorTarget]: hex });
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    modifyColor(rgbToHex(r, g, b));
  };

  const handleHslChange = (h: number, s: number, l: number) => {
    const res = hslToRgb(h, s, l);
    modifyColor(rgbToHex(res.r, res.g, res.b));
  };

  const pickFromScreen = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          soundFx.playChime();
          modifyColor(result.sRGBHex);
          setStatus(`Eyedropper picked ${result.sRGBHex}`);
        }
      } catch {
        // User cancelled
      }
    } else {
      setStatus('EyeDropper not supported in this browser; click honeycomb or enter hex');
    }
  };

  function undo() {
    const prev = history.current.pop();
    if (!prev) return;
    soundFx.playClick();
    future.current.push(draft);
    setDraft(prev);
    setStatus('Undone');
  }

  function redo() {
    const next = future.current.pop();
    if (!next) return;
    soundFx.playClick();
    history.current.push(draft);
    setDraft(next);
    setStatus('Redone');
  }

  async function persist() {
    soundFx.playChime();
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(draft));
      if (onSave) {
        await onSave(draft);
      }
      setSaved(draft);
      setStatus('✓ Successfully saved and synchronized');
    } catch {
      setStatus('Error saving preferences');
    }
  }

  function resetCurrent() {
    soundFx.playClick();
    history.current.push(draft);
    future.current = [];
    setDraft((x) => deleteRule(x, scope, key, breakpoint));
    setStatus(`Cleared overrides for ${scope}:${key}`);
  }

  if (!authorized) return null;

  return (
    <aside className="gm-namespace" data-god-ui aria-label="Gryffindor Master God Mode">
      {/* Floating Launch Button across all pages */}
      {!open && (
        <button
          type="button"
          className="gm-launch"
          onClick={() => {
            soundFx.playPop();
            setOpen(true);
          }}
          aria-expanded="false"
          aria-label="Open Master God Mode customization drawer"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>✦ Customize</span>
        </button>
      )}

      {/* Slide-over God Mode Control Drawer */}
      {open && (
        <div className="gm-drawer" role="region" aria-label="Visual Theme Engine">
          {/* Header */}
          <div className="gm-head">
            <div>
              <strong>
                <Sparkles className="w-4 h-4 text-gold" />
                <span>MASTER GOD MODE</span>
              </strong>
              <small>Live System-Wide Visual & Element Controller</small>
            </div>
            <div className="gm-head-actions">
              <button
                type="button"
                className={`gm-head-btn ${inspect ? 'gm-active-tool' : ''}`}
                title={inspect ? 'Click an element on screen (ESC to cancel)' : 'Select on page (Click-to-Edit)'}
                onClick={() => {
                  soundFx.playClick();
                  setInspect((x) => !x);
                }}
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="gm-head-btn"
                disabled={!history.current.length}
                title="Undo (Ctrl+Z)"
                onClick={undo}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="gm-head-btn"
                disabled={!future.current.length}
                title="Redo (Ctrl+Y)"
                onClick={redo}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="gm-head-btn"
                title="Close drawer"
                onClick={() => {
                  soundFx.playClick();
                  setOpen(false);
                  setInspect(false);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="gm-body">
            {/* Live Inspection Active Banner */}
            {inspect && (
              <div className="gm-inspect-banner gm-inspecting-mode">
                <div>
                  <strong>◎ INSPECT MODE ACTIVE</strong>
                  <p className="text-[10px] text-content-muted mt-0.5">
                    Click any element, card, or button on the page to customize it.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-surface-elevated text-[11px] font-bold text-white border border-border-subtle"
                  onClick={() => setInspect(false)}
                >
                  Done
                </button>
              </div>
            )}

            {/* Quick Target Scope Pills (Matching Screenshot #2/3) */}
            <div className="gm-quick-targets">
              {QUICK_COLOR_TARGETS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`gm-target-pill ${colorTarget === t.id ? 'gm-target-active' : ''}`}
                  onClick={() => {
                    soundFx.playClick();
                    setColorTarget(t.id);
                  }}
                >
                  <span
                    className="gm-target-swatch"
                    style={{ backgroundColor: (current[t.id] as string) || '#D3A625' }}
                  />
                  <span>{t.label}</span>
                </button>
              ))}
              <button
                type="button"
                className={`gm-target-pill ${inspect ? 'gm-target-active' : ''}`}
                onClick={() => {
                  soundFx.playClick();
                  setInspect(true);
                }}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Click-to-Edit</span>
              </button>
            </div>

            {/* Editing Scope Hierarchy */}
            <div className="gm-scope-grid">
              {(
                [
                  ['site', 'Entire OS'],
                  ['page', `Page (${pageId})`],
                  ['role', selected?.role ? `Type (${selected.role})` : 'Class Type'],
                  ['element', selected ? `#${selected.id}` : 'This Element'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`gm-scope-btn ${scope === id ? 'gm-active' : ''}`}
                  onClick={() => {
                    soundFx.playClick();
                    setScope(id);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Responsive Breakpoint Selector */}
            <div className="gm-device-bar">
              {(
                [
                  ['all', 'All Screens', Monitor],
                  ['desktop', 'Desktop', Laptop],
                  ['tablet', 'Tablet', Tablet],
                  ['mobile', 'Mobile', Smartphone],
                ] as const
              ).map(([bp, label, Icon]) => (
                <button
                  key={bp}
                  type="button"
                  className={`gm-device-btn ${breakpoint === bp ? 'gm-active' : ''}`}
                  onClick={() => {
                    soundFx.playClick();
                    setBreakpoint(bp);
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Studio Navigation Tabs */}
            <div className="gm-tabs" role="group" aria-label="Appearance properties">
              {([
                ['colors', 'Colors', Palette],
                ['type', 'Typography', Type],
                ['layout', 'Layout', Layout],
                ['effects', 'Effects', Layers],
              ] as const).map(([id, name, Icon]) => (
                <button
                  type="button"
                  key={id}
                  className={tab === id ? 'gm-current' : ''}
                  onClick={() => {
                    soundFx.playClick();
                    setTab(id);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* TAB 1: COLORS (HONEYCOMB + SLIDERS + 21-SHADES LADDER) */}
            {tab === 'colors' && (
              <section className="space-y-4">
                {/* Honeycomb Card */}
                <div className="gm-honeycomb-card">
                  <div className="gm-honeycomb-svg-wrap">
                    <svg viewBox="-85 -85 170 170" className="gm-honeycomb-svg">
                      {honeycombNodes.map((node, i) => {
                        const isSelected = node.hex.toLowerCase() === activeHex.toLowerCase();
                        return (
                          <polygon
                            key={i}
                            points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6"
                            transform={`translate(${node.x}, ${node.y})`}
                            fill={node.hex}
                            stroke={isSelected ? '#D3A625' : 'rgba(255,255,255,0.18)'}
                            strokeWidth={isSelected ? 2.5 : 0.8}
                            className="gm-honeycomb-cell"
                            onClick={() => {
                              soundFx.playClick();
                              modifyColor(node.hex);
                            }}
                          >
                            <title>{node.hex}</title>
                          </polygon>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Hex Input & Eyedropper */}
                  <div className="gm-hex-bar">
                    <input
                      type="text"
                      className="gm-hex-input"
                      value={hexInput}
                      placeholder="#66CCFF"
                      onChange={(e) => setHexInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="gm-ok-btn"
                      onClick={() => {
                        const val = hexInput.trim();
                        const hex = val.startsWith('#') ? val : `#${val}`;
                        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
                          soundFx.playClick();
                          modifyColor(hex);
                        }
                      }}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="gm-eyedropper-btn"
                      title="Sample color from screen"
                      onClick={pickFromScreen}
                    >
                      <Pipette className="w-4 h-4" />
                    </button>
                    <div
                      className="gm-color-swatch-preview"
                      style={{ backgroundColor: activeHex }}
                    />
                  </div>
                </div>

                {/* Massive Color Readout & WCAG Contrast Badges (Matching Screenshot #1) */}
                <div className="gm-readout-card">
                  <h2 className="gm-big-hex">{activeHex.toLowerCase()}</h2>
                  <div className="gm-sub-telemetry">
                    <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                    <span>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                  </div>
                  <div className="gm-contrast-row">
                    <div className="gm-contrast-badge">
                      <span>Black text <strong>{blackContrast}:1</strong></span>
                      {blackContrast >= 4.5 ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <div className="gm-contrast-badge">
                      <span>White text <strong>{whiteContrast}:1</strong></span>
                      {whiteContrast >= 4.5 ? (
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* RGB & HSL Channels Sliders (Matching Screenshot #1) */}
                <div className="gm-sliders-deck">
                  {/* R Channel */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span className="gm-channel-dot" style={{ backgroundColor: '#EF4444' }} />
                      <span>R</span>
                      <span className="gm-channel-val">{rgb.r}</span>
                      <span className="gm-channel-hex">{rgb.r.toString(16).padStart(2, '0')}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.r}
                      className="gm-slider-track"
                      onChange={(e) => handleRgbChange(Number(e.target.value), rgb.g, rgb.b)}
                    />
                  </div>

                  {/* G Channel */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span className="gm-channel-dot" style={{ backgroundColor: '#10B981' }} />
                      <span>G</span>
                      <span className="gm-channel-val">{rgb.g}</span>
                      <span className="gm-channel-hex">{rgb.g.toString(16).padStart(2, '0')}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.g}
                      className="gm-slider-track"
                      onChange={(e) => handleRgbChange(rgb.r, Number(e.target.value), rgb.b)}
                    />
                  </div>

                  {/* B Channel */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span className="gm-channel-dot" style={{ backgroundColor: '#3B82F6' }} />
                      <span>B</span>
                      <span className="gm-channel-val">{rgb.b}</span>
                      <span className="gm-channel-hex">{rgb.b.toString(16).padStart(2, '0')}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb.b}
                      className="gm-slider-track"
                      onChange={(e) => handleRgbChange(rgb.r, rgb.g, Number(e.target.value))}
                    />
                  </div>

                  {/* H (Hue) Slider */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span>H</span>
                      <span className="gm-channel-val">{hsl.h}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hsl.h}
                      className="gm-slider-track gm-hue-slider"
                      onChange={(e) => handleHslChange(Number(e.target.value), hsl.s, hsl.l)}
                    />
                  </div>

                  {/* S (Saturation) Slider */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span>S</span>
                      <span className="gm-channel-val">{hsl.s}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hsl.s}
                      className="gm-slider-track"
                      onChange={(e) => handleHslChange(hsl.h, Number(e.target.value), hsl.l)}
                    />
                  </div>

                  {/* L (Lightness) Slider */}
                  <div className="gm-slider-row">
                    <div className="gm-slider-label">
                      <span>L</span>
                      <span className="gm-channel-val">{hsl.l}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={hsl.l}
                      className="gm-slider-track"
                      onChange={(e) => handleHslChange(hsl.h, hsl.s, Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 21-Shades Tint & Shade Ladder Header */}
                <div className="gm-ladder-header">
                  <span className="gm-label" style={{ margin: 0 }}>
                    21-Step Tint & Shade Ladder
                  </span>
                  <div className="gm-view-toggle">
                    <button
                      type="button"
                      className={ladderView === 'list' ? 'gm-active-view' : ''}
                      onClick={() => setLadderView('list')}
                    >
                      Vertical List
                    </button>
                    <button
                      type="button"
                      className={ladderView === 'grid' ? 'gm-active-view' : ''}
                      onClick={() => setLadderView('grid')}
                    >
                      3-Row Grid
                    </button>
                  </div>
                </div>

                {/* 21-Shades Ladder: Mode 1 - Vertical List (Matching Screenshot #1) */}
                {ladderView === 'list' && (
                  <div className="gm-vertical-ladder">
                    {ladder.map(({ pct, color }) => {
                      const isSelected = color.toLowerCase() === activeHex.toLowerCase();
                      return (
                        <div
                          key={pct}
                          className={`gm-ladder-row ${isSelected ? 'gm-ladder-active' : ''}`}
                          onClick={() => {
                            soundFx.playClick();
                            modifyColor(color);
                          }}
                        >
                          <div className="gm-ladder-left">
                            <span className="gm-ladder-swatch" style={{ backgroundColor: color }} />
                            <span className="gm-ladder-hex font-mono">{color.toLowerCase()}</span>
                          </div>
                          <div className="gm-ladder-right">
                            <span className="gm-ladder-pct font-mono">{pct}%</span>
                            <button
                              type="button"
                              className="gm-ladder-copy"
                              title="Copy hex code"
                              onClick={(e) => {
                                e.stopPropagation();
                                soundFx.playPop();
                                navigator.clipboard.writeText(color);
                                setStatus(`Copied ${color} (${pct}%) to clipboard`);
                              }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 21-Shades Ladder: Mode 2 - 3-Row Grid (Matching Screenshot #2/3) */}
                {ladderView === 'grid' && (
                  <div className="gm-grid-ladder">
                    {ladder.map(({ pct, color }) => {
                      const isSelected = color.toLowerCase() === activeHex.toLowerCase();
                      return (
                        <button
                          key={pct}
                          type="button"
                          className={`gm-grid-ladder-btn ${isSelected ? 'gm-grid-active' : ''}`}
                          style={{
                            backgroundColor: color,
                            color: pct > 55 ? '#000000' : '#ffffff',
                          }}
                          onClick={() => {
                            soundFx.playClick();
                            modifyColor(color);
                          }}
                          title={`${color} (${pct}%)`}
                        >
                          <span>{pct}%</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pantone Signature Swatches */}
                <p className="gm-label">Pantone Chromatic Swatches</p>
                <div className="gm-pantone-grid">
                  {PANTONE_SWATCHES.map((sw) => (
                    <button
                      key={sw.name}
                      type="button"
                      className="gm-pantone-btn"
                      title={`${sw.name} • ${sw.hex}`}
                      style={{ backgroundColor: sw.hex }}
                      onClick={() => {
                        soundFx.playClick();
                        modifyColor(sw.hex);
                      }}
                    />
                  ))}
                </div>

                {/* Gryffindor Signature Presets */}
                <p className="gm-label">Gryffindor Signature Palettes</p>
                <div className="gm-presets">
                  {Object.entries(PRESETS).map(([name, colors]) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => {
                        soundFx.playChime();
                        history.current.push(draft);
                        future.current = [];
                        setDraft((x) => updateRule(x, 'site', 'root', 'all', colors));
                        setScope('site');
                        setBreakpoint('all');
                        setStatus(`${name} applied globally; component overrides preserved`);
                      }}
                    >
                      <span style={{ backgroundColor: colors.background, borderColor: colors.accent }} />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 2: TYPOGRAPHY */}
            {tab === 'type' && (
              <section className="space-y-4">
                <label className="gm-label" htmlFor="gm-font">
                  Font Family
                </label>
                <select
                  id="gm-font"
                  value={(current.fontFamily as string) || ''}
                  onChange={(e) => modify({ fontFamily: e.target.value })}
                >
                  <option value="">Default (Inter, system-ui)</option>
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f.replace(/"/g, '')}
                    </option>
                  ))}
                </select>

                {NUM_LABELS.filter(([k]) =>
                  ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'].includes(k)
                ).map(([prop, label, step]) => (
                  <label key={prop} className="gm-range">
                    <span>
                      {label}
                      <output>{current[prop] ?? 'Default'}</output>
                    </span>
                    <input
                      type="range"
                      min={NUMERIC_RANGE[prop][0]}
                      max={NUMERIC_RANGE[prop][1]}
                      step={step}
                      value={(current[prop] as number) ?? NUMERIC_RANGE[prop][0]}
                      onChange={(e) => modify({ [prop]: Number(e.target.value) })}
                    />
                  </label>
                ))}
              </section>
            )}

            {/* TAB 3: LAYOUT & SPACING */}
            {tab === 'layout' && (
              <section className="space-y-4">
                {NUM_LABELS.filter(([k]) =>
                  ['borderRadius', 'padding', 'gap', 'borderWidth'].includes(k)
                ).map(([prop, label, step]) => (
                  <label key={prop} className="gm-range">
                    <span>
                      {label}
                      <output>{current[prop] ? `${current[prop]}px` : 'Default'}</output>
                    </span>
                    <input
                      type="range"
                      min={NUMERIC_RANGE[prop][0]}
                      max={NUMERIC_RANGE[prop][1]}
                      step={step}
                      value={(current[prop] as number) ?? NUMERIC_RANGE[prop][0]}
                      onChange={(e) => modify({ [prop]: Number(e.target.value) })}
                    />
                  </label>
                ))}
              </section>
            )}

            {/* TAB 4: EFFECTS & ELEVATION */}
            {tab === 'effects' && (
              <section className="space-y-4">
                {NUM_LABELS.filter(([k]) => ['shadow', 'opacity'].includes(k)).map(
                  ([prop, label, step]) => (
                    <label key={prop} className="gm-range">
                      <span>
                        {label}
                        <output>{current[prop] ?? 'Default'}</output>
                      </span>
                      <input
                        type="range"
                        min={NUMERIC_RANGE[prop][0]}
                        max={NUMERIC_RANGE[prop][1]}
                        step={step}
                        value={(current[prop] as number) ?? NUMERIC_RANGE[prop][1]}
                        onChange={(e) => modify({ [prop]: Number(e.target.value) })}
                      />
                    </label>
                  )
                )}
              </section>
            )}

            {/* Clear Rules for Current Target */}
            <button
              type="button"
              className="gm-foot-btn w-full mt-4"
              onClick={resetCurrent}
              style={{ width: '100%' }}
            >
              Reset this target to default styles
            </button>
          </div>

          {/* Drawer Footer */}
          <div className="gm-foot">
            <div role="status">
              <span>{isDirty ? '● Unsaved adjustments' : '✓ Synchronized'}</span> · {status}
            </div>
            <div className="gm-foot-actions">
              <button
                type="button"
                className="gm-foot-btn"
                title="Download JSON configuration"
                onClick={() => {
                  soundFx.playClick();
                  download(`gryffindor-theme-${userId}.json`, JSON.stringify(draft, null, 2));
                }}
              >
                <Download className="w-3.5 h-3.5 inline mr-1" />
                Export
              </button>
              <button
                type="button"
                className="gm-foot-btn gm-foot-save"
                onClick={persist}
              >
                <Save className="w-3.5 h-3.5 inline mr-1" />
                Save & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default GryffindorGodMode;
