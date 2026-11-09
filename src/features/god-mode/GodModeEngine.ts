/**
 * GRYFFINDOR GOD MODE: VALIDATED DESIGN-ONLY OVERRIDES FOR REAL UI COMPONENTS
 * Supports global, page, component, and individual element styling across breakpoints.
 */

export const PAGE_BREAKPOINTS = ['all', 'mobile', 'tablet', 'desktop'] as const;
export type Breakpoint = (typeof PAGE_BREAKPOINTS)[number];

export const TARGET_SCOPES = ['site', 'page', 'role', 'element'] as const;
export type TargetScope = (typeof TARGET_SCOPES)[number];

export type DesignProps = Partial<{
  background: string;
  color: string;
  borderColor: string;
  accent: string;
  borderRadius: number;
  borderWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
  padding: number;
  gap: number;
  shadow: number;
  opacity: number;
}>;

export interface DesignRule {
  scope: TargetScope;
  key: string;
  breakpoint: Breakpoint;
  props: DesignProps;
}

export interface GodModeConfig {
  version: 1;
  rules: DesignRule[];
}

export const EMPTY: GodModeConfig = { version: 1, rules: [] };
export type DesignField = keyof DesignProps;

const isColor = (v: unknown): v is string =>
  typeof v === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);

const isKey = (v: unknown): v is string =>
  typeof v === 'string' && /^[\w.:-]{1,90}$/.test(v);

export const FONT_OPTIONS = [
  'Inter, system-ui, sans-serif',
  '"Space Grotesk", sans-serif',
  'Georgia, "Times New Roman", serif',
  'system-ui, -apple-system, sans-serif',
  '"JetBrains Mono", ui-monospace, monospace',
] as const;

export const NUMERIC_RANGE = {
  borderRadius: [0, 64],
  borderWidth: [0, 8],
  fontSize: [10, 120],
  fontWeight: [100, 900],
  letterSpacing: [-3, 12],
  lineHeight: [0.9, 2.4],
  padding: [0, 80],
  gap: [0, 80],
  shadow: [0, 60],
  opacity: [0.2, 1],
} as const;

export function validateProps(value: unknown): DesignProps {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const o = value as Record<string, unknown>;
  const clean: DesignProps = {};

  for (const k of ['background', 'color', 'borderColor', 'accent'] as const) {
    if (isColor(o[k])) clean[k] = o[k] as string;
  }

  if (typeof o.fontFamily === 'string' && FONT_OPTIONS.includes(o.fontFamily as any)) {
    clean.fontFamily = o.fontFamily;
  }

  for (const k of Object.keys(NUMERIC_RANGE) as Array<keyof typeof NUMERIC_RANGE>) {
    const v = o[k];
    if (typeof v === 'number' && Number.isFinite(v) && v >= NUMERIC_RANGE[k][0] && v <= NUMERIC_RANGE[k][1]) {
      (clean as Record<string, unknown>)[k] = v;
    }
  }

  return clean;
}

export function validateConfig(input: unknown): GodModeConfig {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid theme file');
  const data = input as Record<string, unknown>;
  if (data.version !== 1 || !Array.isArray(data.rules) || data.rules.length > 800) {
    throw new Error('Unsupported or oversized theme');
  }

  const rules: DesignRule[] = [];
  for (const item of data.rules) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    if (!TARGET_SCOPES.includes(r.scope as TargetScope) || !PAGE_BREAKPOINTS.includes(r.breakpoint as Breakpoint)) continue;
    if (!isKey(r.key)) continue;
    if (r.scope === 'site' && r.key !== 'root') continue;

    rules.push({
      scope: r.scope as TargetScope,
      key: r.key,
      breakpoint: r.breakpoint as Breakpoint,
      props: validateProps(r.props),
    });
  }
  return { version: 1, rules };
}

const fmt = (n: number) => String(Number(n.toFixed(3)));

function ruleBody(p: DesignProps) {
  const d: string[] = [];
  if (p.background) d.push(`background-color:${p.background}!important`);
  if (p.color) d.push(`color:${p.color}!important`);
  if (p.borderColor) d.push(`border-color:${p.borderColor}!important`);
  if (p.accent) d.push(`--gm-accent:${p.accent}`, `accent-color:${p.accent}!important`, `--accent-gold:${p.accent}`);
  if (p.borderRadius !== undefined) d.push(`border-radius:${fmt(p.borderRadius)}px!important`);
  if (p.borderWidth !== undefined) d.push(`border-width:${fmt(p.borderWidth)}px!important`, 'border-style:solid!important');
  if (p.fontFamily) d.push(`font-family:${p.fontFamily}!important`);
  if (p.fontSize !== undefined) d.push(`font-size:${fmt(p.fontSize)}px!important`);
  if (p.fontWeight !== undefined) d.push(`font-weight:${fmt(p.fontWeight)}!important`);
  if (p.letterSpacing !== undefined) d.push(`letter-spacing:${fmt(p.letterSpacing)}px!important`);
  if (p.lineHeight !== undefined) d.push(`line-height:${fmt(p.lineHeight)}!important`);
  if (p.padding !== undefined) d.push(`padding:${fmt(p.padding)}px!important`);
  if (p.gap !== undefined) d.push(`gap:${fmt(p.gap)}px!important`);
  if (p.shadow !== undefined) d.push(`box-shadow:0 ${fmt(p.shadow / 2)}px ${fmt(p.shadow)}px rgba(0,0,0,0.35)!important`);
  if (p.opacity !== undefined) d.push(`opacity:${fmt(p.opacity)}!important`);
  return d.join(';');
}

function selector(r: DesignRule) {
  if (r.scope === 'site') return 'body, [data-gryffindor-root]';
  if (r.scope === 'page') return `[data-god-page="${r.key}"], [data-gm-page="${r.key}"]`;
  if (r.scope === 'role') return `[data-god-role="${r.key}"], [data-theme-component="${r.key}"]`;
  return `[data-god-id="${r.key}"], [data-theme-id="${r.key}"]`;
}

function mediaQuery(b: Breakpoint, text: string) {
  if (b === 'mobile') return `@media(max-width:767px){${text}}`;
  if (b === 'tablet') return `@media(min-width:768px) and (max-width:1199px){${text}}`;
  if (b === 'desktop') return `@media(min-width:1200px){${text}}`;
  return text;
}

export function compileTheme(config: GodModeConfig) {
  const rules = validateConfig(config).rules;
  const order = { site: 0, page: 1, role: 2, element: 3 };
  return rules
    .sort((a, b) => order[a.scope] - order[b.scope] || (a.breakpoint === 'all' ? -1 : b.breakpoint === 'all' ? 1 : 0))
    .map((r) => {
      const body = ruleBody(r.props);
      return body ? mediaQuery(r.breakpoint, `${selector(r)}{${body}}`) : '';
    })
    .join('\n');
}

export function updateRule(
  config: GodModeConfig,
  scope: TargetScope,
  key: string,
  breakpoint: Breakpoint,
  patch: DesignProps
): GodModeConfig {
  if (!isKey(key)) return config;
  const rules = config.rules.filter((r) => !(r.scope === scope && r.key === key && r.breakpoint === breakpoint));
  const prev = config.rules.find((r) => r.scope === scope && r.key === key && r.breakpoint === breakpoint);
  const props = validateProps({ ...prev?.props, ...patch });
  if (Object.keys(props).length) {
    rules.push({ scope, key, breakpoint, props });
  }
  return validateConfig({ version: 1, rules });
}

export function deleteRule(
  config: GodModeConfig,
  scope: TargetScope,
  key: string,
  breakpoint: Breakpoint
): GodModeConfig {
  return {
    ...config,
    rules: config.rules.filter((r) => !(r.scope === scope && r.key === key && r.breakpoint === breakpoint)),
  };
}

export function mixHex(a: string, b: string, weight: number): string {
  if (!isColor(a) || !isColor(b)) return '#000000';
  const k = Math.min(1, Math.max(0, weight));
  const parts = [1, 3, 5].map((i) =>
    Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - k) + parseInt(b.slice(i, i + 2), 16) * k)
      .toString(16)
      .padStart(2, '0')
  );
  return `#${parts.join('')}`;
}

export function colorLadder(hex: string) {
  return Array.from({ length: 21 }, (_, i) => {
    const pct = 100 - i * 5;
    const color = pct >= 70 ? mixHex(hex, '#ffffff', (pct - 70) / 30) : mixHex(hex, '#000000', (70 - pct) / 70);
    return { pct, color };
  });
}

