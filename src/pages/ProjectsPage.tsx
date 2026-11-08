import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const ProjectsPage: React.FC = () => {
  const [authorFilter, setAuthorFilter] = useState<'all' | 'sreesh' | 'mrithula' | 'collaborative'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ai' | 'creative-ui' | 'fullstack' | 'systems'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = INITIAL_PROJECTS.filter((project) => {
    const matchesAuthor = authorFilter === 'all' || project.author === authorFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAuthor && matchesCategory && matchesSearch;
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border border-border-strong bg-surface-card text-burgundy-soft">
          <Sparkles className="w-3 h-3" />
          <span>Complete Engineering & Design Archive</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-content-primary tracking-tight">
          Crafted Works
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          Explore individual and collaborative systems across autonomous AI, high-craft 3D WebGL interfaces, design token architectures, and distributed full-stack applications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, technologies (e.g. Three.js, AI, SQLite, Figma)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft transition-colors placeholder:text-content-muted"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Author Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-content-muted mr-1">Owner:</span>
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'sreesh', label: 'Sreesh M' },
              { id: 'mrithula', label: 'Mrithula' },
              { id: 'collaborative', label: 'Collaborative' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  soundFx.playClick();
                  setAuthorFilter(btn.id as typeof authorFilter);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  authorFilter === btn.id
                    ? 'bg-burgundy text-white font-semibold'
                    : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-content-muted mr-1">Discipline:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'ai', label: 'AI & Systems' },
              { id: 'creative-ui', label: '3D & Design' },
              { id: 'fullstack', label: 'Full-Stack' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  soundFx.playClick();
                  setCategoryFilter(btn.id as typeof categoryFilter);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === btn.id
                    ? 'bg-surface-elevated border border-border-strong text-content-primary font-semibold'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-sm font-mono text-content-muted">No projects found matching the selected criteria.</p>
          <button
            onClick={() => {
              setAuthorFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-burgundy-soft hover:underline font-semibold"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl border border-border-subtle bg-surface-card flex flex-col justify-between space-y-5 hover:bg-surface-elevated/70 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="uppercase text-burgundy-soft">{proj.category}</span>
                  <span className="text-content-muted">{proj.year}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-content-primary group-hover:text-burgundy-soft transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] font-mono text-content-muted">
                  {proj.author === 'collaborative'
                    ? 'Joint Project'
                    : proj.author === 'sreesh'
                    ? 'Sreesh M'
                    : 'Mrithula'}
                </span>
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
    </div>
  );
};

