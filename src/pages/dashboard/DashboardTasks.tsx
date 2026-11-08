import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { INITIAL_TASKS } from '../../data/initialData';
import { WorkspaceTask } from '../../types';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const DashboardTasks: React.FC = () => {
  const [tasks, setTasks] = useState<WorkspaceTask[]>(INITIAL_TASKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState<'sreesh' | 'mrithula'>('sreesh');

  const columns: { id: WorkspaceTask['status']; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Completed' },
  ];

  const handleMoveStatus = (taskId: string, newStatus: WorkspaceTask['status']) => {
    soundFx.playClick();
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    soundFx.playChime();
    const newTask: WorkspaceTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedTo: newTaskAssignee,
      status: 'todo',
      priority: newTaskPriority,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-content-primary">Studio Kanban Pipeline</h1>
          <p className="text-xs text-content-secondary">
            Shared task management for Sreesh M & Mrithula
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl border border-border-subtle bg-surface-card flex flex-col space-y-4 min-h-[500px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="font-display font-bold text-xs text-content-primary">{col.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-content-muted">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/60 space-y-3 hover:border-border-strong transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-surface-card text-content-muted'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-content-muted">
                        {task.assignedTo === 'sreesh' ? 'Sreesh' : 'Mrithula'}
                      </span>
                    </div>

                    <h4 className="font-semibold text-xs text-content-primary leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[11px] text-content-secondary line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Quick Move Action Selector */}
                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-content-muted">
                      <span>Move to:</span>
                      <div className="flex gap-1">
                        {columns
                          .filter((c) => c.id !== task.status)
                          .map((c) => (
                            <button
                              key={c.id}
                              onClick={() => handleMoveStatus(task.id, c.id)}
                              className="px-1.5 py-0.5 rounded hover:bg-surface-card hover:text-content-primary"
                              title={`Move to ${c.label}`}
                            >
                              {c.label.split(' ')[0]}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border-strong bg-surface-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-content-primary">Create New Workspace Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-content-muted">Task Summary</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Test WebGL canvas on iPhone Safari"
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-content-muted">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value as 'sreesh' | 'mrithula')}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
                  >
                    <option value="sreesh">Sreesh M</option>
                    <option value="mrithula">Mrithula</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-content-muted">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-border-subtle text-xs text-content-muted hover:text-content-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
