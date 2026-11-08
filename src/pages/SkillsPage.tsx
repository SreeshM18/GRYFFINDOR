import React, { useState } from 'react';
import { Cpu, Terminal, Palette, Database, ShieldCheck, Wrench, Sparkles } from 'lucide-react';
import { PROFILES_DATA } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const SkillsPage: React.FC = () => {
  const [filterOwner, setFilterOwner] = useState<'all' | 'sreesh' | 'mrithula'>('all');

  const sreeshSkills = PROFILES_DATA.sreesh.skills;
  const mrithulaSkills = PROFILES_DATA.mrithula.skills;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Terminal className="w-3.5 h-3.5" />
          <span>Technical Capabilities Matrix</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Skills & Proficiencies
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          Ground-truth capabilities demonstrated in shipped production systems and open-source architectures. We present verified competencies rather than subjective percentage meters.
        </p>
      </div>

      {/* Owner Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border-subtle bg-surface-card w-fit">
        {[
          { id: 'all', label: 'All Studio Capabilities' },
          { id: 'sreesh', label: "Sreesh's Skills" },
          { id: 'mrithula', label: "Mrithula's Skills" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playClick();
              setFilterOwner(tab.id as typeof filterOwner);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              filterOwner === tab.id
                ? 'bg-surface-elevated text-content-primary border border-border-strong shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sreesh Skills Section */}
      {(filterOwner === 'all' || filterOwner === 'sreesh') && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sreesh-light" />
            <h2 className="text-2xl font-display font-bold text-content-primary">
              Sreesh M — Systems, AI & Full-Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sreeshSkills.map((group, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
                <h3 className="text-sm font-semibold text-content-primary">{group.category}</h3>
                <div className="space-y-2">
                  {group.items.map((skill, j) => (
                    <div
                      key={j}
                      className="p-2.5 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between text-xs"
                    >
                      <span className="text-content-secondary font-medium">{skill.name}</span>
                      <span className="text-[10px] font-mono text-content-muted">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mrithula Skills Section */}
      {(filterOwner === 'all' || filterOwner === 'mrithula') && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-mrithula-light" />
            <h2 className="text-2xl font-display font-bold text-content-primary">
              Mrithula — Design Systems & Digital Product Craft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mrithulaSkills.map((group, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
                <h3 className="text-sm font-semibold text-content-primary">{group.category}</h3>
                <div className="space-y-2">
                  {group.items.map((skill, j) => (
                    <div
                      key={j}
                      className="p-2.5 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between text-xs"
                    >
                      <span className="text-content-secondary font-medium">{skill.name}</span>
                      <span className="text-[10px] font-mono text-content-muted">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

