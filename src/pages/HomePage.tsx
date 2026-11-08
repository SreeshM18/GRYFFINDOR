import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, Terminal, Palette, Cpu, ShieldCheck } from 'lucide-react';
import { soundFx } from '../components/ui/AudioSynthesizer';
import { PROFILES_DATA, INITIAL_PROJECTS } from '../data/initialData';

export const HomePage: React.FC = () => {
  const [activeSplit, setActiveSplit] = useState<'sreesh' | 'mrithula' | null>(null);

  const featuredProjects = INITIAL_PROJECTS.filter((p) => p.featured);

  return (
    <div className="relative z-10 space-y-32 pb-24">
      {/* 01. CINEMATIC OPENING HERO */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Subtle Ambient Vignette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border-strong bg-surface-card/80 backdrop-blur-md text-xs font-mono text-content-secondary animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-burgundy-soft animate-ping" />
            <span>Two Minds. Endless Possibilities.</span>
          </div>

          {/* Large Editorial Display Typography */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tighter text-content-primary leading-[0.92] select-none">
            SREESH
            <span className="block text-3xl sm:text-5xl md:text-6xl font-light text-burgundy-soft my-1">
              ×
            </span>
            MRITHULA
          </h1>

          {/* Secondary Statement */}
          <p className="text-base sm:text-xl text-content-secondary max-w-2xl mx-auto font-sans font-normal leading-relaxed pt-2">
            Building meaningful digital experiences through technology, creativity, and collaboration.
          </p>

          {/* Calls to Action */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/work"
              onClick={() => soundFx.playClick()}
              className="px-6 py-3 rounded-xl bg-content-primary text-canvas font-medium text-xs sm:text-sm hover:opacity-90 transition-all flex items-center gap-2 group shadow-lg"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#dual-identity"
              onClick={() => soundFx.playClick()}
              className="px-6 py-3 rounded-xl border border-border-strong bg-surface-card hover:bg-surface-elevated text-content-primary font-medium text-xs sm:text-sm transition-all"
            >
              Meet Us
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-mono tracking-widest text-content-muted uppercase">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-border-strong flex justify-center pt-1">
            <div className="w-1 h-1.5 rounded-full bg-burgundy-soft animate-bounce" />
          </div>
        </div>
      </section>

      {/* 02. DUAL-IDENTITY SPLIT INTERACTION */}
      <section id="dual-identity" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Dual Creative Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-content-primary tracking-tight">
            Two Perspectives. One Unified Studio.
          </h2>
          <p className="text-sm text-content-secondary max-w-lg mx-auto">
            Hover or tap to explore each individual's engineering discipline, core focus, and background.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Sreesh M Card */}
          <div
            onMouseEnter={() => {
              setActiveSplit('sreesh');
              soundFx.playHover();
            }}
            onMouseLeave={() => setActiveSplit(null)}
            className={`relative rounded-3xl p-8 sm:p-10 border transition-all duration-500 overflow-hidden ${
              activeSplit === 'sreesh'
                ? 'border-sreesh-light bg-surface-elevated shadow-2xl scale-[1.01]'
                : 'border-border-subtle bg-surface-card'
            }`}
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-sreesh/20 text-sreesh-light border border-sreesh/30">
                  Engineering & Systems
                </span>
                <span className="text-xs font-mono text-content-muted">01 / Lead Architect</span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-content-primary">
                  {PROFILES_DATA.sreesh.name}
                </h3>
                <p className="text-xs font-mono text-sreesh-light mt-1">
                  {PROFILES_DATA.sreesh.title}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                {PROFILES_DATA.sreesh.bio}
              </p>

              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase text-content-muted tracking-wider">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {PROFILES_DATA.sreesh.focusAreas.slice(0, 3).map((area, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-surface-card border border-border-subtle text-content-secondary"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link
                  to="/sreesh"
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-content-primary hover:text-sreesh-light transition-colors group"
                >
                  <span>Explore Sreesh's Portfolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-xs font-mono text-content-muted">
                  <span>15+ Systems Shipped</span>
                </div>
              </div>
            </div>

            {/* Subtle Gradient Backlight */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sreesh/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Mrithula Card */}
          <div
            onMouseEnter={() => {
              setActiveSplit('mrithula');
              soundFx.playHover();
            }}
            onMouseLeave={() => setActiveSplit(null)}
            className={`relative rounded-3xl p-8 sm:p-10 border transition-all duration-500 overflow-hidden ${
              activeSplit === 'mrithula'
                ? 'border-mrithula-light bg-surface-elevated shadow-2xl scale-[1.01]'
                : 'border-border-subtle bg-surface-card'
            }`}
          >
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-mrithula/20 text-mrithula-light border border-mrithula/30">
                  Design & Craft
                </span>
                <span className="text-xs font-mono text-content-muted">02 / Creative Lead</span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-display font-bold text-content-primary">
                  {PROFILES_DATA.mrithula.name}
                </h3>
                <p className="text-xs font-mono text-mrithula-light mt-1">
                  {PROFILES_DATA.mrithula.title}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
                {PROFILES_DATA.mrithula.bio}
              </p>

              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase text-content-muted tracking-wider">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {PROFILES_DATA.mrithula.focusAreas.slice(0, 3).map((area, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-surface-card border border-border-subtle text-content-secondary"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link
                  to="/mrithula"
                  onClick={() => soundFx.playClick()}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-content-primary hover:text-mrithula-light transition-colors group"
                >
                  <span>Explore Mrithula's Portfolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-xs font-mono text-content-muted">
                  <span>Atomic Design Systems</span>
                </div>
              </div>
            </div>

            {/* Subtle Gradient Backlight */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-mrithula/15 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 03. FEATURED WORK SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Selected Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-content-primary tracking-tight">
              Crafted Systems & Experiments
            </h2>
          </div>
          <Link
            to="/work"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 text-xs font-medium text-content-secondary hover:text-content-primary transition-colors group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl border border-border-subtle bg-surface-card hover:bg-surface-elevated/70 transition-all duration-300 p-8 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-burgundy-soft">
                    {project.category.toUpperCase()} • {project.year}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border-subtle text-content-muted">
                    {project.author === 'collaborative'
                      ? 'Collaborative'
                      : project.author === 'sreesh'
                      ? 'Sreesh M'
                      : 'Mrithula'}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-content-secondary leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-surface-elevated text-content-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs font-mono text-content-muted">{project.metrics}</span>
                <Link
                  to={`/work/${project.slug}`}
                  onClick={() => soundFx.playClick()}
                  className="p-2 rounded-xl bg-surface-elevated hover:bg-content-primary hover:text-canvas text-content-primary transition-colors"
                  aria-label={`Read case study for ${project.title}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04. CORE DISCIPLINES MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-subtle bg-surface-card p-8 sm:p-14">
          <div className="max-w-2xl space-y-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Engineering Tenets</span>
            <h2 className="text-3xl font-display font-bold text-content-primary">
              Disciplined Craft Across 4 Vectors
            </h2>
            <p className="text-xs sm:text-sm text-content-secondary">
              We approach digital software development through a unified matrix of deep systems architecture, visual craft, security boundaries, and pragmatic product delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-elevated/40 space-y-3">
              <Cpu className="w-6 h-6 text-sreesh-light" />
              <h3 className="font-display font-semibold text-sm text-content-primary">Autonomous AI & RAG</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Agentic cognitive architectures, temporal decay models, and associative graph algorithms.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-elevated/40 space-y-3">
              <Palette className="w-6 h-6 text-mrithula-light" />
              <h3 className="font-display font-semibold text-sm text-content-primary">Design Systems & Tokens</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Figma-to-code synchronizations, WCAG 2.1 AA accessible palettes, and responsive grids.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-elevated/40 space-y-3">
              <Terminal className="w-6 h-6 text-burgundy-soft" />
              <h3 className="font-display font-semibold text-sm text-content-primary">Full-Stack & Three.js</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                React 19, TypeScript, PostgreSQL, and GPU-optimized WebGL 3D configurators.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border-subtle bg-surface-elevated/40 space-y-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm text-content-primary">Zero-Trust Security</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Strict Row-Level Security, boundary isolation, and sanitized continuous delivery pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05. COLLABORATION CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <Sparkles className="w-8 h-8 text-burgundy-soft mx-auto" />
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight">
          Individual minds. Shared ambition.
        </h2>
        <p className="text-sm text-content-secondary max-w-xl mx-auto leading-relaxed">
          Whether you are evaluating us for engineering roles, design leadership, hackathons, or strategic digital products, we welcome thoughtful conversations.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white font-medium text-xs sm:text-sm transition-colors shadow-lg"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
