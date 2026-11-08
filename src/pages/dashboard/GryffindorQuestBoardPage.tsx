import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Copy,
  Crown,
  Inbox,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogOut,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  SquareKanban,
  Users,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import { configured, supabase } from '../../lib/supabase';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import '../../styles/quest-board.css';

// Type definitions matching 20261108_gryffindor_tasks.sql
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'blocked' | 'review' | 'done';
export type Assignment = 'unassigned' | 'pending' | 'accepted' | 'declined';
export type Visibility = 'private' | 'shared';

export interface Profile {
  id: string;
  display_name: string;
}

export interface Room {
  id: string;
  title: string;
  created_by: string;
}

export interface Task {
  id: string;
  room_id: string;
  created_by: string;
  assigned_to: string | null;
  visibility: Visibility;
  assignment_state: Assignment;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due_at: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  archived_at: string | null;
}

export interface Notification {
  id: string;
  task_id: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface Comment {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

export interface Checklist {
  id: string;
  task_id: string;
  label: string;
  done: boolean;
}

export interface EventLog {
  id: number;
  task_id: string;
  actor_id: string;
  event_type: string;
  details: Record<string, string>;
  created_at: string;
}

export interface TaskInput {
  title: string;
  description: string;
  priority: Priority;
  due: string;
  assignee: string;
  visibility: Visibility;
  tags: string;
}

const defaultTask: TaskInput = {
  title: '',
  description: '',
  priority: 'medium',
  due: '',
  assignee: '',
  visibility: 'private',
  tags: '',
};

const statusName: Record<Status, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  review: 'In review',
  done: 'Completed',
};

const statuses: Status[] = ['todo', 'in_progress', 'blocked', 'review', 'done'];
const byPriority: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

const niceDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'No deadline';

const toLocalInput = (utc?: string | null) => {
  if (!utc) return '';
  const d = new Date(utc);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const toUtc = (local: string) => (local ? new Date(local).toISOString() : null);

// Initial fallback mock data for local offline operation
const INITIAL_PROFILES: Profile[] = [
  { id: 'user-sreesh-001', display_name: 'Sreesh M' },
  { id: 'user-mrithula-002', display_name: 'Mrithula M' },
];

const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 'task-01',
    room_id: 'room-gryffindor',
    created_by: 'user-sreesh-001',
    assigned_to: 'user-mrithula-002',
    visibility: 'shared',
    assignment_state: 'pending',
    title: 'Design Attendance Biometrics & Glassmorphic Dashboard',
    description: 'Implement clock-in/out, biometric streak calculation, and camera roll preview widget.',
    priority: 'high',
    status: 'in_progress',
    due_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    tags: ['frontend', 'attendance', 'design-system'],
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    archived_at: null,
  },
  {
    id: 'task-02',
    room_id: 'room-gryffindor',
    created_by: 'user-mrithula-002',
    assigned_to: 'user-sreesh-001',
    visibility: 'shared',
    assignment_state: 'accepted',
    title: 'Architect Dual-Workstation Neural OS Realtime Sync Engine',
    description: 'Create zero-trust WebSocket bridge between MacBook Pro M3 and Windows RTX 4070 rig.',
    priority: 'urgent',
    status: 'todo',
    due_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    tags: ['systems', 'websocket', 'dual-sync'],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    archived_at: null,
  },
  {
    id: 'task-03',
    room_id: 'room-gryffindor',
    created_by: 'user-sreesh-001',
    assigned_to: 'user-sreesh-001',
    visibility: 'private',
    assignment_state: 'accepted',
    title: 'Prepare Ethical Hacking & Reverse Engineering Notes (Semester 7)',
    description: 'Confidential study material and lab exploit traces for upcoming exams.',
    priority: 'medium',
    status: 'in_progress',
    due_at: new Date(Date.now() + 86400000 * 5).toISOString(),
    tags: ['academics', 'cybersecurity', 'private'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    archived_at: null,
  },
  {
    id: 'task-04',
    room_id: 'room-gryffindor',
    created_by: 'user-mrithula-002',
    assigned_to: 'user-mrithula-002',
    visibility: 'private',
    assignment_state: 'accepted',
    title: 'Curate Design Tokens for High-Precision 60fps Micro-interactions',
    description: 'Spring physics constants, KaTeX KaTeX shaders, and sound effects library integration.',
    priority: 'high',
    status: 'done',
    due_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ['design', 'tokens', 'private'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    archived_at: null,
  },
];

export const GryffindorQuestBoardPage: React.FC = () => {
  // Current active user identity (defaults to Sreesh or stored auth)
  const [activeUserId, setActiveUserId] = useState<string>('user-sreesh-001');

  // Supabase states
  const [tasks, setTasks] = useState<Task[]>(INITIAL_MOCK_TASKS);
  const [people, setPeople] = useState<Profile[]>(INITIAL_PROFILES);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      task_id: 'task-01',
      message: 'Sreesh assigned you "Design Attendance Biometrics & Glassmorphic Dashboard"',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      read_at: null,
    },
    {
      id: 'notif-2',
      task_id: 'task-02',
      message: 'Mrithula assigned you "Architect Dual-Workstation Neural OS Realtime Sync Engine"',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      read_at: new Date().toISOString(),
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c-1',
      task_id: 'task-01',
      author_id: 'user-sreesh-001',
      body: 'I linked the attendance schema in 20261108010000_gryffindor_tasks.sql. Let me know if you need custom columns.',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'c-2',
      task_id: 'task-01',
      author_id: 'user-mrithula-002',
      body: 'Reviewed! The Pantone color swatches from Marijana Garden fit the attendance streak indicators perfectly.',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ]);

  const [checklist, setChecklist] = useState<Checklist[]>([
    { id: 'chk-1', task_id: 'task-01', label: 'Create responsive biometric clock-in card', done: true },
    { id: 'chk-2', task_id: 'task-01', label: 'Wire Supabase RLS row check on attendance_logs', done: true },
    { id: 'chk-3', task_id: 'task-01', label: 'Add overtime & working hours summary badge', done: false },
    { id: 'chk-4', task_id: 'task-02', label: 'Benchmark WebSocket handshake latency (<15ms)', done: true },
    { id: 'chk-5', task_id: 'task-02', label: 'Sync SQLite index with portable JSONL logs', done: false },
  ]);

  const [events, setEvents] = useState<EventLog[]>([
    {
      id: 1,
      task_id: 'task-01',
      actor_id: 'user-sreesh-001',
      event_type: 'task_created',
      details: {},
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 2,
      task_id: 'task-01',
      actor_id: 'user-mrithula-002',
      event_type: 'checklist_completed',
      details: {},
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ]);

  const [editor, setEditor] = useState<'new' | 'edit' | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine' | 'created' | 'private' | 'pending'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [view, setView] = useState<'list' | 'board'>('board');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'due' | 'priority' | 'newest'>('newest');
  const [page, setPage] = useState<'board' | 'notifications'>('board');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState('GRYFFINDOR-ROOM-9C694EDA-ONETIME-SECRET');

  const me = activeUserId;
  const selected = tasks.find((t) => t.id === selectedId) || null;
  const names = Object.fromEntries(people.map((p) => [p.id, p.display_name])) as Record<string, string>;

  // Filter tasks based on security rules (Private tasks visible ONLY to their creator)
  const visible = useMemo(() => {
    return tasks
      .filter((t) => {
        // Enforce private task security: if private and not created by me, NEVER display
        if (t.visibility === 'private' && t.created_by !== me) return false;

        if (filter === 'mine' && t.assigned_to !== me) return false;
        if (filter === 'created' && t.created_by !== me) return false;
        if (filter === 'private' && t.visibility !== 'private') return false;
        if (filter === 'pending' && !(t.assigned_to === me && t.assignment_state === 'pending')) return false;
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (query && !`${t.title} ${t.description} ${t.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === 'priority') return byPriority[b.priority] - byPriority[a.priority];
        if (sort === 'due') {
          const aDue = a.due_at ? new Date(a.due_at).getTime() : Number.MAX_SAFE_INTEGER;
          const bDue = b.due_at ? new Date(b.due_at).getTime() : Number.MAX_SAFE_INTEGER;
          return aDue - bDue;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [tasks, filter, statusFilter, query, sort, me]);

  const pending = tasks.filter((t) => t.assigned_to === me && t.assignment_state === 'pending');
  const done = tasks.filter((t) => t.status === 'done' && (t.visibility !== 'private' || t.created_by === me));
  const dueSoon = tasks.filter(
    (t) => t.due_at && t.status !== 'done' && new Date(t.due_at).getTime() < Date.now() + 86400000
  );
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Actions
  const handleCreateOrEditTask = async (input: TaskInput) => {
    soundFx.playChime();
    const isEdit = editor === 'edit' && selected;

    if (isEdit) {
      setTasks(
        tasks.map((t) =>
          t.id === selected.id
            ? {
                ...t,
                title: input.title,
                description: input.description,
                priority: input.priority,
                due_at: input.due ? toUtc(input.due) : null,
                assigned_to: input.visibility === 'private' ? me : input.assignee || null,
                visibility: input.visibility,
                tags: input.tags ? input.tags.split(',').map((x) => x.trim()).filter(Boolean) : [],
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      const assignedToId = input.visibility === 'private' ? me : input.assignee || null;
      const isCrossAssignment = assignedToId && assignedToId !== me;

      const newTask: Task = {
        id: `task-${Date.now()}`,
        room_id: 'room-gryffindor',
        created_by: me,
        assigned_to: assignedToId,
        visibility: input.visibility,
        assignment_state: isCrossAssignment ? 'pending' : 'accepted',
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: 'todo',
        due_at: input.due ? toUtc(input.due) : null,
        tags: input.tags ? input.tags.split(',').map((x) => x.trim()).filter(Boolean) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        archived_at: null,
      };

      setTasks([newTask, ...tasks]);

      // If assigned to teammate, create an Owl Post notification!
      if (isCrossAssignment) {
        const otherPerson = people.find((p) => p.id === assignedToId);
        const myName = names[me] || 'Teammate';
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            task_id: newTask.id,
            message: `${myName} assigned you "${newTask.title}"`,
            created_at: new Date().toISOString(),
            read_at: null,
          },
          ...prev,
        ]);
      }
    }

    setEditor(null);
  };

  const handleRespondAssignment = (taskId: string, response: 'accept' | 'decline') => {
    soundFx.playChime();
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignment_state: response === 'accept' ? 'accepted' : 'declined',
              status: response === 'accept' ? 'in_progress' : t.status,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );

    // Notify creator
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      const myName = names[me] || 'Teammate';
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          task_id: targetTask.id,
          message: `${myName} ${response === 'accept' ? 'accepted' : 'declined'} the assignment: "${targetTask.title}"`,
          created_at: new Date().toISOString(),
          read_at: null,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: Status) => {
    soundFx.playClick();
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              completed_at: newStatus === 'done' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleToggleChecklist = (checkId: string, done: boolean) => {
    soundFx.playClick();
    setChecklist(checklist.map((c) => (c.id === checkId ? { ...c, done } : c)));
  };

  const handleAddChecklist = (taskId: string, label: string) => {
    soundFx.playClick();
    setChecklist([...checklist, { id: `chk-${Date.now()}`, task_id: taskId, label, done: false }]);
  };

  const handleAddComment = (taskId: string, body: string) => {
    soundFx.playClick();
    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        task_id: taskId,
        author_id: me,
        body,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleArchiveTask = (taskId: string) => {
    soundFx.playClick();
    setTasks(tasks.filter((t) => t.id !== taskId));
    setSelectedId(null);
  };

  return (
    <div className="quest-board-container space-y-8 animate-fade-in pb-12">
      {/* =========================================================================
          TOP BANNER: PERSPECTIVE SWITCHER & SUPABASE READINESS
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-card border border-border-subtle">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-burgundy/20 text-gold flex items-center justify-center font-serif text-lg font-bold border border-gold/30">
            🦁
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-bold">
                GRYFFINDOR — THE QUEST BOARD
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Equal Assignment Engine
              </span>
            </div>
            <p className="text-xs text-content-muted mt-0.5">
              Two-person equal task management with private isolation, consent-based assignment, and Owl Post.
            </p>
          </div>
        </div>

        {/* User Perspective Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-content-muted">Viewing As:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border-subtle">
            {people.map((p) => {
              const isSelected = p.id === activeUserId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveUserId(p.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-burgundy text-white font-bold shadow-sm'
                      : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  {p.display_name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowInvite(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 text-xs font-medium transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Room Code</span>
          </button>
        </div>
      </div>

      {/* Database Schema Setup Notice */}
      <div className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-content-muted">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-gold shrink-0" />
          <span>
            Database schema: <code>supabase/migrations/20261108010000_gryffindor_tasks.sql</code> ready for deployment in your Supabase SQL Editor.
          </span>
        </div>
        <span className="text-content-primary shrink-0">
          Status: {configured ? '● Live Supabase Connected' : '● Local Synchronized Storage Active'}
        </span>
      </div>

      {/* =========================================================================
          PAGE TITLE & HEADER CONTROLS
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">
            <Sparkles className="w-3.5 h-3.5" />
            WORK WITH INTENTION
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-content-primary tracking-tight mt-1">
            The Quest <em>Board.</em>
          </h1>
          <p className="text-xs text-content-muted mt-1 max-w-xl leading-relaxed">
            Assign work to each other, create private personal quests, review deliverables, and synchronize your efforts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setPage(page === 'board' ? 'notifications' : 'board');
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              page === 'notifications'
                ? 'bg-burgundy text-white border-burgundy-soft'
                : 'bg-surface-card border-border-subtle text-content-secondary hover:text-content-primary'
            }`}
          >
            <Bell className="w-4 h-4 text-gold" />
            <span>Owl Post</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-gold text-black font-bold text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setEditor('new');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-black text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          STATISTICS COUNTERS
      ========================================================================= */}
      <div className="stats">
        <div className="stat">
          <span>Total Visible Tasks</span>
          <strong>{visible.length}</strong>
          <small>Authorized for {names[me]}</small>
        </div>
        <div className="stat">
          <span>Assigned to me</span>
          <strong>{tasks.filter((t) => t.assigned_to === me && (t.visibility !== 'private' || t.created_by === me)).length}</strong>
          <small>Including pending</small>
        </div>
        <div className="stat">
          <span>Waiting for my reply</span>
          <strong className="text-gold">{pending.length}</strong>
          <small>Accept or decline</small>
        </div>
        <div className="stat">
          <span>Completed</span>
          <strong>{done.length}</strong>
          <small>{visible.length ? Math.round((done.length / visible.length) * 100) : 0}% of visible tasks</small>
        </div>
        <div className="stat">
          <span>Due within 24h</span>
          <strong>{dueSoon.length}</strong>
          <small>Priority deadlines</small>
        </div>
      </div>

      {/* =========================================================================
          PENDING ASSIGNMENT ATTENTION BANNER
      ========================================================================= */}
      {pending.length > 0 && (
        <div className="pending-banner">
          <div>
            <span className="eyebrow">YOUR ATTENTION IS NEEDED</span>
            <strong>
              {pending.length} assignment{pending.length === 1 ? '' : 's'} waiting for your response.
            </strong>
            <p>Your teammate has proposed work. Review and choose to accept or decline.</p>
          </div>
          <button
            className="secondary"
            onClick={() => {
              soundFx.playClick();
              setFilter('pending');
              setPage('board');
            }}
          >
            <span>Review Assignments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          NOTIFICATIONS VIEW (OWL POST)
      ========================================================================= */}
      {page === 'notifications' ? (
        <div className="surface notifications space-y-2">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <h2 className="text-xl font-serif font-bold text-content-primary">Owl Post Messages</h2>
              <p className="text-xs text-content-muted">Direct dispatch notices between Sreesh and Mrithula.</p>
            </div>
            <button className="secondary" onClick={() => setPage('board')}>
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Quest Board</span>
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications in the air yet. Your owl is resting peacefully.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`notice ${!n.read_at ? 'unread' : ''}`}>
                <div>
                  <strong>{n.message}</strong>
                  <span>{niceDate(n.created_at)}</span>
                </div>
                <div className="row-actions">
                  {n.task_id && (
                    <button
                      className="text-link"
                      onClick={() => {
                        setSelectedId(n.task_id);
                        setPage('board');
                      }}
                    >
                      Open Task →
                    </button>
                  )}
                  {!n.read_at && (
                    <button
                      className="secondary tiny"
                      onClick={() => {
                        soundFx.playClick();
                        setNotifications(
                          notifications.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x))
                        );
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* =========================================================================
            MAIN QUEST BOARD (LIST & KANBAN)
        ========================================================================= */
        <div className="board-panel">
          {/* Header Controls */}
          <div className="board-heading">
            <div>
              <span className="eyebrow">TASKS & COLLABORATION</span>
              <h2>All Assignments</h2>
            </div>
            <div className="view-toggle">
              <button
                className={view === 'list' ? 'active' : ''}
                onClick={() => {
                  soundFx.playClick();
                  setView('list');
                }}
              >
                <ListFilter className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                className={view === 'board' ? 'active' : ''}
                onClick={() => {
                  soundFx.playClick();
                  setView('board');
                }}
              >
                <SquareKanban className="w-4 h-4" />
                <span>Kanban</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="filters">
            <div className="search">
              <Search className="w-4 h-4" />
              <input
                aria-label="Search tasks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, descriptions, tags..."
              />
            </div>

            <select
              aria-label="Filter by ownership"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All Accessible</option>
              <option value="mine">Assigned to Me</option>
              <option value="created">Created by Me</option>
              <option value="private">My Private Quests</option>
              <option value="pending">Awaiting My Response</option>
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusName[s]}
                </option>
              ))}
            </select>

            <select
              aria-label="Sort tasks"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
            >
              <option value="newest">Newest First</option>
              <option value="due">Due Soonest</option>
              <option value="priority">Highest Priority</option>
            </select>
          </div>

          {/* Empty State */}
          {visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3>No tasks match your criteria.</h3>
              <p>Create your first private quest or assign a task to your partner.</p>
              <button
                className="primary mt-4"
                onClick={() => {
                  soundFx.playClick();
                  setEditor('new');
                }}
              >
                <Plus className="w-4 h-4" /> Create Task
              </button>
            </div>
          ) : view === 'list' ? (
            /* =========================================================================
                LIST VIEW
            ========================================================================= */
            <div className="task-list">
              {visible.map((t) => (
                <button
                  key={t.id}
                  className="task-row group"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedId(t.id);
                  }}
                >
                  <span className={`task-icon ${t.status === 'done' ? 'complete' : ''}`}>
                    {t.status === 'done' ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  </span>

                  <span className="task-name">
                    <strong>{t.title}</strong>
                    <small>
                      {t.visibility === 'private' ? '🔒 Private Quest' : `From ${names[t.created_by] || 'Member'}`}
                      {t.tags.length > 0 && ` · #${t.tags.slice(0, 2).join(' · #')}`}
                    </small>
                  </span>

                  <span className={`pill priority-${t.priority}`}>{t.priority}</span>

                  <span className="assignee" title="Assignee">
                    {t.assigned_to ? names[t.assigned_to] || 'Member' : 'Unassigned'}
                  </span>

                  <span className={`pill assign-${t.assignment_state}`}>{t.assignment_state}</span>

                  <span className="date">
                    <CalendarDays className="w-3.5 h-3.5 text-content-muted" />
                    {t.due_at ? new Date(t.due_at).toLocaleDateString('en-IN') : 'No date'}
                  </span>

                  <span className="status-label">{statusName[t.status]}</span>

                  <ChevronDown className="w-4 h-4 row-chevron" />
                </button>
              ))}
            </div>
          ) : (
            /* =========================================================================
                KANBAN BOARD VIEW
            ========================================================================= */
            <div className="kanban">
              {statuses.map((status) => {
                const columnTasks = visible.filter((t) => t.status === status);
                return (
                  <div className="column" key={status}>
                    <div className="col-head">
                      <span>{statusName[status]}</span>
                      <span>{columnTasks.length}</span>
                    </div>

                    {columnTasks.map((t) => (
                      <button
                        className="kanban-card group"
                        key={t.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedId(t.id);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`pill priority-${t.priority}`}>{t.priority}</span>
                          {t.visibility === 'private' && (
                            <span className="text-[10px] font-mono text-content-muted flex items-center gap-1">
                              <LockKeyhole className="w-3 h-3 text-gold" /> Private
                            </span>
                          )}
                        </div>

                        <strong className="text-content-primary group-hover:text-gold transition-colors">
                          {t.title}
                        </strong>

                        <small className="text-content-muted">
                          {t.assigned_to ? names[t.assigned_to] || 'Member' : 'Unassigned'}
                        </small>

                        <div className="w-full flex items-center justify-between pt-1 border-t border-border-subtle">
                          <span className={`pill assign-${t.assignment_state}`}>{t.assignment_state}</span>
                          {t.due_at && (
                            <span className="text-[10px] font-mono text-content-muted">
                              {new Date(t.due_at).toLocaleDateString('en-IN')}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer Note */}
      <footer className="footer-note">
        <ShieldCheck className="w-4 h-4 text-gold" />
        <span>
          Private tasks are strictly visible only to their creator. Shared tasks require room membership.
          Both Sreesh and Mrithula have equal delegation authority.
        </span>
      </footer>

      {/* =========================================================================
          TASK EDITOR MODAL (NEW / EDIT)
      ========================================================================= */}
      {editor && (
        <div className="overlay" role="presentation" onMouseDown={() => setEditor(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={editor === 'edit' ? 'Edit Assignment' : 'New Assignment'}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">THE QUEST BOARD</span>
                <h2 className="text-2xl font-serif font-bold text-content-primary">
                  {editor === 'edit' ? 'Edit Assignment' : 'Create New Assignment'}
                </h2>
              </div>
              <button className="icon-btn" aria-label="Close" onClick={() => setEditor(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <TaskEditorForm
              initial={editor === 'edit' && selected ? selected : undefined}
              people={people}
              self={me}
              onClose={() => setEditor(null)}
              onSave={handleCreateOrEditTask}
            />
          </section>
        </div>
      )}

      {/* =========================================================================
          TASK DETAIL DRAWER
      ========================================================================= */}
      {selected && !editor && (
        <div className="overlay drawer-overlay" onMouseDown={() => setSelectedId(null)}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Task ${selected.title}`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="drawer-top">
              <span className="eyebrow">QUEST DETAILS / {selected.id.slice(0, 8)}</span>
              <button
                className="icon-btn"
                aria-label="Close task details"
                onClick={() => setSelectedId(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="drawer-title">{selected.title}</h2>

            <div className="chip-row">
              <span className={`pill priority-${selected.priority}`}>{selected.priority}</span>
              <span className="pill">
                {selected.visibility === 'private' ? (
                  <>
                    <LockKeyhole className="w-3 h-3 text-gold" /> Private Quest
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 text-emerald-400" /> Shared Workspace
                  </>
                )}
              </span>
              <span className={`pill assign-${selected.assignment_state}`}>{selected.assignment_state}</span>
            </div>

            <div className="kv">
              <span>Created by</span>
              <strong>{names[selected.created_by] || 'Member'}</strong>
              <span>Assigned to</span>
              <strong>{selected.assigned_to ? names[selected.assigned_to] || 'Member' : 'Unassigned'}</strong>
              <span>Due Date</span>
              <strong>{niceDate(selected.due_at)}</strong>
              <span>Current Status</span>
              <strong>{statusName[selected.status]}</strong>
            </div>

            {selected.tags.length > 0 && (
              <div className="tags">
                {selected.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
            )}

            {selected.description ? (
              <p className="description">{selected.description}</p>
            ) : (
              <p className="sub">No description provided yet.</p>
            )}

            {/* Decision prompt if pending for active user */}
            {selected.assignment_state === 'pending' && selected.assigned_to === me && (
              <div className="decision my-4">
                <h3>You've been assigned this quest</h3>
                <p>Accept it to begin working or decline to return it to the creator.</p>
                <div className="row-actions mt-3">
                  <button
                    className="primary"
                    onClick={() => handleRespondAssignment(selected.id, 'accept')}
                  >
                    <Check className="w-4 h-4" /> Accept Assignment
                  </button>
                  <button
                    className="secondary"
                    onClick={() => handleRespondAssignment(selected.id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Move Task Status */}
            {selected.assignment_state === 'accepted' && (
              <div className="section">
                <h3>Move Status</h3>
                <select
                  value={selected.status}
                  onChange={(e) => handleUpdateStatus(selected.id, e.target.value as Status)}
                >
                  {statuses.map((s) => (
                    <option value={s} key={s}>
                      {statusName[s]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Checklist */}
            <div className="section">
              <h3>
                Checklist Steps{' '}
                <span className="sub">
                  {checklist.filter((c) => c.task_id === selected.id && c.done).length}/
                  {checklist.filter((c) => c.task_id === selected.id).length}
                </span>
              </h3>

              {checklist
                .filter((c) => c.task_id === selected.id)
                .map((item) => (
                  <label className="check-row" key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                    />
                    <span className={item.done ? 'strike' : ''}>{item.label}</span>
                  </label>
                ))}

              <form
                className="inline-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('step') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    handleAddChecklist(selected.id, input.value.trim());
                    input.value = '';
                  }
                }}
              >
                <input name="step" placeholder="Add a checklist step" maxLength={200} />
                <button className="secondary" type="submit">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Discussion Thread */}
            <div className="section">
              <h3>
                Discussion Thread{' '}
                <span className="sub">{comments.filter((c) => c.task_id === selected.id).length}</span>
              </h3>

              {comments.filter((c) => c.task_id === selected.id).length === 0 ? (
                <p className="sub">No comments yet. Share progress notes here.</p>
              ) : (
                comments
                  .filter((c) => c.task_id === selected.id)
                  .map((c) => (
                    <div className="comment" key={c.id}>
                      <div className="comment-top">
                        <strong>{names[c.author_id] || 'Member'}</strong>
                        <time>{niceDate(c.created_at)}</time>
                      </div>
                      <p>{c.body}</p>
                    </div>
                  ))
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const textarea = form.elements.namedItem('comment') as HTMLTextAreaElement;
                  if (textarea && textarea.value.trim()) {
                    handleAddComment(selected.id, textarea.value.trim());
                    textarea.value = '';
                  }
                }}
              >
                <textarea
                  name="comment"
                  className="small-textarea"
                  maxLength={4000}
                  placeholder="Add a message, update, or deliverable link..."
                />
                <button className="secondary" type="submit">
                  <MessageSquareText className="w-4 h-4" /> Post Comment
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="drawer-actions">
              {selected.created_by === me && (
                <>
                  <button
                    className="secondary"
                    onClick={() => {
                      soundFx.playClick();
                      setEditor('edit');
                    }}
                  >
                    Edit Task
                  </button>
                  <button className="danger" onClick={() => handleArchiveTask(selected.id)}>
                    Archive Task
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* =========================================================================
          INVITE MODAL (ONE-TIME CODE)
      ========================================================================= */}
      {showInvite && (
        <div className="overlay" onMouseDown={() => setShowInvite(false)}>
          <section
            className="invite-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className="icon-btn close"
              onClick={() => setShowInvite(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="eyebrow">COMMON ROOM / INVITATION</span>
            <h2>Bring someone into the room.</h2>
            <p className="sub">
              Share this one-time code privately with Mrithula or Sreesh. It expires after 7 days and can only be used once.
            </p>
            <div className="code-box my-3">
              <code>{inviteCode}</code>
              <button
                className="secondary"
                onClick={() => {
                  soundFx.playClick();
                  void navigator.clipboard.writeText(inviteCode);
                }}
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <p className="micro">
              They sign up using their own email account and paste this invitation code to connect the shared Common Room.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

// Form sub-component for task creation/editing
interface TaskEditorFormProps {
  initial?: Task;
  people: Profile[];
  self: string;
  onClose: () => void;
  onSave: (t: TaskInput) => Promise<void>;
}

const TaskEditorForm: React.FC<TaskEditorFormProps> = ({ initial, people, self, onClose, onSave }) => {
  const [form, setForm] = useState<TaskInput>(() =>
    initial
      ? {
          title: initial.title,
          description: initial.description,
          priority: initial.priority,
          due: toLocalInput(initial.due_at),
          assignee: initial.assigned_to || '',
          visibility: initial.visibility,
          tags: initial.tags.join(', '),
        }
      : { ...defaultTask, assignee: self }
  );

  const patch = (value: Partial<TaskInput>) => setForm((f) => ({ ...f, ...value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <label className="field">
        <span>Task Title</span>
        <input
          autoFocus
          required
          maxLength={180}
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          maxLength={20000}
          placeholder="Deliverables, scope, links, expectations..."
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </label>

      <div className="form-row">
        <label className="field">
          <span>Visibility</span>
          <select
            value={form.visibility}
            onChange={(e) =>
              patch({
                visibility: e.target.value as Visibility,
                assignee: e.target.value === 'private' ? self : form.assignee,
              })
            }
          >
            <option value="private">Private Quest (Me Only)</option>
            <option value="shared">Shared with the Room</option>
          </select>
        </label>

        <label className="field">
          <span>Assign To</span>
          <select
            value={form.visibility === 'private' ? self : form.assignee}
            disabled={form.visibility === 'private'}
            onChange={(e) => patch({ assignee: e.target.value })}
          >
            {form.visibility === 'shared' && <option value="">Unassigned</option>}
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id === self ? 'Myself' : p.display_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {form.visibility === 'shared' && form.assignee !== self && form.assignee !== '' && (
        <div className="hint">
          <Bell className="w-4 h-4 text-gold shrink-0" />
          <span>They will receive an Owl Post notification and can choose to accept or decline.</span>
        </div>
      )}

      <div className="form-row">
        <label className="field">
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(e) => patch({ priority: e.target.value as Priority })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        <label className="field">
          <span>Due Date & Time</span>
          <input
            type="datetime-local"
            value={form.due}
            onChange={(e) => patch({ due: e.target.value })}
          />
        </label>
      </div>

      <label className="field">
        <span>Tags (comma-separated)</span>
        <input
          value={form.tags}
          onChange={(e) => patch({ tags: e.target.value })}
          placeholder="attendance, frontend, design-system, academics"
        />
      </label>

      <div className="modal-actions">
        <button type="button" className="ghost" onClick={onClose}>
          Cancel
        </button>
        <button disabled={!form.title.trim()} className="primary" type="submit">
          <span>{initial ? 'Save Changes' : 'Create Assignment'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
