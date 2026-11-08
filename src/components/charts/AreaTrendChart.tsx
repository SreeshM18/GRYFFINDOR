import React, { useState } from 'react';
import { soundFx } from '../ui/AudioSynthesizer';

export interface TrendPoint {
  date: string;
  value: number;
  label?: string;
}

interface AreaTrendChartProps {
  data: TrendPoint[];
  title?: string;
  unit?: string;
  height?: number;
  color?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  data,
  title = 'Work Hours Trend',
  unit = 'hrs',
  height = 200,
  color = '#8B465A',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = 0;
  const valRange = maxVal - minVal;

  const svgWidth = 600;
  const svgHeight = height;
  const padding = { top: 20, right: 30, bottom: 30, left: 35 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const stepX = chartW / Math.max(1, data.length - 1);

  const points = data.map((d, i) => {
    const x = padding.left + i * stepX;
    const y = padding.top + (1 - d.value / maxVal) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${
    padding.top + chartH
  } Z`;

  const active = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-card p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <span className="font-display font-bold text-sm text-content-primary">{title}</span>
        <div className="text-xs font-mono">
          <span className="text-content-muted">{active.date}: </span>
          <span className="font-bold text-burgundy-soft">
            {active.value} {unit}
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-pointer"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * svgWidth - padding.left;
            const idx = Math.round(relX / stepX);
            if (idx >= 0 && idx < data.length) setHoveredIdx(idx);
          }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Line */}
          {[0, 0.5, 1].map((pct, i) => {
            const y = padding.top + pct * chartH;
            const labelVal = (maxVal * (1 - pct)).toFixed(0);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-border-subtle/50"
                  strokeDasharray="3 3"
                />
                <text x={padding.left - 8} y={y + 3} className="fill-content-muted text-[10px] font-mono text-right" textAnchor="end">
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Smooth Line Stroke */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

          {/* Hover Crosshair Point */}
          {hoveredIdx !== null && (
            <g>
              <line
                x1={points[hoveredIdx].x}
                y1={padding.top}
                x2={points[hoveredIdx].x}
                y2={padding.top + chartH}
                stroke="#A5A5A5"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={points[hoveredIdx].x}
                cy={points[hoveredIdx].y}
                r="5"
                fill="#F7F5F0"
                stroke={color}
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Bottom Date Labels */}
          {points
            .filter((_, i) => i % Math.max(1, Math.floor(points.length / 5)) === 0)
            .map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={svgHeight - 8}
                className="fill-content-muted text-[10px] font-mono text-center"
                textAnchor="middle"
              >
                {p.date.slice(5)}
              </text>
            ))}
        </svg>
      </div>
    </div>
  );
};
