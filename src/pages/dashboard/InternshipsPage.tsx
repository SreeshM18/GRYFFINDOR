import React, { useState } from 'react';
import { Briefcase, Plus, Calendar, Clock, CheckCircle2, User, FileText, ChevronRight } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { InternshipRecord, UserId } from '../../types/workOs';

export const InternshipsPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserId>('sreesh');
  const [internships, setInternships] = useState<InternshipRecord[]>(workOs.getInternships(selectedUser));
  const [activeInternship, setActiveInternship] = useState<InternshipRecord | null>(internships[0] || null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logHours, setLogHours] = useState('7.5');
  const [logTasks, setLogTasks] = useState('');
  const [logLearnings, setLogLearnings] = useState('');

  const handleUserChange = (u: UserId) => {
    soundFx.playClick();
    setSelectedUser(u);
    const list = workOs.getInternships(u);
    setInternships(list);
    setActiveInternship(list[0] || null);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInternship) return;
    soundFx.playChime();

    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      hoursSpent: parseFloat(logHours) || 8,
      tasksDone: logTasks,
      learnings: logLearnings,
    };

    activeInternship.dailyLogs.unshift(newLog);
    setShowLogModal(false);
    setLogTasks('');
    setLogLearnings('');
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Career & Experience</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
              Official Work Logs & Deliverables
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Internship Management & Logs
          </h1>
          <p className="text-xs text-content-secondary">
            Company affiliations, daily work logs, supervisor reporting, and verified weekly deliverables
          </p>
        </div>

        {/* User Switcher */}
        <div className="flex items-center gap-2">
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => handleUserChange(id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUser === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {id === 'sreesh' ? "Sreesh's Internships" : "Mrithula's Internships"}
            </button>
          ))}
        </div>
      </div>

      {/* Internships List & Active Detail View */}
      {internships.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-border-subtle bg-surface-card space-y-2">
          <p className="text-sm font-mono text-content-muted">No active internships recorded for this profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Cards List */}
          <div className="lg:col-span-5 space-y-4">
            {internships.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveInternship(item);
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  activeInternship?.id === item.id
                    ? 'border-burgundy-soft bg-surface-card shadow-lg'
                    : 'border-border-subtle bg-surface-card/60 hover:bg-surface-elevated/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-content-muted">{item.internshipType}</span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-content-primary leading-tight">
                    {item.roleTitle}
                  </h3>
                  <p className="text-xs font-mono text-burgundy-soft mt-0.5">
                    {item.companyName}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-content-muted pt-2 border-t border-border-subtle">
                  <span>{item.location}</span>
                  <span>{item.startDate} — {item.endDate || 'Present'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Detail Pane */}
          {activeInternship && (
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-8">
              {/* Header and Log Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-content-primary">
                    {activeInternship.companyName}
                  </h2>
                  <p className="text-xs font-mono text-content-muted">
                    {activeInternship.roleTitle} • Supervisor: {activeInternship.supervisorName || 'Confidential'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setShowLogModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Daily Work</span>
                </button>
              </div>

              {/* Daily Logs Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
                  Daily Work Logs & Accomplishments
                </h3>

                <div className="space-y-3">
                  {activeInternship.dailyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-content-primary">{log.date}</span>
                        <span className="text-burgundy-soft font-semibold">{log.hoursSpent} Hours Logged</span>
                      </div>
                      <p className="text-content-primary leading-relaxed">
                        <strong>Tasks Done:</strong> {log.tasksDone}
                      </p>
                      {log.learnings && (
                        <p className="text-content-secondary leading-relaxed font-serif italic">
                          "Learnings: {log.learnings}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Reports Deliverables */}
              {activeInternship.weeklyReports.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-burgundy-soft font-bold">
                    Weekly Deliverable Submissions
                  </h3>
                  <div className="space-y-2">
                    {activeInternship.weeklyReports.map((rep, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/20 space-y-1 text-xs">
                        <div className="font-mono font-bold text-content-primary">Week {rep.weekNumber} Summary</div>
                        <p className="text-content-secondary">{rep.summary}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rep.deliverables.map((d, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-card text-emerald-400">
                              ✓ {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Daily Work Log Modal */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowLogModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border-strong bg-surface-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-content-primary">Log Daily Internship Work</h3>
            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-content-muted">Tracked Hours Today</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-content-muted">Tasks Completed</label>
                <textarea
                  rows={3}
                  required
                  value={logTasks}
                  onChange={(e) => setLogTasks(e.target.value)}
                  placeholder="Summarize code merged, tests executed, or Figma designs reviewed..."
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-content-muted">Key Learnings / Technical Takeaways</label>
                <textarea
                  rows={2}
                  value={logLearnings}
                  onChange={(e) => setLogLearnings(e.target.value)}
                  placeholder="What architecture or engineering insight did you gain?"
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-border-subtle text-content-muted hover:text-content-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white font-semibold"
                >
                  Record Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
