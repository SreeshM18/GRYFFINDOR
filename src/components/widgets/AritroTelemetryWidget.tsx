import React, { useState } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';
import { ArrowUpRight, Cpu, Radio, GitCommit, Layers, Terminal } from 'lucide-react';

interface WorkRow {
  year: string;
  title: string;
  category: string;
  client: string;
  lead: 'Sreesh' | 'Mrithula' | 'Both';
  metric: string;
  status: 'production' | 'active' | 'archived';
}

const ARITRO_WORK_ROWS: WorkRow[] = [
  {
    year: '2026',
    title: 'Antigravity Neural OS — Dual Workstation Bridge',
    category: 'Core Systems',
    client: 'Autonomous Research',
    lead: 'Sreesh',
    metric: '< 12ms latency',
    status: 'production',
  },
  {
    year: '2026',
    title: 'Atelier Design Token Architecture & Micro-physics',
    category: 'Design Systems',
    client: 'Design Foundation',
    lead: 'Mrithula',
    metric: '60 FPS Motion',
    status: 'production',
  },
  {
    year: '2025',
    title: 'Aethel Intelligence — Agentic Orchestrator & Multi-LLM Mesh',
    category: 'AI Architecture',
    client: 'Enterprise Suite',
    lead: 'Both',
    metric: '99.4% Eval Pass',
    status: 'active',
  },
  {
    year: '2025',
    title: 'Aether BMW M4 — WebGL Spatial Telemetry & Shaders',
    category: 'Creative Tech',
    client: 'Automotive Showcase',
    lead: 'Sreesh',
    metric: '120 Hz WebGL',
    status: 'production',
  },
  {
    year: '2024',
    title: 'Sreesh × Mrithula Life & Work Operating System v1',
    category: 'Full-Stack Platform',
    client: 'Personal OS',
    lead: 'Both',
    metric: '14 Integrated Modules',
    status: 'archived',
  },
];

export const AritroTelemetryWidget: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filteredRows =
    activeFilter === 'All'
      ? ARITRO_WORK_ROWS
      : ARITRO_WORK_ROWS.filter((r) => r.category.includes(activeFilter) || r.lead === activeFilter);

  return (
    <div className="space-y-6 p-6 rounded-2xl border border-border-subtle bg-surface-card/60 backdrop-blur-xl">
      {/* Header Attribution / Soul of aritro.xyz */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-content-primary">
                Aritro Paul — Telemetry & Work Ledger
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Folder 17 Mirror
              </span>
            </div>
            <p className="text-xs text-content-muted">
              Satoshi Typography, Tabular Numerals, Hardware Telemetry Rows & High-Density Micro-Cards
            </p>
          </div>
        </div>

        {/* Live Hardware Telemetry Chips */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border-subtle text-emerald-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-pulse" />
            60.0 FPS
          </span>
          <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border-subtle text-content-secondary flex items-center gap-1.5">
            <GitCommit className="w-3 h-3 text-content-muted" />
            eff8761
          </span>
          <span className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border-subtle text-content-muted hidden sm:inline">
            GMT+05:30
          </span>
        </div>
      </div>

      {/* Filter Tabs in Aritro's Minimalist Pill Style */}
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Sreesh', 'Mrithula', 'Core Systems', 'Design Systems'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundFx.playClick();
                setActiveFilter(tab);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                activeFilter === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-content-muted hover:text-content-primary hover:bg-surface-elevated border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-content-muted hidden md:inline">
          {filteredRows.length} Ledger Entries
        </span>
      </div>

      {/* Tactile Action Rows (Exact adaptation of Aritro's portfolio-list-row) */}
      <div className="divide-y divide-border-subtle">
        {filteredRows.map((row, idx) => (
          <div
            key={idx}
            onMouseEnter={() => {
              soundFx.playHover();
              setHoveredRow(row.title);
            }}
            onMouseLeave={() => setHoveredRow(null)}
            className={`group py-3.5 px-3 -mx-3 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
              hoveredRow === row.title ? 'bg-surface-elevated/80 pl-4' : 'hover:bg-surface-elevated/40'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Tabular Year */}
              <span className="font-mono text-xs text-content-muted tabular-nums w-10">
                {row.year}
              </span>

              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-medium text-sm text-content-primary group-hover:text-emerald-400 transition-colors">
                    {row.title}
                  </h4>
                  <span className="font-hand text-xs text-emerald-500/80 -rotate-2 hidden lg:inline">
                    ({row.lead})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-content-muted mt-0.5">
                  <span>{row.client}</span>
                  <span>•</span>
                  <span>{row.category}</span>
                </div>
              </div>
            </div>

            {/* Metric & Interactive Arrow */}
            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-surface-card border border-border-subtle text-content-secondary text-[11px]">
                {row.metric}
              </span>
              <div className="w-7 h-7 rounded-lg bg-surface-card border border-border-subtle flex items-center justify-center text-content-muted group-hover:text-emerald-400 group-hover:border-emerald-500/40 group-hover:rotate-45 transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Technical Note */}
      <div className="flex items-center justify-between text-[11px] font-mono text-content-muted pt-2 border-t border-border-subtle">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-emerald-400" />
          font-feature-settings: "cv02", "cv03", "tnum"
        </span>
        <span className="italic">Adapted from Aritro Paul's signature minimal ledger</span>
      </div>
    </div>
  );
};
