import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, ArrowRight, Check, Copy, FileText, ArrowLeftRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';
import { PROFILES_DATA, INITIAL_PROJECTS, INITIAL_TIMELINE } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { ProfileId } from '../types';

export const ProfilePage: React.FC<{ forcedId?: ProfileId }> = ({ forcedId }) => {
  const params = useParams<{ id?: string }>();
  const profileId: ProfileId = forcedId || (params.id === 'mrithula' ? 'mrithula' : 'sreesh');
  const profile = PROFILES_DATA[profileId];
  const otherId: ProfileId = profileId === 'sreesh' ? 'mrithula' : 'sreesh';
  const otherProfile = PROFILES_DATA[otherId];

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'timeline'>('overview');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const projects = INITIAL_PROJECTS.filter((p) => p.author === profileId || p.author === 'collaborative');
  const timeline = INITIAL_TIMELINE.filter((t) => t.recipient === profileId || t.recipient === 'both');

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Profile Header & Dual Switching Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-border-subtle gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: profile.accentColor }}
            />
            <span>Independent Professional Profile</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
            {profile.name}
          </h1>
          <p className="text-sm font-mono text-content-secondary max-w-xl">
            {profile.title}
          </p>
        </div>

        {/* Profile Switcher CTA */}
        <Link
          to={`/${otherId}`}
          onClick={() => soundFx.playClick()}
          className="self-start md:self-center flex items-center gap-3 p-3 px-4 rounded-2xl border border-border-strong bg-surface-card hover:bg-surface-elevated transition-colors group"
        >
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono text-content-muted uppercase">Switch Profile</span>
            <span className="text-xs font-semibold text-content-primary group-hover:text-burgundy-soft transition-colors">
              View {otherProfile.name}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-surface-elevated group-hover:bg-burgundy-soft/20 text-content-primary transition-colors">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Metrics & Quick Action Bar with 3D Perspective Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {profile.stats.map((stat, i) => (
          <PerspectiveCard key={i} intensity={14} glareOpacity={0.25} className="h-full">
            <div className="h-full p-5 rounded-2xl border border-gold/30 bg-surface-card space-y-1 shadow-sm hover:border-gold/60 transition-colors">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-content-primary">
                {stat.value}
              </span>
              <h4 className="text-xs font-semibold text-gold">{stat.label}</h4>
              <p className="text-[10px] font-mono text-content-muted">{stat.sub}</p>
            </div>
          </PerspectiveCard>
        ))}
      </div>

      {/* Profile Actions: Email, Resume, Socials */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border-subtle bg-surface-card/60">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-strong text-xs font-medium text-content-primary transition-colors"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Email Copied!' : profile.email}</span>
          </button>

          <Link
            to="/resumes"
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-strong text-xs font-medium text-content-primary transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-burgundy-soft" />
            <span>Curriculum Vitae</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          <Link
            to="/contact"
            className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
            aria-label="Send direct message"
          >
            <Mail className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        {(['overview', 'skills', 'projects', 'timeline'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tab);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-surface-elevated text-content-primary border border-border-strong shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Biography</h3>
              <p className="text-sm text-content-secondary leading-relaxed sm:text-base">
                {profile.bio}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Core Focus Vectors</h3>
              <div className="space-y-3">
                {profile.focusAreas.map((focus, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border-subtle bg-surface-card flex items-center justify-between text-xs sm:text-sm text-content-primary font-medium"
                  >
                    <span>{focus}</span>
                    <span className="text-[10px] font-mono text-content-muted">0{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Education Card */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Education</h4>
              <div>
                <h5 className="font-semibold text-sm text-content-primary">{profile.education.institution}</h5>
                <p className="text-xs font-mono text-content-secondary">{profile.education.degree}</p>
                <span className="text-[10px] font-mono text-content-muted">{profile.education.period}</span>
              </div>
              {profile.education.details && (
                <p className="text-xs text-content-muted leading-relaxed pt-2 border-t border-border-subtle">
                  {profile.education.details}
                </p>
              )}
            </div>

            {/* Location & Timezone */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Location</h4>
              <p className="text-xs text-content-secondary">{profile.location}</p>
              <p className="text-[10px] font-mono text-content-muted">Timezone: IST (UTC+05:30)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. SKILLS */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.skills.map((skillGroup, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
              <h3 className="text-sm font-display font-bold text-content-primary flex items-center justify-between">
                <span>{skillGroup.category}</span>
                <span className="text-[10px] font-mono text-burgundy-soft">{skillGroup.items.length} Skills</span>
              </h3>
              <div className="space-y-2">
                {skillGroup.items.map((skill, j) => (
                  <div
                    key={j}
                    className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-content-primary">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      {skill.level && (
                        <span className="text-[10px] font-mono text-content-muted px-2 py-0.5 rounded bg-surface-card">
                          {skill.level}
                        </span>
                      )}
                      {skill.verified && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Verified by shipped work" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 3. PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl border border-border-subtle bg-surface-card flex flex-col justify-between space-y-4 group hover:bg-surface-elevated/70 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-burgundy-soft">
                    {proj.category} • {proj.year}
                  </span>
                  <span className="text-[10px] font-mono text-content-muted">
                    {proj.author === 'collaborative' ? 'Joint Project' : 'Solo Work'}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-mono text-content-muted">{proj.metrics}</span>
                <Link
                  to={`/work/${proj.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-primary hover:text-burgundy-soft transition-colors"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 4. TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 max-w-3xl">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="relative pl-8 pb-8 border-l border-border-strong last:border-transparent space-y-2 group"
            >
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-surface-card border-2 border-burgundy-soft group-hover:scale-125 transition-transform" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-burgundy-soft">{item.year}</span>
                <span className="text-xs text-content-muted">• {item.organization}</span>
              </div>
              <h4 className="text-base font-display font-semibold text-content-primary">{item.title}</h4>
              <p className="text-xs text-content-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
