import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ArrowUpRight, Sparkles, LayoutGrid, List, ChevronDown, ChevronUp, ExternalLink, Code2 } from 'lucide-react';
import { GithubIcon } from '../components/ui/Icons';
import { INITIAL_PROJECTS } from '../data/initialData';
import { soundFx } from '../components/ui/AudioSynthesizer';

export const ProjectsPage: React.FC = () => {
  const [authorFilter, setAuthorFilter] = useState<'all' | 'sreesh' | 'mrithula' | 'collaborative'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ai' | 'creative-ui' | 'fullstack' | 'systems'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const filtered = INITIAL_PROJECTS.filter((project) => {
    const matchesAuthor = authorFilter === 'all' || project.author === authorFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAuthor && matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    soundFx.playClick();
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

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

        {/* Filter Chips & View Mode Toggle */}
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

          <div className="flex items-center gap-4">
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

            {/* View Mode Switcher (Killer Portfolio Inspired: Cards vs Index) */}
            <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('grid');
                }}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-burgundy text-white' : 'text-content-muted hover:text-content-primary'
                }`}
                title="Visual Card Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setViewMode('index');
                }}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  viewMode === 'index' ? 'bg-burgundy text-white' : 'text-content-muted hover:text-content-primary'
                }`}
                title="Index Table (Alright Studio Style)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Display */}
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
      ) : viewMode === 'grid' ? (
        /* VISUAL GRID MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-6 sm:p-7 rounded-2xl border border-border-subtle bg-surface-card flex flex-col justify-between space-y-5 hover:bg-surface-elevated/70 transition-all duration-300 group hover:border-burgundy/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="uppercase text-burgundy-soft font-semibold">{proj.category}</span>
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
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted border border-border-subtle">
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
      ) : (
        /* ALRIGHT STUDIO STYLE INDEX CATALOG WITH IN-LINE EXPANDABLE MINI CASE STUDIES */
        <div className="rounded-2xl border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border-subtle">
            {filtered.map((proj) => {
              const isExpanded = expandedProjectId === proj.id;
              return (
                <div key={proj.id} className="transition-colors hover:bg-surface-elevated/20">
                  {/* Index Row */}
                  <div
                    onClick={() => toggleExpand(proj.id)}
                    className="p-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-content-muted w-12">{proj.year}</span>
                      <div>
                        <div className="font-display font-bold text-base text-content-primary hover:text-burgundy-soft transition-colors">
                          {proj.title}
                        </div>
                        <div className="text-[11px] font-mono text-content-muted capitalize sm:hidden">
                          {proj.category} • {proj.author}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-mono">
                      <span className="hidden sm:inline text-content-secondary uppercase tracking-wider text-[11px]">
                        {proj.category}
                      </span>
                      <span className="hidden sm:inline text-burgundy-soft capitalize">
                        {proj.author === 'collaborative' ? 'Joint Studio' : proj.author}
                      </span>
                      <div className="flex items-center gap-1 text-content-muted hover:text-content-primary">
                        <span className="text-[11px]">{isExpanded ? 'Collapse' : 'Inspect'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable In-Line Mini Case Study */}
                  {isExpanded && (
                    <div className="px-5 sm:px-8 pb-6 pt-2 bg-surface-elevated/40 border-t border-border-subtle space-y-4 animate-in fade-in duration-200">
                      <p className="text-xs text-content-secondary leading-relaxed max-w-3xl">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tags.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border-subtle text-content-muted">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-mono text-content-secondary hover:text-content-primary"
                            >
                              <GithubIcon className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                            </a>
                          )}
                          <Link
                            to={`/work/${proj.slug}`}
                            onClick={() => soundFx.playClick()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy-soft hover:text-burgundy transition-colors"
                          >
                            <span>Full Case Study</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

