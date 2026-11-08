import React from 'react';
import { Calendar as CalendarIcon, Clock, Award, Rocket } from 'lucide-react';

export const DashboardCalendar: React.FC = () => {
  const events = [
    { title: 'Portfolio Studio V1 Production Release', date: 'Nov 12, 2026', type: 'Launch', icon: Rocket },
    { title: 'National Hackathon Submission Window', date: 'Nov 20, 2026', type: 'Competition', icon: Award },
    { title: 'Bi-Weekly Collaborative Architecture Review', date: 'Nov 24, 2026', type: 'Review', icon: Clock },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-content-primary">Studio Work Calendar</h1>
        <p className="text-xs text-content-secondary">
          Upcoming deadlines, hackathons, and product release milestones
        </p>
      </div>

      <div className="space-y-4">
        {events.map((evt, i) => {
          const Icon = evt.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-surface-elevated text-burgundy-soft">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-content-primary">{evt.title}</h4>
                  <span className="text-[11px] font-mono text-content-muted">{evt.type}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-burgundy-soft">{evt.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

