import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Layers, Cpu, Palette, GitMerge, Award } from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_ACHIEVEMENTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const CollaborationsPage: React.FC = () => {
  const jointProjects = INITIAL_PROJECTS.filter((p) => p.author === 'collaborative');
  const jointAchievements = INITIAL_ACHIEVEMENTS.filter((a) => a.recipient === 'both');

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <GitMerge className="w-3.5 h-3.5" />
          <span>Two Minds. One Shared Creative Space.</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Collaborative Works & Synergy
        </h1>
        <p className="text-sm text-content-secondary leading-relaxed">
          Where Sreesh's systems architecture and autonomous AI converge with Mrithula's human-centered design systems and intuitive user interfaces.
        </p>
      </div>

      {/* Collaboration Synergy Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-sreesh/30 bg-surface-card space-y-3">
          <Cpu className="w-6 h-6 text-sreesh-light" />
          <h3 className="font-display font-semibold text-base text-content-primary">Sreesh's Domain</h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Full-stack infrastructure, agentic AI orchestration, real-time WebSockets, distributed databases, zero-trust security boundaries, and GPU-accelerated WebGL pipelines.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-burgundy-soft/40 bg-surface-elevated/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <Sparkles className="w-6 h-6 text-burgundy-soft" />
            <h3 className="font-display font-semibold text-base text-content-primary">The Studio Intersection</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Design systems translated directly to production code tokens, accessible 60fps micro-animations, unified project management, and end-to-end rapid prototyping.
            </p>
          </div>
          <span className="text-[10px] font-mono text-burgundy-soft uppercase">100% Shared Ambition</span>
        </div>

        <div className="p-6 rounded-2xl border border-mrithula/30 bg-surface-card space-y-3">
          <Palette className="w-6 h-6 text-mrithula-light" />
          <h3 className="font-display font-semibold text-base text-content-primary">Mrithula's Domain</h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Atomic Figma component systems, user empathy research, WCAG AA contrast hierarchies, ergonomic interaction patterns, and editorial brand identity direction.
          </p>
        </div>
      </div>

      {/* Joint Projects Showcase */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-content-primary">Joint Software Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jointProjects.map((project) => (
            <div
              key={project.id}
              className="p-8 rounded-3xl border border-border-strong bg-surface-card space-y-6 flex flex-col justify-between group hover:bg-surface-elevated/70 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase text-burgundy-soft">Collaborative Studio System</span>
                  <span className="text-content-muted">{project.year}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-mono text-content-muted">{project.metrics}</span>
                <Link
                  to={`/work/${project.slug}`}
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
      </div>

      {/* Collaborative Hackathon Awards */}
      {jointAchievements.length > 0 && (
        <div className="p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-burgundy-soft" />
            <h2 className="text-2xl font-display font-bold text-content-primary">Joint Recognition & Awards</h2>
          </div>
          <div className="space-y-4">
            {jointAchievements.map((ach) => (
              <div key={ach.id} className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-content-primary">{ach.title}</span>
                  <span className="text-burgundy-soft">{ach.date}</span>
                </div>
                <p className="text-[11px] font-mono text-content-muted">{ach.issuer}</p>
                <p className="text-xs text-content-secondary pt-1">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
