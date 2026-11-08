import React, { useState } from 'react';
import { Flame, Trophy, Calendar, Sparkles } from 'lucide-react';
import { soundFx } from '../ui/AudioSynthesizer';

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // intensity metric e.g. minutes or commits
  label?: string;
}

interface ActivityHeatmapProps {
  data?: HeatmapDay[];
  title?: string;
  unitLabel?: string;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  title = 'Annual Consistency & Contribution Heatmap',
  unitLabel = 'logged activity',
}) => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Generate 52 weeks (364 days) leading up to today
  const today = new Date();
  const days: HeatmapDay[] = [];

  const dataMap = new Map<string, number>();
  if (data) {
    data.forEach((d) => dataMap.set(d.date, d.count));
  }

  for (let i = 363; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // Seed realistic activity if no custom data provided
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let baseCount = isWeekend ? (i % 3 === 0 ? 120 : 0) : (i % 7 === 2 ? 0 : 280 + ((i * 37) % 240));
    const count = dataMap.has(dateStr) ? dataMap.get(dateStr)! : baseCount;

    days.push({
      date: dateStr,
      count,
    });
  }

  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  days.forEach((d) => {
    if (d.count > 0) {
      tempStreak += 1;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });
  // Active streak looking backwards from today
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak += 1;
    else break;
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-surface-elevated border-border-subtle';
    if (count < 120) return 'bg-burgundy/30 border-burgundy/40';
    if (count < 240) return 'bg-burgundy/60 border-burgundy/70';
    if (count < 360) return 'bg-burgundy/90 border-burgundy';
    return 'bg-burgundy-soft border-rose-300 text-white';
  };

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-base text-content-primary">{title}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
              52-Week Rolling
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Combined attendance, algorithmic study, and studio commits.
          </p>
        </div>

        {/* Streaks Callout */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-content-muted">Streak:</span>
            <span className="font-bold text-amber-400">{currentStreak} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="text-content-muted">Best:</span>
            <span className="font-bold text-content-primary">{maxStreak} days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] space-y-1.5">
          {/* Months header */}
          <div className="flex justify-between text-[10px] font-mono text-content-muted px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* 52 Columns Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={() => {
                      soundFx.playHover();
                      setHoveredDay(day);
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3 h-3 rounded-sm border transition-all cursor-pointer hover:scale-125 hover:z-10 ${getIntensityClass(
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Active Hover Tooltip */}
      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-border-subtle">
        <div className="text-content-muted">
          {hoveredDay ? (
            <span className="text-content-primary font-semibold">
              {hoveredDay.date}:{' '}
              <span className="text-burgundy-soft font-bold">
                {Math.floor(hoveredDay.count / 60)}h {hoveredDay.count % 60}m {unitLabel}
              </span>
            </span>
          ) : (
            <span>Hover over any day node to inspect details</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px] text-content-muted">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-surface-elevated border border-border-subtle" />
          <div className="w-2.5 h-2.5 rounded-sm bg-burgundy/30 border border-burgundy/40" />
          <div className="w-2.5 h-2.5 rounded-sm bg-burgundy/60 border border-burgundy/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-burgundy/90 border border-burgundy" />
          <div className="w-2.5 h-2.5 rounded-sm bg-burgundy-soft border border-rose-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

