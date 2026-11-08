import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons';
import { INITIAL_PROJECTS } from '../../data/initialData';

export const DashboardProjects: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-content-primary">Project Management & Repositories</h1>
        <p className="text-xs text-content-secondary">
          Manage repository linkages, CI/CD status, and public case studies
        </p>
      </div>

      <div className="space-y-4">
        {INITIAL_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl border border-border-subtle bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-bold text-base text-content-primary">{proj.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {proj.status?.toUpperCase() || 'COMPLETED'}
                </span>
              </div>
              <p className="text-xs text-content-secondary max-w-xl">{proj.tagline}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {proj.tags.slice(0, 4).map((t, i) => (
                  <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 text-content-secondary hover:text-content-primary transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 text-content-secondary hover:text-content-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
