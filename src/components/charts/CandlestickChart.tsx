import React, { useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Maximize2, Minimize2, Eye, EyeOff, Sliders, RefreshCw } from 'lucide-react';
import { soundFx } from '../ui/AudioSynthesizer';

export interface OHLCData {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: OHLCData[];
  title?: string;
  instrument?: string;
  currency?: string;
  height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  title = 'Gold Spot (XAU / INR) — 1D',
  instrument = 'XAU / INR',
  currency = '₹',
  height = 360,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs font-mono text-content-muted">No OHLC data available.</div>;
  }

  // Calculate 10-period SMA
  const smaPeriod = 10;
  const smaValues: (number | null)[] = data.map((_, idx) => {
    if (idx < smaPeriod - 1) return null;
    const slice = data.slice(idx - smaPeriod + 1, idx + 1);
    const sum = slice.reduce((acc, c) => acc + c.close, 0);
    return sum / smaPeriod;
  });

  // Calculate Bounds
  const allHighs = data.map((d) => d.high);
  const allLows = data.map((d) => d.low);
  const maxPrice = Math.max(...allHighs);
  const minPrice = Math.min(...allLows);
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...data.map((d) => d.volume));

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = height;
  const padding = { top: 20, right: 65, bottom: 40, left: 15 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;
  const volumeHeight = showVolume ? chartHeight * 0.22 : 0;
  const priceHeight = chartHeight - volumeHeight - 10;

  const candleSlotWidth = chartWidth / data.length;
  const candleBodyWidth = Math.max(3, candleSlotWidth * 0.65);

  const getY = (val: number) => {
    return padding.top + (1 - (val - minPrice) / priceRange) * priceHeight;
  };

  const getVolY = (vol: number) => {
    const ratio = vol / (maxVolume || 1);
    const base = padding.top + priceHeight + 10 + volumeHeight;
    return { y: base - ratio * volumeHeight, h: ratio * volumeHeight };
  };

  const activeCandle = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];
  const prevClose = hoverIndex !== null && hoverIndex > 0 ? data[hoverIndex - 1].close : data[0].close;
  const isUpDay = activeCandle.close >= activeCandle.open;
  const dayChange = activeCandle.close - prevClose;
  const dayChangePct = ((dayChange / prevClose) * 100).toFixed(2);

  // SMA polyline points
  const smaPoints = smaValues
    .map((val, idx) => {
      if (val === null) return null;
      const x = padding.left + idx * candleSlotWidth + candleSlotWidth / 2;
      const y = getY(val);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const relX = (mouseX / rect.width) * svgWidth - padding.left;
    const idx = Math.floor(relX / candleSlotWidth);
    if (idx >= 0 && idx < data.length) {
      setHoverIndex(idx);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-border-subtle bg-surface-card p-5 space-y-4 shadow-sm ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-auto bg-canvas' : ''
      }`}
    >
      {/* Top Header & Instrument Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-content-primary">{instrument}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted border border-border-subtle">
              TradingView Spec
            </span>
          </div>

          {/* Live Price & Change */}
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-mono text-2xl font-extrabold text-content-primary">
              {currency}{activeCandle.close.toLocaleString()}
            </span>
            <div
              className={`flex items-center gap-1 text-xs font-mono font-semibold ${
                dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {dayChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>
                {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(1)} ({dayChangePct}%)
              </span>
            </div>
            <span className="text-[11px] font-mono text-content-muted ml-2">
              Date: {activeCandle.time}
            </span>
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs font-mono">
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  soundFx.playClick();
                  setTimeframe(tf);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  timeframe === tf ? 'bg-burgundy text-white font-bold' : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Toggle SMA 10 */}
          <button
            onClick={() => {
              soundFx.playClick();
              setShowSMA(!showSMA);
            }}
            className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1 transition-colors ${
              showSMA
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                : 'border-border-subtle bg-surface-elevated text-content-muted'
            }`}
            title="Toggle 10-Period Simple Moving Average (SMA)"
          >
            <span>SMA 10</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary"
            title="Toggle Fullscreen Chart"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* OHLC Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-content-secondary">
        <div>O: <span className="text-content-primary">{activeCandle.open}</span></div>
        <div>H: <span className="text-emerald-400">{activeCandle.high}</span></div>
        <div>L: <span className="text-red-400">{activeCandle.low}</span></div>
        <div>C: <span className={isUpDay ? 'text-emerald-400' : 'text-red-400'}>{activeCandle.close}</span></div>
        {showVolume && <div>Vol: <span className="text-content-primary">{activeCandle.volume.toLocaleString()}</span></div>}
      </div>

      {/* SVG Canvas Chart */}
      <div className="w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = padding.top + pct * priceHeight;
            const price = maxPrice - pct * priceRange;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-border-subtle/50"
                  strokeDasharray="3 3"
                />
                <text
                  x={svgWidth - padding.right + 8}
                  y={y + 4}
                  className="fill-content-muted text-[10px] font-mono"
                >
                  {price.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Volume Baseline Grid */}
          {showVolume && (
            <line
              x1={padding.left}
              y1={padding.top + priceHeight + 10}
              x2={svgWidth - padding.right}
              y2={padding.top + priceHeight + 10}
              stroke="currentColor"
              className="text-border-subtle"
            />
          )}

          {/* Volume Bars */}
          {showVolume &&
            data.map((d, idx) => {
              const { y, h } = getVolY(d.volume);
              const x = padding.left + idx * candleSlotWidth + (candleSlotWidth - candleBodyWidth) / 2;
              const isUp = d.close >= d.open;
              return (
                <rect
                  key={`vol-${idx}`}
                  x={x}
                  y={y}
                  width={candleBodyWidth}
                  height={h}
                  className={isUp ? 'fill-emerald-500/25' : 'fill-red-500/25'}
                />
              );
            })}

          {/* Candlesticks (Wick + Body) */}
          {data.map((d, idx) => {
            const xCenter = padding.left + idx * candleSlotWidth + candleSlotWidth / 2;
            const xBox = padding.left + idx * candleSlotWidth + (candleSlotWidth - candleBodyWidth) / 2;
            const isUp = d.close >= d.open;

            const highY = getY(d.high);
            const lowY = getY(d.low);
            const openY = getY(d.open);
            const closeY = getY(d.close);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));

            const colorClass = isUp ? 'stroke-emerald-400 fill-emerald-500/90' : 'stroke-red-400 fill-red-500/90';

            return (
              <g key={`candle-${idx}`}>
                {/* Upper/Lower Wick */}
                <line
                  x1={xCenter}
                  y1={highY}
                  x2={xCenter}
                  y2={lowY}
                  className={isUp ? 'stroke-emerald-400' : 'stroke-red-400'}
                  strokeWidth="1.2"
                />

                {/* Candle Body */}
                <rect
                  x={xBox}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  rx="1"
                  className={colorClass}
                />
              </g>
            );
          })}

          {/* SMA 10 Line */}
          {showSMA && smaPoints && (
            <polyline
              points={smaPoints}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Active Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={padding.left + hoverIndex * candleSlotWidth + candleSlotWidth / 2}
                y1={padding.top}
                x2={padding.left + hoverIndex * candleSlotWidth + candleSlotWidth / 2}
                y2={svgHeight - padding.bottom}
                stroke="#8B465A"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={padding.left}
                y1={getY(data[hoverIndex].close)}
                x2={svgWidth - padding.right}
                y2={getY(data[hoverIndex].close)}
                stroke="#8B465A"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* Bottom Time Axis Labels */}
          {data
            .filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0)
            .map((d, i) => {
              const idx = data.indexOf(d);
              const x = padding.left + idx * candleSlotWidth;
              return (
                <text
                  key={`time-${i}`}
                  x={x}
                  y={svgHeight - 12}
                  className="fill-content-muted text-[10px] font-mono text-center"
                >
                  {d.time.slice(5)}
                </text>
              );
            })}
        </svg>
      </div>
    </div>
  );
};

