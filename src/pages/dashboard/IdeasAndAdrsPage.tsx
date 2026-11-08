import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  FileCheck2,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle,
  Clock,
  AlertCircle,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { IdeaItem, ADRRecord } from '../../types/workOs';

export const IdeasAndAdrsPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'ideas' | 'adrs'>('ideas');
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [adrs, setAdrs] = useState<ADRRecord[]>([]);

  // Modal states
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showAdrModal, setShowAdrModal] = useState(false);

  // New Idea form
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [ideaCat, setIdeaCat] = useState<IdeaItem['category']>('product');
  const [ideaImpact, setIdeaImpact] = useState<IdeaItem['impact']>('high');
  const [ideaEffort, setIdeaEffort] = useState<IdeaItem['effort']>('medium');

  // New ADR form
  const [adrTitle, setAdrTitle] = useState('');
  const [adrContext, setAdrContext] = useState('');
  const [adrDecision, setAdrDecision] = useState('');
  const [adrConsequences, setAdrConsequences] = useState('');

  const loadData = () => {
    setIdeas(workOs.getIdeas());
    setAdrs(workOs.getADRs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;

    soundFx.playClick();
    workOs.createIdea({
      userId: currentUser.id,
      title: ideaTitle.trim(),
      description: ideaDesc.trim(),
      category: ideaCat,
      impact: ideaImpact,
      effort: ideaEffort,
    });

    setIdeaTitle('');
    setIdeaDesc('');
    setShowIdeaModal(false);
    loadData();
  };

  const handleCreateAdr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adrTitle.trim()) return;

    soundFx.playClick();
    workOs.createADR({
      title: adrTitle.trim(),
      status: 'accepted',
      authorId: currentUser.id,
      coAuthorId: currentUser.id === 'sreesh' ? 'mrithula' : 'sreesh',
      deciders: 'Sreesh M & Mrithula M',
      context: adrContext.trim(),
      decision: adrDecision.trim(),
      consequences: adrConsequences.trim(),
    });

    setAdrTitle('');
    setAdrContext('');
    setAdrDecision('');
    setAdrConsequences('');
    setShowAdrModal(false);
    loadData();
  };

  const promoteIdea = (id: string) => {
    soundFx.playChime();
    // Simulate promotion to active backlog
    const updated = ideas.map((item) =>
      item.id === id ? { ...item, status: 'promoted_to_project' as const } : item
    );
    setIdeas(updated);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Ideas Vault & Architecture Decisions
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              R&D & Governance
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Capture spontaneous engineering ideas and document binding Architectural Decision Records (ADRs).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('ideas');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'ideas' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Ideas Vault ({ideas.length})</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('adrs');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'adrs' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Decisions / ADRs ({adrs.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              if (activeTab === 'ideas') setShowIdeaModal(true);
              else setShowAdrModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'ideas' ? 'New Idea' : 'Draft ADR'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IDEAS VAULT */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea) => {
              const isPromoted = idea.status === 'promoted_to_project';
              return (
                <div
                  key={idea.id}
                  className="rounded-2xl border border-border-subtle bg-surface-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-burgundy/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-surface-elevated text-content-secondary border border-border-subtle">
                        {idea.category}
                      </span>
                      <span className="text-[10px] font-mono text-content-muted capitalize">
                        by {idea.userId}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-base text-content-primary leading-snug">
                      {idea.title}
                    </h3>

                    <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed">
                      {idea.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">Impact: {idea.impact}</span>
                      <span className="text-content-muted">•</span>
                      <span className="text-amber-400">Effort: {idea.effort}</span>
                    </div>

                    {isPromoted ? (
                      <span className="text-[10px] text-burgundy-soft font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Promoted
                      </span>
                    ) : (
                      <button
                        onClick={() => promoteIdea(idea.id)}
                        className="text-content-muted hover:text-content-primary flex items-center gap-1 transition-colors text-[10px]"
                      >
                        <span>Promote</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ADRs */}
      {activeTab === 'adrs' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {adrs.map((adr) => (
              <div
                key={adr.id}
                className="rounded-2xl border border-border-subtle bg-surface-card p-6 sm:p-8 space-y-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-burgundy/15 text-burgundy-soft font-bold">
                      {adr.id}
                    </span>
                    <h3 className="text-lg font-bold font-display text-content-primary">
                      {adr.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {adr.status}
                    </span>
                    <span className="text-content-muted">{adr.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                  <div className="space-y-1.5 p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-content-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Context & Problem</span>
                    </div>
                    <p className="text-content-secondary">{adr.context}</p>
                  </div>

                  <div className="space-y-1.5 p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-content-muted flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>Adopted Decision</span>
                    </div>
                    <p className="text-content-secondary">{adr.decision}</p>
                  </div>

                  <div className="space-y-1.5 p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-content-muted flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-burgundy-soft" />
                      <span>Consequences</span>
                    </div>
                    <p className="text-content-secondary">{adr.consequences}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-content-muted">
                  <div>Deciders: <span className="text-content-primary">{adr.deciders}</span></div>
                  <div>Primary Author: <span className="capitalize text-burgundy-soft">{adr.authorId}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Idea */}
      {showIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">New Research / Studio Idea</h3>
              <button onClick={() => setShowIdeaModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-time canvas spatial audio graph"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Problem solved, technical exploration, or concept..."
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-content-muted">Category</label>
                  <select
                    value={ideaCat}
                    onChange={(e) => setIdeaCat(e.target.value as IdeaItem['category'])}
                    className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="product">Product</option>
                    <option value="research">Research</option>
                    <option value="experiment">Experiment</option>
                    <option value="open_source">Open Source</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-content-muted">Impact</label>
                  <select
                    value={ideaImpact}
                    onChange={(e) => setIdeaImpact(e.target.value as IdeaItem['impact'])}
                    className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-content-muted">Effort</label>
                  <select
                    value={ideaEffort}
                    onChange={(e) => setIdeaEffort(e.target.value as IdeaItem['effort'])}
                    className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowIdeaModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Draft ADR */}
      {showAdrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">Draft Architecture Decision Record</h3>
              <button onClick={() => setShowAdrModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateAdr} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Decision Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adopt Supabase RLS policies over middleware checks"
                  value={adrTitle}
                  onChange={(e) => setAdrTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Context & Problem</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was the motivating context or friction point?"
                  value={adrContext}
                  onChange={(e) => setAdrContext(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Decision</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What architectural choice was adopted?"
                  value={adrDecision}
                  onChange={(e) => setAdrDecision(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Consequences</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What positive outcomes and trade-offs emerge from this choice?"
                  value={adrConsequences}
                  onChange={(e) => setAdrConsequences(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAdrModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Publish ADR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
