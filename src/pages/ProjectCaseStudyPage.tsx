import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import { INITIAL_PROJECTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const ProjectCaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = INITIAL_PROJECTS.find((p) => p.slug === slug || p.id === slug);

  if (!project) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-3xl font-display font-bold text-content-primary">Case Study Not Found</h1>
        <p className="text-xs text-content-secondary">The requested project case study could not be located.</p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-soft hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <button
        onClick={() => {
          soundFx.playClick();
          navigate(-1);
        }}
        className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-content-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Case Study Header */}
      <div className="space-y-4 border-b border-border-subtle pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="uppercase text-burgundy-soft">{project.category} • {project.year}</span>
          <span className="px-3 py-1 rounded-full bg-surface-elevated border border-border-subtle text-content-muted">
            {project.author === 'collaborative'
              ? 'Collaborative Project'
              : project.author === 'sreesh'
              ? 'Architected by Sreesh M'
              : 'Designed by Mrithula'}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          {project.title}
        </h1>
        <p className="text-lg text-content-secondary font-sans leading-relaxed">
          {project.tagline}
        </p>

        {/* Project Links */}
        <div className="flex items-center gap-3 pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-strong bg-surface-card hover:bg-surface-elevated text-xs font-medium text-content-primary transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Repository</span>
            </a>
          )}
          {project.liveUrl && project.liveUrl !== '#' && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-xs font-medium text-white transition-colors"
            >
              <span>Live Deployment</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Metric Highlight Card */}
      {project.metrics && (
        <div className="p-6 rounded-2xl border border-border-strong bg-surface-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-content-muted">Performance Metric</span>
            <p className="text-xl sm:text-2xl font-display font-bold text-content-primary">{project.metrics}</p>
          </div>
          <Sparkles className="w-6 h-6 text-burgundy-soft" />
        </div>
      )}

      {/* Case Study Narrative Sections */}
      <div className="space-y-10 text-sm leading-relaxed text-content-secondary">
        {/* Overview */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">System Overview</h2>
          <p className="text-content-primary text-base sm:text-lg leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* Challenge */}
        {project.challenge && (
          <section className="space-y-3 p-6 rounded-2xl border border-border-subtle bg-surface-card">
            <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">The Engineering Challenge</h2>
            <p className="text-content-secondary">
              {project.challenge}
            </p>
          </section>
        )}

        {/* Solution */}
        {project.solution && (
          <section className="space-y-3 p-6 rounded-2xl border border-border-subtle bg-surface-card">
            <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">The Solution & Architecture</h2>
            <p className="text-content-secondary">
              {project.solution}
            </p>
          </section>
        )}

        {/* Key Shipped Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Key Features & Architecture</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.keyFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/40 flex items-start gap-3 text-xs text-content-primary"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack */}
        {project.techStack && (
          <section className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-card font-mono text-xs text-content-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {project.results && project.results.length > 0 && (
          <section className="space-y-3 p-6 rounded-2xl border border-border-strong bg-surface-card">
            <h2 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Verified Results & Impact</h2>
            <ul className="space-y-2 list-disc list-inside text-xs text-content-primary">
              {project.results.map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-border-subtle flex items-center justify-between">
        <Link
          to="/work"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-content-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Case Studies</span>
        </Link>
        <Link
          to="/contact"
          onClick={() => soundFx.playClick()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy-soft hover:underline"
        >
          <span>Discuss this project</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
