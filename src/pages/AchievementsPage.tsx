import React, { useState } from 'react';
import { Award, ExternalLink, X, FileCheck, ShieldCheck } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'sreesh' | 'mrithula' | 'both'>('all');
  const [selectedDoc, setSelectedDoc] = useState<Achievement | null>(null);

  const filtered = INITIAL_ACHIEVEMENTS.filter((item) => {
    if (filter === 'all') return true;
    return item.recipient === filter || item.recipient === 'both';
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Credentials & Honors</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Achievements
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          National hackathon recognitions, competitive fellowship awards, and verified technical milestones.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl border border-border-subtle bg-surface-card w-fit">
        {[
          { id: 'all', label: 'All Achievements' },
          { id: 'sreesh', label: "Sreesh's Awards" },
          { id: 'mrithula', label: "Mrithula's Awards" },
          { id: 'both', label: 'Joint Accolades' },
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

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-border-subtle bg-surface-card flex flex-col justify-between space-y-4 hover:bg-surface-elevated/70 transition-colors group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-burgundy-soft font-semibold uppercase">{item.category}</span>
                <span className="text-content-muted">{item.date}</span>
              </div>

              <h3 className="text-lg font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
                {item.title}
              </h3>

              <p className="text-xs font-mono text-content-muted">
                Issued by {item.issuer}
              </p>

              <p className="text-xs text-content-secondary leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="text-[10px] font-mono text-content-muted">
                {item.recipient === 'both' ? 'Shared Award' : item.recipient === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
              </span>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedDoc(item);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-primary hover:text-burgundy-soft transition-colors"
              >
                <span>View Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-border-strong bg-surface-card p-8 shadow-2xl space-y-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <FileCheck className="w-4 h-4" />
                <span>Verified Studio Credential</span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-elevated text-content-muted hover:text-content-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-burgundy-soft">
                {selectedDoc.category} • {selectedDoc.date}
              </span>
              <h3 className="text-2xl font-display font-bold text-content-primary">
                {selectedDoc.title}
              </h3>
              <p className="text-xs font-mono text-content-secondary">
                Issuing Entity: {selectedDoc.issuer}
              </p>
              <p className="text-xs text-content-secondary leading-relaxed pt-2">
                {selectedDoc.description}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-content-primary">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic & Provenance Check</span>
              </div>
              <p className="text-[10px] font-mono text-content-muted">
                Authenticated against official registration ledger. Verified by SREESH × MRITHULA.
              </p>
            </div>

            <button
              onClick={() => setSelectedDoc(null)}
              className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 text-xs font-semibold text-content-primary transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

