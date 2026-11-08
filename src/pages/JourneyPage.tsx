import React, { useState } from 'react';
import { INITIAL_TIMELINE } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { Milestone, Calendar } from 'lucide-react';

export const JourneyPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'sreesh' | 'mrithula' | 'both'>('all');

  const filtered = INITIAL_TIMELINE.filter((item) => {
    if (filter === 'all') return true;
    return item.recipient === filter || item.recipient === 'both';
  });

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Calendar className="w-3.5 h-3.5" />
          <span>Professional & Collaborative Milestones</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          The Journey
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          Chronological progression across university studies, hackathons, open-source architectures, design releases, and collaborative studio systems.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl border border-border-subtle bg-surface-card w-fit">
        {[
          { id: 'all', label: 'All Milestones' },
          { id: 'sreesh', label: "Sreesh's Timeline" },
          { id: 'mrithula', label: "Mrithula's Timeline" },
          { id: 'both', label: 'Shared Milestones' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setFilter(tab.id as typeof filter);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filter === tab.id
                ? 'bg-surface-elevated text-content-primary border border-border-strong shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-border-strong ml-4 sm:ml-8 space-y-10 pb-12">
        {filtered.map((item) => (
          <div key={item.id} className="relative pl-8 sm:pl-10 space-y-2 group">
            {/* Timeline Node Point */}
            <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-surface-card border-2 border-burgundy-soft group-hover:scale-125 transition-transform flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-burgundy-soft" />
            </div>

            {/* Badge & Year */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-burgundy-soft font-bold text-sm">{item.year}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-surface-elevated border border-border-subtle text-content-muted">
                {item.recipient === 'both'
                  ? 'Joint Milestone'
                  : item.recipient === 'sreesh'
                  ? 'Sreesh M'
                  : 'Mrithula'}
              </span>
              <span className="text-content-muted">{item.organization}</span>
            </div>

            {/* Event Title */}
            <h3 className="text-xl sm:text-2xl font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
              {item.title}
            </h3>

            {/* Event Description */}
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-2xl">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
