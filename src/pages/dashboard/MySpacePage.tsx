import React, { useState, useEffect } from 'react';
import {
  Lock,
  BookMarked,
  Sparkles,
  Calendar,
  Smile,
  Zap,
  Tag,
  Plus,
  CheckCircle2,
  Clock,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { JournalEntry, UserId } from '../../types/workOs';

export const MySpacePage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'journal' | 'goals' | 'study'>('journal');

  // New Journal Entry state
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState<JournalEntry['mood']>('focused');
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [entryTags, setEntryTags] = useState('');

  // Personal Checklist Goals state
  const [personalTasks, setPersonalTasks] = useState([
    { id: 'pt-1', title: 'Solve 2 LeetCode Hard dynamic programming problems', done: true },
    { id: 'pt-2', title: 'Read Chapter 4 of Designing Data-Intensive Applications', done: false },
    { id: 'pt-3', title: 'Review Panimalar College Semester 7 Distributed Systems notes', done: true },
    { id: 'pt-4', title: '30-minute evening strength training & mental decompression', done: false },
  ]);

  const loadData = () => {
    setEntries(workOs.getJournalEntries(currentUser.id));
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;

    soundFx.playChime();
    workOs.createJournalEntry({
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      title: entryTitle.trim(),
      content: entryContent.trim(),
      mood: entryMood,
      energyLevel,
      tags: entryTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setEntryTitle('');
    setEntryContent('');
    setEntryTags('');
    setShowNewEntryModal(false);
    loadData();
  };

  const togglePersonalTask = (id: string) => {
    soundFx.playClick();
    setPersonalTasks(
      personalTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const moodBadges = {
    focused: { label: 'Focused', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    inspired: { label: 'Inspired', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    neutral: { label: 'Neutral', color: 'bg-surface-elevated text-content-muted border-border-subtle' },
    exhausted: { label: 'Exhausted', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    victorious: { label: 'Victorious', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header with Privacy Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              My Space & Private Journal
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 uppercase flex items-center gap-1 border border-amber-500/30">
              <Lock className="w-3 h-3" /> Private to {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Personal sanctuary for unfiltered daily reflections, personal goals, and private study planning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('journal');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'journal' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Daily Journal
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('goals');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'goals' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Personal Goals
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('study');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'study' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Study Planner
            </button>
          </div>

          {activeTab === 'journal' && (
            <button
              onClick={() => {
                soundFx.playClick();
                setShowNewEntryModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Privacy Banner */}
      <div className="rounded-xl border border-border-subtle bg-surface-card/60 p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 text-content-secondary">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>Zero Cross-User Leakage:</strong> This partition is strictly tied to your account session. Co-founders and guests cannot query or inspect these records.
          </span>
        </div>
        <span className="text-[10px] font-mono text-content-muted">Encrypted Locally</span>
      </div>

      {/* TAB 1: JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-border-subtle bg-surface-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-burgundy/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-content-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] ${moodBadges[entry.mood].color}`}>
                      {moodBadges[entry.mood].label} • Energy {entry.energyLevel}/5
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-content-primary">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-content-secondary leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
                    {entry.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted border border-border-subtle"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PERSONAL GOALS & ROUTINES */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-content-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Today's Personal Focus Checklists</span>
            </h2>

            <div className="space-y-2">
              {personalTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => togglePersonalTask(t.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    t.done
                      ? 'bg-surface-elevated/40 border-border-subtle text-content-muted line-through'
                      : 'bg-surface-elevated border-border-subtle text-content-primary hover:border-burgundy/40'
                  }`}
                >
                  <span className="text-xs">{t.title}</span>
                  <CheckCircle2
                    className={`w-4 h-4 ${t.done ? 'text-emerald-400' : 'text-content-muted'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDY PLANNER */}
      {activeTab === 'study' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-content-primary flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Panimalar S7 Finals Revision Schedule</span>
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Unit-wise revision roadmap structured around past Anna University question banks.
              </p>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex justify-between">
                  <span>Cloud Computing (CS8791)</span>
                  <span className="text-emerald-400">Unit 1-3 Completed</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex justify-between">
                  <span>Deep Learning (CS8075)</span>
                  <span className="text-amber-400">Unit 4 in progress</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex justify-between">
                  <span>Human-Computer Interaction (CS8079)</span>
                  <span className="text-blue-400">Unit 2 revision</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-content-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-burgundy-soft" />
                <span>Focus Recommendations</span>
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Pair your study blocks with the Web Audio Procedural Noise generator in Focus Mode to maintain 50-minute deep work cycles without cognitive fatigue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Journal Entry */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold font-display text-content-primary">Write Private Reflection</h3>
              <button onClick={() => setShowNewEntryModal(false)} className="text-content-muted text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solving state divergence in distributed cache"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Mood</label>
                  <select
                    value={entryMood}
                    onChange={(e) => setEntryMood(e.target.value as JournalEntry['mood'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  >
                    <option value="focused">Focused</option>
                    <option value="inspired">Inspired</option>
                    <option value="neutral">Neutral</option>
                    <option value="exhausted">Exhausted</option>
                    <option value="victorious">Victorious</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-content-secondary">Energy (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Reflection & Thoughts</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How did today feel? What was solved? What needs rest?"
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-content-secondary">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="deep-work, algorithms, wellbeing"
                  value={entryTags}
                  onChange={(e) => setEntryTags(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-content-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-burgundy text-white text-xs font-medium"
                >
                  Save Privately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
