import React from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutProgressChartProps {
  segments: DonutSegment[];
  totalLabel?: string;
  centerValue?: string;
  size?: number;
}

export const DonutProgressChart: React.FC<DonutProgressChartProps> = ({
  segments,
  totalLabel = 'Total Hours',
  centerValue,
  size = 200,
}) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = size * 0.38;
  const strokeWidth = size * 0.14;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border-subtle"
          />
          {segments.map((seg, idx) => {
            const percent = seg.value / total;
            const strokeDashoffset = circumference - percent * circumference;
            const rotation = cumulativePercent * 360;
            cumulativePercent += percent;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-xl text-content-primary">
            {centerValue || `${total}h`}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-content-muted">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs font-mono">
        {segments.map((seg, idx) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-content-secondary min-w-[100px] truncate">{seg.label}:</span>
              <span className="font-bold text-content-primary">{seg.value}h</span>
              <span className="text-content-muted text-[10px]">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
