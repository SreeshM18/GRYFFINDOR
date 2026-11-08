import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Flame,
  ShieldCheck,
  Download,
  Filter,
  Sparkles,
  Sliders,
  DollarSign,
  Maximize2,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';
import { soundFx } from '../../../components/ui/AudioSynthesizer';
import { workOs } from '../../../services/workOsStorage';
import { UserId } from '../../../types/workOs';
import { CandlestickChart, OHLCData } from '../../../components/charts/CandlestickChart';
import { ActivityHeatmap } from '../../../components/charts/ActivityHeatmap';
import { DonutProgressChart } from '../../../components/charts/DonutProgressChart';
import { AreaTrendChart } from '../../../components/charts/AreaTrendChart';

export const AnalyticsStudioPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [selectedUser, setSelectedUser] = useState<UserId | 'both'>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'attendance' | 'academics' | 'builder'>('overview');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  // Widget visibility toggles for Dashboard Builder
  const [visibleWidgets, setVisibleWidgets] = useState({
    kpiCards: true,
    candlestick: true,
    heatmap: true,
    timeDonut: true,
    trendArea: true,
    academicGauge: true,
  });

  // Sample verified OHLC Bullion Candlestick data (Gold Spot 24K XAU / INR per 10g)
  const goldOhlcData: OHLCData[] = [
    { time: '2026-10-10', open: 76800, high: 77250, low: 76600, close: 77100, volume: 1420 },
    { time: '2026-10-12', open: 77100, high: 77500, low: 76950, close: 77400, volume: 1850 },
    { time: '2026-10-14', open: 77400, high: 77800, low: 77200, close: 77650, volume: 1640 },
    { time: '2026-10-16', open: 77650, high: 77950, low: 77350, close: 77450, volume: 1290 },
    { time: '2026-10-18', open: 77450, high: 78100, low: 77300, close: 77900, volume: 2100 },
    { time: '2026-10-20', open: 77900, high: 78300, low: 77750, close: 78150, volume: 1980 },
    { time: '2026-10-22', open: 78150, high: 78450, low: 77900, close: 78050, volume: 1560 },
    { time: '2026-10-24', open: 78050, high: 78600, low: 77950, close: 78500, volume: 2450 },
    { time: '2026-10-26', open: 78500, high: 78900, low: 78300, close: 78750, volume: 2300 },
    { time: '2026-10-28', open: 78750, high: 79200, low: 78600, close: 79100, volume: 2780 },
    { time: '2026-10-30', open: 79100, high: 79350, low: 78800, close: 78950, volume: 1890 },
    { time: '2026-11-01', open: 78950, high: 79400, low: 78700, close: 79250, volume: 2210 },
    { time: '2026-11-03', open: 79250, high: 79600, low: 79100, close: 79450, volume: 2600 },
    { time: '2026-11-05', open: 79450, high: 79800, low: 79200, close: 79650, volume: 2950 },
    { time: '2026-11-07', open: 79650, high: 80100, low: 79500, close: 79900, volume: 3420 },
  ];

  // Silver (XAG / INR per 1kg)
  const silverOhlcData: OHLCData[] = [
    { time: '2026-10-15', open: 91200, high: 92400, low: 90800, close: 92100, volume: 4300 },
    { time: '2026-10-20', open: 92100, high: 93500, low: 91900, close: 93200, volume: 5100 },
    { time: '2026-10-25', open: 93200, high: 94100, low: 92600, close: 93800, volume: 4800 },
    { time: '2026-10-30', open: 93800, high: 94800, low: 93300, close: 94200, volume: 6200 },
    { time: '2026-11-04', open: 94200, high: 95400, low: 93900, close: 95100, volume: 5900 },
    { time: '2026-11-07', open: 95100, high: 96200, low: 94700, close: 95800, volume: 7100 },
  ];

  const [marketAsset, setMarketAsset] = useState<'gold' | 'silver'>('gold');

  // Trend data for working hours
  const hoursTrendData = [
    { date: '2026-11-01', value: 7.5 },
    { date: '2026-11-02', value: 8.2 },
    { date: '2026-11-03', value: 8.8 },
    { date: '2026-11-04', value: 6.5 },
    { date: '2026-11-05', value: 9.1 },
    { date: '2026-11-06', value: 8.4 },
    { date: '2026-11-07', value: 8.7 },
  ];

  // Donut time allocation
  const timeAllocation = [
    { label: 'Antigravity Neural OS', value: 24, color: '#672B3C' },
    { label: 'Atelier Design Tokens', value: 16, color: '#8B465A' },
    { label: 'Panimalar S7 Prep', value: 12, color: '#3B82F6' },
    { label: 'Studio Architecture', value: 8, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Analytics Studio & Financial Engine
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              TradingView Spec
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Universal visualization suite combining workplace hours, academic tracking, and TradingView-style financial candlesticks.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* User Filter */}
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => setSelectedUser('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'both' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setSelectedUser('sreesh')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'sreesh' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Sreesh
            </button>
            <button
              onClick={() => setSelectedUser('mrithula')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'mrithula' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Mrithula
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'overview' as const, label: 'Overview & Cockpit' },
          { id: 'markets' as const, label: 'Financial Candlesticks' },
          { id: 'attendance' as const, label: 'Workplace Attendance' },
          { id: 'academics' as const, label: 'College Academics' },
          { id: 'builder' as const, label: 'Dashboard Builder' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-burgundy text-burgundy-soft font-bold'
                : 'border-transparent text-content-muted hover:text-content-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & COCKPIT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          {visibleWidgets.kpiCards && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card">
                <div className="text-[10px] font-mono uppercase text-content-muted">Logged Hours (This Week)</div>
                <div className="text-2xl font-bold font-display text-content-primary mt-1">48.5h</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">↑ 12% vs last week</div>
              </div>
              <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card">
                <div className="text-[10px] font-mono uppercase text-content-muted">College Attendance</div>
                <div className="text-2xl font-bold font-display text-emerald-400 mt-1">86.4%</div>
                <div className="text-[10px] font-mono text-content-muted mt-0.5">Threshold: 75% Cutoff</div>
              </div>
              <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card">
                <div className="text-[10px] font-mono uppercase text-content-muted">Sprint Tasks Done</div>
                <div className="text-2xl font-bold font-display text-content-primary mt-1">14 / 18</div>
                <div className="text-[10px] font-mono text-burgundy-soft mt-0.5">78% Velocity</div>
              </div>
              <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card">
                <div className="text-[10px] font-mono uppercase text-content-muted">Gold Spot 24K (10g)</div>
                <div className="text-2xl font-bold font-display text-amber-400 mt-1">₹79,900</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">+₹250 today</div>
              </div>
            </div>
          )}

          {/* 52-Week Contribution Heatmap */}
          {visibleWidgets.heatmap && <ActivityHeatmap />}

          {/* Dual Charts: Time Donut & Area Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleWidgets.trendArea && (
              <AreaTrendChart
                data={hoursTrendData}
                title="Daily Recorded Working Hours (7D Trend)"
                unit="hours"
                color="#8B465A"
              />
            )}
            {visibleWidgets.timeDonut && (
              <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
                <h3 className="font-display font-bold text-sm text-content-primary">
                  Sprint Project Time Allocation
                </h3>
                <DonutProgressChart segments={timeAllocation} totalLabel="Logged Hours" centerValue="60h" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL CANDLESTICKS (TradingView Style) */}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMarketAsset('gold');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  marketAsset === 'gold' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-content-secondary'
                }`}
              >
                Gold Spot (XAU / INR)
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setMarketAsset('silver');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  marketAsset === 'silver' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'text-content-secondary'
                }`}
              >
                Silver Spot (XAG / INR)
              </button>
            </div>

            <span className="text-[10px] font-mono text-content-muted">
              Live Bullion Quota • IST Timezone
            </span>
          </div>

          <CandlestickChart
            data={marketAsset === 'gold' ? goldOhlcData : silverOhlcData}
            instrument={marketAsset === 'gold' ? 'Gold Spot 24K (XAU / INR)' : 'Silver Spot 999 (XAG / INR)'}
            currency="₹"
            height={400}
          />
        </div>
      )}

      {/* TAB 3: ATTENDANCE & OPERATIONS */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
              <span className="text-xs font-mono text-content-muted">Monthly Working Days</span>
              <div className="text-2xl font-bold font-display text-content-primary">22 Days</div>
              <div className="text-[10px] font-mono text-emerald-400">100% Present • 0 Absent</div>
            </div>
            <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
              <span className="text-xs font-mono text-content-muted">Average Working Day</span>
              <div className="text-2xl font-bold font-display text-content-primary">8h 12m</div>
              <div className="text-[10px] font-mono text-content-muted">Break Average: 45 mins</div>
            </div>
            <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
              <span className="text-xs font-mono text-content-muted">Overtime Hours</span>
              <div className="text-2xl font-bold font-display text-burgundy-soft">6.5h</div>
              <div className="text-[10px] font-mono text-emerald-400">Voluntarily recorded</div>
            </div>
          </div>

          <ActivityHeatmap title="Attendance Pattern Heatmap" unitLabel="worked" />
        </div>
      )}

      {/* TAB 4: ACADEMICS */}
      {activeTab === 'academics' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-content-primary">Panimalar Engineering College (Semester 7)</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              University minimum threshold: 75% required attendance to sit for final Anna University theoretical exams.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle">
                <div className="text-[10px] text-content-muted uppercase">Cloud Computing</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">88.5%</div>
                <div className="text-[10px] text-content-muted">Safe margin: +4 classes</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle">
                <div className="text-[10px] text-content-muted uppercase">Deep Learning</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">84.2%</div>
                <div className="text-[10px] text-content-muted">Safe margin: +3 classes</div>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle">
                <div className="text-[10px] text-content-muted uppercase">HCI & UX Design</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">91.0%</div>
                <div className="text-[10px] text-content-muted">Safe margin: +6 classes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DASHBOARD BUILDER */}
      {activeTab === 'builder' && (
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-6">
          <div>
            <h3 className="font-display font-bold text-base text-content-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-burgundy-soft" />
              <span>Interactive Dashboard Customizer</span>
            </h3>
            <p className="text-xs text-content-secondary mt-1">
              Toggle which analytical modules appear on your personal cockpit without modifying source code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'kpiCards' as const, label: 'Executive KPI Cards', desc: 'Hours, Attendance %, Tasks, Bullion' },
              { key: 'candlestick' as const, label: 'TradingView Candlestick Chart', desc: 'OHLC Bullion & Equities' },
              { key: 'heatmap' as const, label: '52-Week Contribution Heatmap', desc: 'GitHub-style activity calendar' },
              { key: 'trendArea' as const, label: 'Daily Work Hours Trend', desc: 'Cubic bezier area chart' },
              { key: 'timeDonut' as const, label: 'Project Time Allocation Donut', desc: 'Multi-segment circular progress' },
            ].map((widget) => {
              const isChecked = visibleWidgets[widget.key];
              return (
                <div
                  key={widget.key}
                  onClick={() => {
                    soundFx.playClick();
                    setVisibleWidgets({ ...visibleWidgets, [widget.key]: !isChecked });
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-burgundy/50 bg-surface-elevated shadow-sm'
                      : 'border-border-subtle bg-surface-card/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-content-primary">
                    <span>{widget.label}</span>
                    {isChecked ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-content-muted" />}
                  </div>
                  <p className="text-[11px] text-content-secondary mt-1">{widget.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border-subtle flex justify-end">
            <button
              onClick={() => {
                soundFx.playChime();
                setActiveTab('overview');
              }}
              className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
            >
              Apply to Cockpit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

