import { supabase, configured } from '../lib/supabase';

// =========================================================================
// TYPES & PERMITTED ALLOWLISTS FOR GRYFFINDOR GOD MODE
// =========================================================================

export type DeviceBreakpoint = 'all' | 'desktop' | 'tablet' | 'mobile';
export type ThemeScope = 'global' | 'workspace' | 'page' | 'component' | 'element';

export interface StyleRules {
  background?: string;
  surface?: string;
  card?: string;
  text?: string;
  muted?: string;
  accent?: string;
  accentText?: string;
  border?: string;
  font?: string;
  fontSize?: string;
  radius?: string;
  space?: string;
  weight?: string;
  shadow?: string;
}

export interface GodModeThemeModel {
  schemaVersion: number;
  name: string;
  revision: number;
  ownerId: string;
  scope: 'personal' | 'shared' | 'public';
  updatedAt: string;
  rules: {
    global: {
      all: StyleRules;
      desktop?: StyleRules;
      tablet?: StyleRules;
      mobile?: StyleRules;
    };
    workspace: Record<string, Partial<Record<DeviceBreakpoint, StyleRules>>>;
    page: Record<string, Partial<Record<DeviceBreakpoint, StyleRules>>>;
    component: Record<string, Partial<Record<DeviceBreakpoint, StyleRules>>>;
    element: Record<string, Partial<Record<DeviceBreakpoint, StyleRules>>>;
  };
}

export interface SavedThemeVersion {
  name: string;
  date: string;
  data: GodModeThemeModel;
}

export const GOD_MODE_FONTS: Record<string, string> = {
  system: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  editorial: 'Georgia, "Times New Roman", serif',
  modern: '"Space Grotesk", "Trebuchet MS", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  humanist: 'Verdana, "Segoe UI", sans-serif',
};

export const GOD_MODE_SHADOWS: Record<string, string> = {
  none: 'none',
  soft: '0 8px 28px rgba(0, 0, 0, 0.18)',
  strong: '0 18px 48px rgba(0, 0, 0, 0.38)',
};

export const GOD_MODE_PRESETS: Record<string, Record<string, string>> = {
  'Gryffindor': {
    background: '#0B0B0C',
    surface: '#141416',
    card: '#1C1C1F',
    text: '#F5F0E6',
    muted: '#8A8275',
    accent: '#D3A625',
    accentText: '#0B0B0C',
    border: '#2A2A30',
  },
  'Flame Scarlet': {
    background: '#1B0C13',
    surface: '#25121B',
    card: '#321723',
    text: '#FFF3F3',
    muted: '#D8AEB7',
    accent: '#E11D48',
    accentText: '#FFFFFF',
    border: '#5C2B3D',
  },
  'Sky Blue': {
    background: '#0B1622',
    surface: '#102030',
    card: '#162C42',
    text: '#E8F5FF',
    muted: '#6A92B4',
    accent: '#66CCFF',
    accentText: '#061320',
    border: '#1F3F5E',
  },
  'Burgundy Velvet': {
    background: '#160E14',
    surface: '#231520',
    card: '#321D2D',
    text: '#FFF0F5',
    muted: '#A68093',
    accent: '#C25D89',
    accentText: '#FFFFFF',
    border: '#4A2A42',
  },
  'Forest Emerald': {
    background: '#0C1613',
    surface: '#13231E',
    card: '#1A322B',
    text: '#F0F7F4',
    muted: '#7E9F94',
    accent: '#4ADE80',
    accentText: '#0A1813',
    border: '#24473D',
  },
  'Ivory Papyrus': {
    background: '#F7F4EE',
    surface: '#FFFFFF',
    card: '#ECE7DD',
    text: '#1C1917',
    muted: '#78716C',
    accent: '#8B2C43',
    accentText: '#FFFFFF',
    border: '#DED5C7',
  },
  'Obsidian Noir': {
    background: '#000000',
    surface: '#0A0A0C',
    card: '#141416',
    text: '#EDEDED',
    muted: '#737373',
    accent: '#E5E5E5',
    accentText: '#000000',
    border: '#262626',
  },
};

export const DEFAULT_GLOBAL_BASE: StyleRules = {
  background: '#0B0B0C',
  surface: '#141416',
  card: '#1C1C1F',
  text: '#F5F0E6',
  muted: '#8A8275',
  accent: '#D3A625',
  accentText: '#0B0B0C',
  border: '#2A2A30',
  font: 'modern',
  fontSize: '16px',
  radius: '16px',
  space: '20px',
  weight: '600',
  shadow: 'none',
};

// =========================================================================
// VALIDATION & SANITIZATION ENGINE (PREVENTS ARBITRARY CSS/JS INJECTION)
// =========================================================================

export function validHex(x: any): string | null {
  if (typeof x !== 'string') return null;
  const s = x.trim();
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    return '#' + [...s.slice(1)].map((c) => c + c).join('').toLowerCase();
  }
  return /^#[0-9a-f]{6}$/i.test(s) ? s.toLowerCase() : null;
}

export function validateValue(prop: keyof StyleRules, value: any): string | null {
  const colorProps = new Set(['background', 'surface', 'card', 'text', 'muted', 'accent', 'accentText', 'border']);
  if (colorProps.has(prop)) {
    return validHex(value);
  }
  if (prop === 'font') {
    return Object.prototype.hasOwnProperty.call(GOD_MODE_FONTS, value) ? value : null;
  }
  if (prop === 'shadow') {
    return Object.prototype.hasOwnProperty.call(GOD_MODE_SHADOWS, value) ? value : null;
  }
  if (prop === 'weight') {
    const n = Number(value);
    return [400, 500, 600, 700, 800].includes(n) ? String(n) : null;
  }
  if (['radius', 'fontSize', 'space'].includes(prop)) {
    const m = String(value).match(/^(\d{1,2})px$/);
    if (!m) return null;
    const n = Number(m[1]);
    const bounds = prop === 'fontSize' ? [12, 56] : prop === 'space' ? [8, 48] : [0, 40];
    return n >= bounds[0] && n <= bounds[1] ? `${n}px` : null;
  }
  return null;
}

export function createFreshThemeModel(ownerId: string = 'sreesh', scope: 'personal' | 'shared' | 'public' = 'personal'): GodModeThemeModel {
  return {
    schemaVersion: 1,
    name: 'Gryffindor Master Theme',
    revision: 1,
    ownerId,
    scope,
    updatedAt: new Date().toISOString(),
    rules: {
      global: { all: { ...DEFAULT_GLOBAL_BASE } },
      workspace: {},
      page: {},
      component: {},
      element: {},
    },
  };
}

export function sanitizeThemeModel(raw: any, fallbackOwner: string = 'sreesh'): GodModeThemeModel {
  if (!raw || typeof raw !== 'object' || raw.schemaVersion !== 1 || !raw.rules) {
    return createFreshThemeModel(fallbackOwner);
  }

  const clean = createFreshThemeModel(raw.ownerId || fallbackOwner, raw.scope || 'personal');
  clean.name = typeof raw.name === 'string' ? raw.name.slice(0, 80) : clean.name;
  clean.revision = typeof raw.revision === 'number' ? raw.revision : 1;

  // Sanitize Global base rules
  const globalSrc = raw.rules?.global || {};
  if (globalSrc.all && typeof globalSrc.all === 'object') {
    for (const [prop, v] of Object.entries(globalSrc.all)) {
      const safe = validateValue(prop as keyof StyleRules, v);
      if (safe !== null) {
        (clean.rules.global.all as any)[prop] = safe;
      }
    }
  }

  // Sanitize granular scopes
  for (const sc of ['workspace', 'page', 'component', 'element'] as const) {
    const src = raw.rules[sc] || {};
    if (typeof src !== 'object') continue;

    for (const [key, bps] of Object.entries(src).slice(0, 150)) {
      if (!/^[a-zA-Z0-9][\w-]{0,59}$/.test(key) || typeof bps !== 'object' || !bps) continue;

      for (const [bp, values] of Object.entries(bps as Record<string, any>)) {
        if (!['all', 'desktop', 'tablet', 'mobile'].includes(bp) || typeof values !== 'object' || !values) continue;

        for (const [prop, v] of Object.entries(values as Record<string, any>)) {
          const safe = validateValue(prop as keyof StyleRules, v);
          if (safe !== null) {
            clean.rules[sc][key] = clean.rules[sc][key] || {};
            clean.rules[sc][key][bp as DeviceBreakpoint] = clean.rules[sc][key][bp as DeviceBreakpoint] || {};
            (clean.rules[sc][key][bp as DeviceBreakpoint] as any)[prop] = safe;
          }
        }
      }
    }
  }

  return clean;
}

// =========================================================================
// CSS COMPILER ENGINE
// =========================================================================

const PROP_TO_VAR: Record<keyof StyleRules, string> = {
  background: '--gm-background',
  surface: '--gm-surface',
  card: '--gm-card',
  text: '--gm-text',
  muted: '--gm-muted',
  accent: '--gm-accent',
  accentText: '--gm-accentText',
  border: '--gm-border',
  font: '--gm-font',
  fontSize: '--gm-fontSize',
  radius: '--gm-radius',
  space: '--gm-space',
  weight: '--gm-weight',
  shadow: '--gm-shadow',
};

function buildSelector(scopeName: ThemeScope, key: string): string {
  const prefix = '[data-gryffindor-root]';
  if (scopeName === 'global') return `${prefix}, :root`;
  if (scopeName === 'workspace') return `${prefix}[data-gm-workspace="${key}"]`;
  if (scopeName === 'page') return `${prefix}[data-gm-page="${key}"]`;
  if (scopeName === 'component') return `${prefix} [data-theme-component="${key}"]`;
  return `${prefix} [data-theme-id="${key}"]`;
}

function compileRules(rules: StyleRules, scopeName: ThemeScope): string {
  const lines: string[] = [];
  for (const [prop, value] of Object.entries(rules)) {
    const p = prop as keyof StyleRules;
    const safe = validateValue(p, value);
    if (!safe) continue;

    const actual = p === 'font' ? GOD_MODE_FONTS[safe] || safe : p === 'shadow' ? GOD_MODE_SHADOWS[safe] || safe : safe;
    lines.push(`${PROP_TO_VAR[p]}: ${actual};`);

    // Direct element/component injection for instant visual lock
    if (scopeName === 'component' || scopeName === 'element') {
      const directMap: Partial<Record<keyof StyleRules, string>> = {
        background: 'background-color',
        surface: 'background-color',
        card: 'background-color',
        text: 'color',
        accentText: 'color',
        border: 'border-color',
        font: 'font-family',
        fontSize: 'font-size',
        radius: 'border-radius',
        space: 'padding',
        weight: 'font-weight',
        shadow: 'box-shadow',
      };
      if (directMap[p]) {
        lines.push(`${directMap[p]}: ${actual};`);
      }
      if (p === 'accent') {
        lines.push(`--accent-gold: ${safe};`);
        lines.push(`--color-primary: ${safe};`);
      }
    }
  }
  return lines.join(' ');
}

export function compileGodModeCss(model: GodModeThemeModel): string {
  const lines: string[] = ['/* GRYFFINDOR MASTER GOD MODE: LIVE COMPILED STYLES */'];
  const medias: Record<DeviceBreakpoint, string[]> = {
    all: [],
    desktop: [],
    tablet: [],
    mobile: [],
  };

  // 1. Compile Global Rules
  if (model.rules.global) {
    for (const [bp, rules] of Object.entries(model.rules.global)) {
      if (!rules) continue;
      const compiled = compileRules(rules as StyleRules, 'global');
      if (compiled && medias[bp as DeviceBreakpoint]) {
        medias[bp as DeviceBreakpoint].push(`${buildSelector('global', 'all')} { ${compiled} }`);
      }
    }
  }

  // 2. Compile Granular Scopes
  for (const sc of ['workspace', 'page', 'component', 'element'] as const) {
    const section = model.rules[sc] || {};
    for (const [key, bps] of Object.entries(section)) {
      if (!bps) continue;
      for (const [bp, rules] of Object.entries(bps)) {
        if (!rules) continue;
        const compiled = compileRules(rules as StyleRules, sc);
        if (compiled && medias[bp as DeviceBreakpoint]) {
          const sel = buildSelector(sc, key);
          medias[bp as DeviceBreakpoint].push(`${sel} { ${compiled} }`);
        }
      }
    }
  }

  lines.push(...medias.all);
  if (medias.desktop.length) {
    lines.push(`@media (min-width: 1025px) {\n  ${medias.desktop.join('\n  ')}\n}`);
  }
  if (medias.tablet.length) {
    lines.push(`@media (min-width: 641px) and (max-width: 1024px) {\n  ${medias.tablet.join('\n  ')}\n}`);
  }
  if (medias.mobile.length) {
    lines.push(`@media (max-width: 640px) {\n  ${medias.mobile.join('\n  ')}\n}`);
  }

  return lines.join('\n');
}

// =========================================================================
// THEME SYNC SERVICE CLASS
// =========================================================================

class ThemeSyncService {
  private LOCAL_STORAGE_KEY = 'gryffindor-godmode-v2';
  private VERSIONS_STORAGE_KEY = 'gryffindor-godmode-versions-v2';
  private styleTag: HTMLStyleElement | null = null;
  private currentModel: GodModeThemeModel;
  private listeners: Set<(model: GodModeThemeModel) => void> = new Set();
  private realtimeChannel: any = null;

  constructor() {
    this.currentModel = this.loadLocalTheme();
    this.ensureStyleTag();
    this.applyModel(this.currentModel);
  }

  private ensureStyleTag() {
    if (typeof document === 'undefined') return;
    let tag = document.getElementById('gryffindor-godmode-style') as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'gryffindor-godmode-style';
      document.head.appendChild(tag);
    }
    this.styleTag = tag;
  }

  public getCurrentModel(): GodModeThemeModel {
    return this.currentModel;
  }

  public getActiveUser(): string {
    try {
      const raw = localStorage.getItem('sm_auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u.id === 'mrithula') return 'mrithula';
      }
    } catch {}
    return 'sreesh';
  }

  // Load theme from browser storage with fallback
  public loadLocalTheme(): GodModeThemeModel {
    const owner = this.getActiveUser();
    try {
      const raw = localStorage.getItem(`${this.LOCAL_STORAGE_KEY}_${owner}`);
      if (raw) {
        return sanitizeThemeModel(JSON.parse(raw), owner);
      }
    } catch (e) {
      console.warn('Local theme read error', e);
    }
    return createFreshThemeModel(owner);
  }

  // Save theme to browser storage and optionally sync to Supabase
  public async saveTheme(model: GodModeThemeModel): Promise<{ syncedToCloud: boolean; revision: number }> {
    this.currentModel = { ...model, revision: model.revision + 1, updatedAt: new Date().toISOString() };
    const owner = this.currentModel.ownerId || this.getActiveUser();

    // 1. Immediate optimistic LocalStorage save
    try {
      localStorage.setItem(`${this.LOCAL_STORAGE_KEY}_${owner}`, JSON.stringify(this.currentModel));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    // 2. Apply styles live to document
    this.applyModel(this.currentModel);
    this.notifyListeners();

    // 3. Supabase Cloud Sync (if configured)
    let syncedToCloud = false;
    if (configured && supabase) {
      try {
        const { error } = await supabase
          .from('user_theme_configs')
          .upsert(
            {
              owner_id: owner,
              scope: this.currentModel.scope,
              name: this.currentModel.name,
              config: this.currentModel,
              revision: this.currentModel.revision,
              updated_at: this.currentModel.updatedAt,
            },
            { onConflict: 'owner_id,scope' }
          );
        if (!error) {
          syncedToCloud = true;
        }
      } catch (err) {
        console.warn('Supabase theme sync skipped or failed', err);
      }
    }

    return { syncedToCloud, revision: this.currentModel.revision };
  }

  // Apply model to live DOM
  public applyModel(model: GodModeThemeModel) {
    this.ensureStyleTag();
    if (this.styleTag) {
      this.styleTag.textContent = compileGodModeCss(model);
    }

    // Set root attribute for selector targeting
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-gryffindor-root', '');

      // Apply primary accent directly to CSS variables
      const globalAccent = model.rules.global.all?.accent;
      if (globalAccent) {
        root.style.setProperty('--accent-gold', globalAccent);
        root.style.setProperty('--color-primary', globalAccent);
      }
      const globalBg = model.rules.global.all?.background;
      if (globalBg) {
        root.style.setProperty('--bg-canvas', globalBg);
      }
      const globalCard = model.rules.global.all?.card;
      if (globalCard) {
        root.style.setProperty('--bg-surface-card', globalCard);
      }
      const globalText = model.rules.global.all?.text;
      if (globalText) {
        root.style.setProperty('--text-primary', globalText);
      }
    }
  }

  // Subscribe to model changes
  public subscribe(listener: (model: GodModeThemeModel) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn(this.currentModel));
  }

  // Connect to Supabase Realtime channel for live sync across devices
  public async initRealtimeSync(onRemoteUpdate?: (updated: GodModeThemeModel) => void) {
    if (!configured || !supabase) return;
    const owner = this.getActiveUser();

    // Pull cloud version on initial connect
    try {
      const { data, error } = await supabase
        .from('user_theme_configs')
        .select('config, revision')
        .eq('owner_id', owner)
        .eq('scope', 'personal')
        .maybeSingle();

      if (data && data.config && data.revision > this.currentModel.revision) {
        const cloudModel = sanitizeThemeModel(data.config, owner);
        this.currentModel = cloudModel;
        this.applyModel(cloudModel);
        this.notifyListeners();
        if (onRemoteUpdate) onRemoteUpdate(cloudModel);
      }
    } catch {}

    // Subscribe to Postgres changes
    try {
      this.realtimeChannel = supabase
        .channel(`god-mode-sync-${owner}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_theme_configs',
            filter: `owner_id=eq.${owner}`,
          },
          (payload: any) => {
            if (payload.new && payload.new.config) {
              const remote = sanitizeThemeModel(payload.new.config, owner);
              if (remote.revision > this.currentModel.revision) {
                this.currentModel = remote;
                this.applyModel(remote);
                this.notifyListeners();
                if (onRemoteUpdate) onRemoteUpdate(remote);
              }
            }
          }
        )
        .subscribe();
    } catch {}
  }

  // Saved Named Versions Management
  public getSavedVersions(): SavedThemeVersion[] {
    try {
      const raw = localStorage.getItem(this.VERSIONS_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return arr.map((item) => ({
            name: String(item.name || 'Untitled').slice(0, 80),
            date: item.date || '',
            data: sanitizeThemeModel(item.data, this.getActiveUser()),
          }));
        }
      }
    } catch {}
    return [];
  }

  public saveNamedVersion(name: string): SavedThemeVersion[] {
    const list = this.getSavedVersions();
    const entry: SavedThemeVersion = {
      name: name.trim().slice(0, 80) || 'Saved Version',
      date: new Date().toLocaleString(),
      data: JSON.parse(JSON.stringify(this.currentModel)),
    };
    list.unshift(entry);
    const trimmed = list.slice(0, 25);
    try {
      localStorage.setItem(this.VERSIONS_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {}
    return trimmed;
  }

  public restoreVersion(idx: number): GodModeThemeModel | null {
    const list = this.getSavedVersions();
    if (list[idx]) {
      this.currentModel = sanitizeThemeModel(list[idx].data, this.getActiveUser());
      this.saveTheme(this.currentModel);
      return this.currentModel;
    }
    return null;
  }
}

export const themeSyncService = new ThemeSyncService();
