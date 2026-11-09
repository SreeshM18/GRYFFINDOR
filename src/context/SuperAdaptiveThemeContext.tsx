import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { soundFx } from '../components/ui/AudioSynthesizer';

export interface ThemeTokens {
  canvas: string;
  surface: string;
  panel: string;
  text: string;
  headingColor: string;
  accent: string;
  accentSoft: string;
  muted: string;
  border: string;
  navBg: string;
  navText: string;
  cardBg: string;
  cardText: string;
  buttonBg: string;
  buttonText: string;
  linkColor: string;
  font: string;
  headingFont: string;
  radius: number;
  density: number;
}

export interface ComponentOverride {
  bg?: string;
  text?: string;
  cardBg?: string;
  cardText?: string;
  accent?: string;
  border?: string;
}

export interface ElementOverride {
  bg?: string;
  text?: string;
  border?: string;
  radius?: number;
}

export interface ThemePreset {
  name: string;
  description: string;
  tokens: Partial<ThemeTokens>;
}

export const SUPER_THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Gryffindor Dark Academia',
    description: 'Deep obsidian canvas, dark velvet surface, antique gold accents, and imperial scarlet.',
    tokens: {
      canvas: '#0B0B0C',
      surface: '#141416',
      panel: '#1C1C1E',
      text: '#F5F0E6',
      headingColor: '#F5F0E6',
      accent: '#D3A625',
      accentSoft: '#E6C875',
      muted: '#8A8275',
      border: '#2A2A30',
      navBg: '#0B0B0C',
      navText: '#F5F0E6',
      cardBg: '#151518',
      cardText: '#F5F0E6',
      buttonBg: '#D3A625',
      buttonText: '#0B0B0C',
      linkColor: '#E6C875',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Georgia, serif',
      radius: 16,
      density: 100,
    },
  },
  {
    name: 'Scarlet & Gold Ceremonial',
    description: 'Vivid royal scarlet, bright golden embroidery, and dramatic contrast.',
    tokens: {
      canvas: '#120A0D',
      surface: '#241017',
      panel: '#361520',
      text: '#FFF5E8',
      headingColor: '#FFD700',
      accent: '#FFB800',
      accentSoft: '#FFE082',
      muted: '#C49CA4',
      border: '#4A1D2B',
      navBg: '#180B10',
      navText: '#FFF5E8',
      cardBg: '#2A111A',
      cardText: '#FFF5E8',
      buttonBg: '#FFB800',
      buttonText: '#180B10',
      linkColor: '#FFD54F',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Georgia, serif',
      radius: 20,
      density: 105,
    },
  },
  {
    name: 'Ivory Editorial',
    description: 'Warm natural papyrus, rich espresso ink, and dark wine typography.',
    tokens: {
      canvas: '#F7F4EE',
      surface: '#FFFFFF',
      panel: '#ECE7DD',
      text: '#1C1917',
      headingColor: '#2C1810',
      accent: '#8B2C43',
      accentSoft: '#B24963',
      muted: '#78716C',
      border: '#E2DBD0',
      navBg: '#FFFFFF',
      navText: '#1C1917',
      cardBg: '#FFFFFF',
      cardText: '#1C1917',
      buttonBg: '#8B2C43',
      buttonText: '#FFFFFF',
      linkColor: '#A63351',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Georgia, serif',
      radius: 14,
      density: 95,
    },
  },
  {
    name: 'Midnight Tech',
    description: 'Deep aerospace navy, phosphor cyber-cyan highlights, and sleek low-noise panels.',
    tokens: {
      canvas: '#060B11',
      surface: '#0D1520',
      panel: '#152233',
      text: '#E2F1FF',
      headingColor: '#FFFFFF',
      accent: '#00F0FF',
      accentSoft: '#7DF9FF',
      muted: '#7B98B8',
      border: '#1C3149',
      navBg: '#080E17',
      navText: '#E2F1FF',
      cardBg: '#0F1A28',
      cardText: '#E2F1FF',
      buttonBg: '#00F0FF',
      buttonText: '#060B11',
      linkColor: '#38BDF8',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      radius: 12,
      density: 90,
    },
  },
  {
    name: 'Rose Minimal',
    description: 'Soft dusty velvet rose, muted cashmere backgrounds, and warm graphite typography.',
    tokens: {
      canvas: '#FAF5F7',
      surface: '#FFFFFF',
      panel: '#F3E8EE',
      text: '#372731',
      headingColor: '#2B1A24',
      accent: '#C25D89',
      accentSoft: '#DC89AD',
      muted: '#8A7683',
      border: '#E8D5DF',
      navBg: '#FFFFFF',
      navText: '#372731',
      cardBg: '#FFFFFF',
      cardText: '#372731',
      buttonBg: '#C25D89',
      buttonText: '#FFFFFF',
      linkColor: '#AD4673',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Georgia, serif',
      radius: 18,
      density: 100,
    },
  },
  {
    name: 'Obsidian Monolith',
    description: 'Pure stealth carbon, surgical monochrome scales, and zero visual clutter.',
    tokens: {
      canvas: '#000000',
      surface: '#0A0A0C',
      panel: '#141416',
      text: '#EDEDED',
      headingColor: '#FFFFFF',
      accent: '#E5E5E5',
      accentSoft: '#A3A3A3',
      muted: '#737373',
      border: '#262626',
      navBg: '#000000',
      navText: '#FFFFFF',
      cardBg: '#0A0A0C',
      cardText: '#EDEDED',
      buttonBg: '#FFFFFF',
      buttonText: '#000000',
      linkColor: '#D4D4D4',
      font: 'Inter, system-ui, sans-serif',
      headingFont: 'Inter, system-ui, sans-serif',
      radius: 8,
      density: 85,
    },
  },
];

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  canvas: '#0B0B0C',
  surface: '#141416',
  panel: '#1C1C1E',
  text: '#F5F0E6',
  headingColor: '#F5F0E6',
  accent: '#D3A625',
  accentSoft: '#E6C875',
  muted: '#8A8275',
  border: '#2A2A30',
  navBg: '#0B0B0C',
  navText: '#F5F0E6',
  cardBg: '#151518',
  cardText: '#F5F0E6',
  buttonBg: '#D3A625',
  buttonText: '#0B0B0C',
  linkColor: '#E6C875',
  font: 'Inter, system-ui, sans-serif',
  headingFont: 'Georgia, serif',
  radius: 16,
  density: 100,
};

interface SuperAdaptiveContextType {
  tokens: ThemeTokens;
  componentOverrides: Record<string, ComponentOverride>;
  elementOverrides: Record<string, ElementOverride>;
  designModeActive: boolean;
  selectedElementId: string | null;
  setGlobalToken: <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => void;
  setComponentOverride: (componentId: string, overrides: ComponentOverride) => void;
  setElementOverride: (elementId: string, styles: ElementOverride) => void;
  applyPreset: (presetName: string) => void;
  resetToDefaults: () => void;
  exportCss: () => string;
  exportJson: () => string;
  importJson: (jsonString: string) => boolean;
  toggleDesignMode: () => void;
  selectElement: (elementId: string | null) => void;
}

const SuperAdaptiveContext = createContext<SuperAdaptiveContextType | undefined>(undefined);

const STORAGE_KEY = 'gryffindor_super_adaptive_theme_v2';

export const SuperAdaptiveThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<ThemeTokens>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_THEME_TOKENS, ...(parsed.tokens || {}) };
      }
    } catch {
      // Ignore parse failure
    }
    return DEFAULT_THEME_TOKENS;
  });

  const [componentOverrides, setComponentOverrides] = useState<Record<string, ComponentOverride>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.componentOverrides || {};
      }
    } catch {}
    return {};
  });

  const [elementOverrides, setElementOverrides] = useState<Record<string, ElementOverride>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.elementOverrides || {};
      }
    } catch {}
    return {};
  });

  const [designModeActive, setDesignModeActive] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Sync CSS custom variables to document root whenever state changes
  useEffect(() => {
    const root = document.documentElement;

    // 1. Global Core Tokens
    root.style.setProperty('--bg-canvas', tokens.canvas);
    root.style.setProperty('--bg-surface-card', tokens.cardBg);
    root.style.setProperty('--bg-surface-elevated', tokens.panel);
    root.style.setProperty('--text-primary', tokens.text);
    root.style.setProperty('--text-secondary', tokens.muted);
    root.style.setProperty('--text-muted', tokens.muted);
    root.style.setProperty('--border-subtle', tokens.border);
    root.style.setProperty('--border-strong', tokens.border);
    root.style.setProperty('--accent-gold', tokens.accent);
    root.style.setProperty('--accent-gold-soft', tokens.accentSoft);
    root.style.setProperty('--theme-radius', `${tokens.radius}px`);
    root.style.setProperty('--theme-density', (tokens.density / 100).toString());
    root.style.setProperty('--font-primary', tokens.font);
    root.style.setProperty('--font-display', tokens.headingFont);

    // 2. Component Specific CSS Variables
    Object.entries(componentOverrides).forEach(([comp, ov]) => {
      if (ov.bg) root.style.setProperty(`--comp-${comp}-bg`, ov.bg);
      if (ov.text) root.style.setProperty(`--comp-${comp}-text`, ov.text);
      if (ov.cardBg) root.style.setProperty(`--comp-${comp}-card-bg`, ov.cardBg);
      if (ov.accent) root.style.setProperty(`--comp-${comp}-accent`, ov.accent);
      if (ov.border) root.style.setProperty(`--comp-${comp}-border`, ov.border);
    });

    // 3. Persist State in Local Storage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tokens, componentOverrides, elementOverrides })
      );
    } catch {}
  }, [tokens, componentOverrides, elementOverrides]);

  const setGlobalToken = useCallback(<K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setComponentOverride = useCallback((componentId: string, overrides: ComponentOverride) => {
    soundFx.playClick();
    setComponentOverrides((prev) => ({
      ...prev,
      [componentId]: { ...(prev[componentId] || {}), ...overrides },
    }));
  }, []);

  const setElementOverride = useCallback((elementId: string, styles: ElementOverride) => {
    soundFx.playClick();
    setElementOverrides((prev) => ({
      ...prev,
      [elementId]: { ...(prev[elementId] || {}), ...styles },
    }));

    // Directly apply inline style to the DOM node if found
    const el = document.getElementById(elementId);
    if (el) {
      if (styles.bg) el.style.backgroundColor = styles.bg;
      if (styles.text) el.style.color = styles.text;
      if (styles.border) el.style.borderColor = styles.border;
      if (styles.radius !== undefined) el.style.borderRadius = `${styles.radius}px`;
    }
  }, []);

  const applyPreset = useCallback((presetName: string) => {
    const preset = SUPER_THEME_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;
    soundFx.playChime();
    setTokens((prev) => ({ ...prev, ...preset.tokens }));
  }, []);

  const resetToDefaults = useCallback(() => {
    soundFx.playClick();
    setTokens(DEFAULT_THEME_TOKENS);
    setComponentOverrides({});
    setElementOverrides({});
    localStorage.removeItem(STORAGE_KEY);
    // Remove injected CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--bg-canvas');
    root.style.removeProperty('--bg-surface-card');
    root.style.removeProperty('--bg-surface-elevated');
    root.style.removeProperty('--text-primary');
    root.style.removeProperty('--accent-gold');
    root.style.removeProperty('--accent-gold-soft');
    root.style.removeProperty('--theme-radius');
    root.style.removeProperty('--theme-density');
  }, []);

  const exportCss = useCallback((): string => {
    return `:root {
  /* Gryffindor Super Adaptive Theme Tokens */
  --bg-canvas: ${tokens.canvas};
  --bg-surface-card: ${tokens.cardBg};
  --bg-surface-elevated: ${tokens.panel};
  --text-primary: ${tokens.text};
  --text-secondary: ${tokens.muted};
  --border-subtle: ${tokens.border};
  --accent-gold: ${tokens.accent};
  --accent-gold-soft: ${tokens.accentSoft};
  --theme-radius: ${tokens.radius}px;
  --theme-density: ${tokens.density / 100};
  --font-primary: ${tokens.font};
  --font-display: ${tokens.headingFont};

  /* Independent Component Overrides */
${Object.entries(componentOverrides)
  .map(([comp, o]) =>
    Object.entries(o)
      .map(([k, v]) => `  --comp-${comp}-${k}: ${v};`)
      .join('\n')
  )
  .filter(Boolean)
  .join('\n')}
}`;
  }, [tokens, componentOverrides]);

  const exportJson = useCallback((): string => {
    return JSON.stringify(
      {
        version: '2.0',
        generatedAt: new Date().toISOString(),
        tokens,
        componentOverrides,
        elementOverrides,
      },
      null,
      2
    );
  }, [tokens, componentOverrides, elementOverrides]);

  const importJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        soundFx.playChime();
        if (parsed.tokens) setTokens((prev) => ({ ...prev, ...parsed.tokens }));
        if (parsed.componentOverrides) setComponentOverrides(parsed.componentOverrides);
        if (parsed.elementOverrides) setElementOverrides(parsed.elementOverrides);
        return true;
      }
    } catch {
      // Failed to parse JSON
    }
    return false;
  }, []);

  const toggleDesignMode = useCallback(() => {
    soundFx.playClick();
    setDesignModeActive((prev) => !prev);
    setSelectedElementId(null);
  }, []);

  const selectElement = useCallback((elementId: string | null) => {
    soundFx.playClick();
    setSelectedElementId(elementId);
  }, []);

  return (
    <SuperAdaptiveContext.Provider
      value={{
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
        selectElement,
      }}
    >
      {children}
    </SuperAdaptiveContext.Provider>
  );
};

export const useSuperAdaptiveTheme = (): SuperAdaptiveContextType => {
  const ctx = useContext(SuperAdaptiveContext);
  if (!ctx) {
    throw new Error('useSuperAdaptiveTheme must be used within a SuperAdaptiveThemeProvider');
  }
  return ctx;
};
