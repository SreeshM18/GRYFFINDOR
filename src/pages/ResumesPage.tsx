import React, { useState } from 'react';
import { Printer, Check, Copy } from 'lucide-react';
import { PROFILES_DATA, INITIAL_PROJECTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { ProfileId } from '../types';

export const ResumesPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<ProfileId>('sreesh');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const profile = PROFILES_DATA[selectedUser];
  const userProjects = INITIAL_PROJECTS.filter((p) => p.author === selectedUser || p.author === 'collaborative');

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Non-print control toolbar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border-strong bg-surface-card shadow-lg">
        {/* Toggle User */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-content-muted mr-1">Select Candidate:</span>
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                setSelectedUser(id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUser === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {PROFILES_DATA[id].name}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs font-medium text-content-primary hover:bg-surface-elevated/80 transition-colors"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-content-primary text-canvas font-semibold text-xs hover:opacity-90 transition-all shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* ATS-Optimized Resume Document Sheet */}
      <div className="print-page bg-surface-card border border-border-subtle p-8 sm:p-14 rounded-3xl shadow-xl text-content-primary space-y-8 font-sans">
        {/* Header */}
        <header className="border-b border-border-subtle pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            {profile.name}
          </h1>
          <p className="text-sm font-mono text-content-secondary">
            {profile.title}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-content-muted pt-2">
            <span>{profile.email}</span>
            <span>•</span>
            <span>{profile.location}</span>
            {profile.githubUrl && (
              <>
                <span>•</span>
                <span>{profile.githubUrl}</span>
              </>
            )}
            {profile.linkedinUrl && (
              <>
                <span>•</span>
                <span>{profile.linkedinUrl}</span>
              </>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            {profile.bio}
          </p>
        </section>

        {/* Education */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
            Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold text-content-primary">{profile.education.degree}</h3>
              <p className="text-content-secondary">{profile.education.institution}</p>
            </div>
            <span className="text-xs font-mono text-content-muted">{profile.education.period}</span>
          </div>
          {profile.education.details && (
            <p className="text-xs text-content-muted leading-relaxed pt-1">
              {profile.education.details}
            </p>
          )}
        </section>

        {/* Technical Capabilities Matrix */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
            Core Competencies & Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {profile.skills.map((grp, i) => (
              <div key={i} className="space-y-1">
                <span className="font-semibold text-content-primary">{grp.category}:</span>
                <p className="text-content-secondary font-mono text-[11px]">
                  {grp.items.map((s) => s.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Systems & Projects */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
            Key Software Systems & Architectural Projects
          </h2>
          <div className="space-y-4">
            {userProjects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="font-semibold text-sm text-content-primary">
                    {proj.title} <span className="font-normal text-xs text-content-muted">({proj.category.toUpperCase()})</span>
                  </h3>
                  <span className="font-mono text-[11px] text-content-muted">{proj.year}</span>
                </div>
                <p className="text-content-secondary leading-relaxed">
                  {proj.tagline}
                </p>
                {proj.keyFeatures && (
                  <ul className="list-disc list-inside text-content-secondary space-y-0.5 text-[11px]">
                    {proj.keyFeatures.slice(0, 2).map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                )}
                {proj.techStack && (
                  <p className="text-[10px] font-mono text-content-muted pt-0.5">
                    Technologies: {proj.techStack.join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
