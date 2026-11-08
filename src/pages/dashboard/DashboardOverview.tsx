import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  CheckSquare,
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  GitPullRequest,
  ShieldCheck,
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_NOTES } from '../../data/initialData';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const DashboardOverview: React.FC = () => {
  const activeTasks = INITIAL_TASKS.filter((t) => t.status !== 'done');
  const user = JSON.parse(localStorage.getItem('sm_auth_user') || '{"name":"Sreesh M"}');

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-content-primary">
          Welcome back, {user.name}
        </h1>
        <p className="text-xs text-content-secondary">
          Studio Operational Cockpit • Private collaborative workspace
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[11px] font-mono">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-burgundy-soft" />
          </div>
          <div className="text-3xl font-display font-bold text-content-primary">{INITIAL_PROJECTS.length}</div>
          <p className="text-[10px] font-mono text-content-muted">Public & In-Development</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[11px] font-mono">Pending Tasks</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-display font-bold text-content-primary">{activeTasks.length}</div>
          <p className="text-[10px] font-mono text-content-muted">In backlog & in-progress</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[11px] font-mono">Knowledge Notes</span>
            <BookOpen className="w-4 h-4 text-sreesh-light" />
          </div>
          <div className="text-3xl font-display font-bold text-content-primary">{INITIAL_NOTES.length}</div>
          <p className="text-[10px] font-mono text-content-muted">Markdown specs & briefs</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted">
            <span className="text-[11px] font-mono">Security Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-display font-bold text-content-primary">RLS Active</div>
          <p className="text-[10px] font-mono text-content-muted">Zero-Trust Boundaries</p>
        </div>
      </div>

      {/* Two Column Layout: Tasks & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent Tasks */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-content-primary">Active Sprint Tasks</h3>
            <Link
              to="/dashboard/tasks"
              onClick={() => soundFx.playClick()}
              className="text-xs font-mono text-burgundy-soft hover:underline flex items-center gap-1"
            >
              <span>View Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {INITIAL_TASKS.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-border-subtle bg-surface-elevated/40 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-content-primary">{task.title}</p>
                  <span className="text-[10px] font-mono text-content-muted">
                    Assigned to: {task.assignedTo === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-surface-card text-content-muted'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Knowledge Notes */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-content-primary">Technical Documentation</h3>
            <Link
              to="/dashboard/notes"
              onClick={() => soundFx.playClick()}
              className="text-xs font-mono text-burgundy-soft hover:underline flex items-center gap-1"
            >
              <span>All Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {INITIAL_NOTES.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-xl border border-border-subtle bg-surface-elevated/40 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-content-primary">{note.title}</p>
                  <span className="text-[10px] font-mono text-content-muted">{note.updatedAt}</span>
                </div>
                <div className="flex gap-1">
                  {note.tags.map((t, i) => (
                    <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-card text-content-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

