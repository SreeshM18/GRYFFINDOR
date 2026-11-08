import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Check,
  Plus,
  Sparkles,
  Target,
  Code2,
  Cpu,
  Palette,
  BookOpen,
  Filter,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { HabitItem, UserId } from '../../types/workOs';

export const HabitsPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [selectedUser, setSelectedUser] = useState<UserId | 'all'>(currentUser.id);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('coding');
  const [newTarget, setNewTarget] = useState(7);

  // Generate last 7 days strings [YYYY-MM-DD]
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: i === 6,
    };
  });

  const loadData = () => {
    const list = workOs.getHabits();
    if (selectedUser === 'all') {
      setHabits(list);
    } else {
      setHabits(list.filter((h) => h.userId === selectedUser || h.userId === 'both'));
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedUser]);

  const handleToggle = (habitId: string, dateStr: string) => {
    soundFx.playChime();
    workOs.toggleHabit(habitId, dateStr);
    loadData();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFx.playClick();
    workOs.createHabit({
      userId: selectedUser === 'all' ? currentUser.id : selectedUser,
      title: newTitle.trim(),
      category: newCategory,
      frequency: newTarget >= 7 ? 'daily' : 'weekdays',
      targetPerWeek: newTarget,
    });

    setNewTitle('');
    setShowAddModal(false);
    loadData();
  };

  const getCategoryIcon = (cat: HabitItem['category']) => {
    switch (cat) {
      case 'coding':
        return <Code2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'system_design':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'studio':
        return <Palette className="w-3.5 h-3.5 text-burgundy-soft" />;
      case 'learning':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Target className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  // Stats calculation
  const totalStreaks = habits.reduce((acc, h) => acc + h.currentStreak, 0);
  const bestStreakOverall = Math.max(...habits.map((h) => h.bestStreak), 0);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Habits & Discipline Tracker
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Daily Consistency
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Build compounding momentum across algorithmic problem solving, design prototypes, and studio milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => setSelectedUser('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'all' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setSelectedUser('sreesh')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'sreesh' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Sreesh
            </button>
            <button
              onClick={() => setSelectedUser('mrithula')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'mrithula' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Mrithula
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Active Habits</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{habits.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-burgundy/10 border border-burgundy/20 flex items-center justify-center text-burgundy-soft">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">Cumulative Streak Days</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{totalStreaks}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted">All-Time Best Streak</div>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">{bestStreakOverall} days</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Habit Matrix */}
      <div className="rounded-2xl border border-border-subtle bg-surface-card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-sm font-semibold text-content-primary">Weekly Discipline Grid</h2>
          <span className="text-[10px] font-mono text-content-muted">Click day node to toggle completion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-elevated/40 text-[11px] font-mono uppercase text-content-muted">
                <th className="py-3 px-6">Habit & Routine</th>
                <th className="py-3 px-3 text-center">Owner</th>
                <th className="py-3 px-3 text-center">Streak</th>
                {last7Days.map((d) => (
                  <th key={d.dateStr} className={`py-3 px-2 text-center ${d.isToday ? 'text-burgundy-soft font-bold' : ''}`}>
                    <div className="text-[10px]">{d.dayName}</div>
                    <div className="text-xs">{d.dayNumber}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {habits.map((habit) => {
                return (
                  <tr key={habit.id} className="hover:bg-surface-elevated/30 transition-colors">
                    {/* Habit Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-surface-elevated border border-border-subtle">
                          {getCategoryIcon(habit.category)}
                        </div>
                        <div>
                          <div className="font-semibold text-content-primary">{habit.title}</div>
                          <div className="text-[10px] font-mono text-content-muted capitalize">
                            {habit.category.replace('_', ' ')} • {habit.targetPerWeek}x / week
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-4 px-3 text-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border-subtle text-content-secondary capitalize">
                        {habit.userId}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono font-bold text-amber-400">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{habit.currentStreak}</span>
                      </div>
                    </td>

                    {/* 7 Day Matrix Checkboxes */}
                    {last7Days.map((d) => {
                      const completed = habit.completedDates.includes(d.dateStr);
                      return (
                        <td key={d.dateStr} className="py-4 px-2 text-center">
                          <button
                            onClick={() => handleToggle(habit.id, d.dateStr)}
                            className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                              completed
                                ? 'bg-burgundy border-burgundy text-white shadow-sm'
                                : 'border-border-subtle bg-surface-elevated text-transparent hover:border-content-muted'
                            }`}
                            title={`Toggle for ${d.dateStr}`}
                          >
                            <Check className={`w-3.5 h-3.5 ${completed ? 'stroke-[2.5]' : 'opacity-0'}`} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h3 className="text-base font-bold font-display text-content-primary">New Daily Habit</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-content-muted hover:text-content-primary text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-content-secondary">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 1 distributed systems paper"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-content-secondary">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as HabitItem['category'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                  >
                    <option value="coding">Coding / Algorithms</option>
                    <option value="system_design">System Design</option>
                    <option value="studio">Studio & Design</option>
                    <option value="learning">Academic / Reading</option>
                    <option value="health">Health & Energy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-content-secondary">Weekly Target</label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(parseInt(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
                  >
                    <option value="7">Every day (7 days)</option>
                    <option value="5">Weekdays only (5 days)</option>
                    <option value="3">3 times a week</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-content-secondary hover:text-content-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

