import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckSquare,
  FolderGit2,
  Calendar,
  BookOpen,
  Briefcase,
  GraduationCap,
  Play,
  Square,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  FileText,
  Monitor,
  Laptop,
  Smartphone,
  Wifi,
  Lock,
  CreditCard,
} from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_NOTES } from '../../data/initialData';
import { AttendanceRecord, FiveStatusModel } from '../../types/workOs';

export const DashboardOverview: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [activeClockIn, setActiveClockIn] = useState<AttendanceRecord | null>(null);
  const [sreeshPresence, setSreeshPresence] = useState(workOs.getUserPresence('sreesh'));
  const [mrithulaPresence, setMrithulaPresence] = useState(workOs.getUserPresence('mrithula'));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [statusSnapshot, setStatusSnapshot] = useState<FiveStatusModel | null>(null);

  const activeTasks = INITIAL_TASKS.filter((t) => t.status !== 'done');
  const userTasks = activeTasks.filter((t) => t.assignedTo === currentUser.id);

  const loadData = () => {
    setActiveClockIn(workOs.getActiveClockIn(currentUser.id));
    setSreeshPresence(workOs.getUserPresence('sreesh'));
    setMrithulaPresence(workOs.getUserPresence('mrithula'));
    setAttendanceRecords(workOs.getAttendanceRecords(currentUser.id));
    setStatusSnapshot(workOs.getFiveStatusSnapshot(currentUser.id));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const handleQuickClockIn = () => {
    soundFx.playChime();
    workOs.clockIn(currentUser.id);
    loadData();
  };

  const handleQuickClockOut = () => {
    soundFx.playChime();
    workOs.clockOut(currentUser.id);
    loadData();
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayRecord = attendanceRecords.find((r) => r.date === new Date().toISOString().split('T')[0]);
  const todayMinutes = todayRecord ? todayRecord.totalDurationMinutes : 0;
  const hours = Math.floor(todayMinutes / 60);
  const mins = todayMinutes % 60;
  const formattedHours = `${hours}h ${mins.toString().padStart(2, '0')}m`;

  return (
    <div className="space-y-10 max-w-7xl">
      {/* 01. EXECUTIVE PERSONALIZED GREETING & JARVIS MORNING BRIEFING */}
      <div
        data-theme-component="card"
        data-theme-id="executive-cockpit-card"
        className="relative rounded-3xl border border-border-subtle bg-gradient-to-br from-surface-card via-surface-card to-surface-elevated/80 p-6 sm:p-8 overflow-hidden shadow-xl space-y-6"
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold font-semibold">
                GRYFFINDOR • THE COMMON ROOM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-gold/90 border border-gold/30">
                JARVIS Executive Briefing
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-content-primary tracking-tight">
              {getGreeting()}, {currentUser.name.split(' ')[0]}.
            </h1>
            <p className="text-xs sm:text-sm font-mono text-content-secondary">
              Operational cockpit active. <span className="text-content-muted">({todayStr} • Bengaluru, IST • 24°C Clear)</span>
            </p>
          </div>

          {/* Quick Shift Clock In/Out Button */}
          <div className="flex items-center gap-3">
            {!activeClockIn ? (
              <button
                data-theme-component="button"
                data-theme-id="quick-clock-in-button"
                onClick={handleQuickClockIn}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-colors active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Clock In (Start Workday)</span>
              </button>
            ) : (
              <button
                onClick={handleQuickClockOut}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-colors active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Clock Out</span>
              </button>
            )}

            <Link
              to="/app/quests"
              onClick={() => soundFx.playClick()}
              className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-card border border-border-subtle text-content-primary font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Quest Board</span>
            </Link>
          </div>
        </div>

        {/* Real-Data Intelligence Grid (Deterministic JARVIS Briefing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-1">
          {/* 1. Today's Attendance & Shift Status */}
          <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-content-muted">
              <span className="flex items-center gap-1 text-content-secondary">
                <Clock className="w-3.5 h-3.5 text-burgundy-soft" />
                Work Attendance
              </span>
              <span className={activeClockIn ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {activeClockIn ? '● In Progress' : '○ Off-Duty'}
              </span>
            </div>
            <div className="text-xl font-mono font-bold text-content-primary">
              {formattedHours}
            </div>
            <p className="text-[10px] font-mono text-content-muted">
              {activeClockIn ? 'Live shift recorded to Ledger' : 'Tap Clock In above to begin'}
            </p>
          </div>

          {/* 2. Quests & Collaboration */}
          <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-content-muted">
              <span className="flex items-center gap-1 text-content-secondary">
                <CheckSquare className="w-3.5 h-3.5 text-gold" />
                Pending Quests
              </span>
              <span className="text-gold font-bold">The Great Hall</span>
            </div>
            <div className="text-xl font-display font-bold text-content-primary">
              {userTasks.length} <span className="text-xs font-mono text-content-muted">assigned to you</span>
            </div>
            <p className="text-[10px] font-mono text-content-muted">
              {activeTasks.length} total shared tasks across Common Room
            </p>
          </div>

          {/* 3. College Academics S7 */}
          <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-content-muted">
              <span className="flex items-center gap-1 text-content-secondary">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                Academics (S7)
              </span>
              <span className="text-blue-400 font-bold">88.5% Attd.</span>
            </div>
            <div className="text-xl font-display font-bold text-content-primary truncate">
              Distributed Systems
            </div>
            <p className="text-[10px] font-mono text-content-muted">
              Next Semester exam in 14 days • 4 Credits
            </p>
          </div>

          {/* 4. Vault & Studio Target */}
          <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-border-subtle space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-content-muted">
              <span className="flex items-center gap-1 text-content-secondary">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                The Vault & Milestones
              </span>
              <span className="text-emerald-400 font-bold">Healthy</span>
            </div>
            <div className="text-xl font-mono font-bold text-content-primary">
              ₹1,45,000 <span className="text-xs font-mono text-content-muted">Studio Net</span>
            </div>
            <p className="text-[10px] font-mono text-content-muted">
              3 Client deliverables on schedule
            </p>
          </div>
        </div>
      </div>

      {/* 01.5 PERSONAL ACCOUNT STATUS COCKPIT (Mac, iPhone, Windows Device & 5-Status Engine) */}
      {statusSnapshot && (
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-content-primary">
                The Common Room — Executive Cockpit ({currentUser.name})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                🟢 Session Protected
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-content-muted">
              <span>Device: <strong className="text-content-primary">{statusSnapshot.deviceStatus.deviceName}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Synced Just Now
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Account */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">Account</div>
              <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Signed In</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted mt-0.5">MFA Active</div>
            </div>

            {/* Website Activity */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">App Activity</div>
              <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted mt-0.5">Foreground</div>
            </div>

            {/* Work Status */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">Work Status</div>
              <div className="font-bold text-blue-400 mt-0.5 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{statusSnapshot.workStatus.replace('_', ' ')}</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted mt-0.5">Voluntary</div>
            </div>

            {/* Attendance */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">Attendance</div>
              <div className="font-bold text-burgundy-soft mt-0.5 capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy-soft" />
                <span>{activeClockIn ? 'Checked In' : 'Checked Out'}</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted mt-0.5">
                {activeClockIn ? 'Shift In Progress' : 'Off-duty'}
              </div>
            </div>

            {/* Working Time */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">Working Time</div>
              <div className="font-bold text-content-primary mt-0.5 font-mono">
                {formattedHours}
              </div>
              <div className="text-[10px] font-mono text-content-muted mt-0.5">Today</div>
            </div>

            {/* Next Scheduled */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
              <div className="text-[10px] font-mono text-content-muted uppercase">Next Milestone</div>
              <div className="font-bold text-content-primary mt-0.5 truncate">
                Architecture Review
              </div>
              <div className="text-[10px] font-mono text-burgundy-soft mt-0.5">17:00 IST</div>
            </div>
          </div>
        </div>
      )}

      {/* 02. DUAL STATUS & OPERATIONAL METRICS COCKPIT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* User 1 Status (Sreesh) */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">👤 Sreesh M</span>
            <span className="w-2 h-2 rounded-full bg-sreesh-light" />
          </div>
          <div className="font-semibold text-sm text-content-primary capitalize">
            {sreeshPresence.status.replace('_', ' ')}
          </div>
          <p className="text-[11px] text-content-secondary truncate italic">
            "{sreeshPresence.customStatus || 'Active on sprint'}"
          </p>
        </div>

        {/* User 2 Status (Mrithula) */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-content-muted">👤 Mrithula</span>
            <span className="w-2 h-2 rounded-full bg-mrithula-light" />
          </div>
          <div className="font-semibold text-sm text-content-primary capitalize">
            {mrithulaPresence.status.replace('_', ' ')}
          </div>
          <p className="text-[11px] text-content-secondary truncate italic">
            "{mrithulaPresence.customStatus || 'Reviewing tokens'}"
          </p>
        </div>

        {/* Today's Working Hours */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted text-xs font-mono">
            <span>Today's Hours</span>
            <Clock className="w-3.5 h-3.5 text-burgundy-soft" />
          </div>
          <div className="text-2xl font-mono font-bold text-content-primary">{formattedHours}</div>
          <p className="text-[10px] font-mono text-emerald-400">
            {activeClockIn ? 'Session active now' : 'Shift logged'}
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <div className="flex items-center justify-between text-content-muted text-xs font-mono">
            <span>Active Sprint Tasks</span>
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-bold text-content-primary">
            {userTasks.length} <span className="text-xs font-normal text-content-muted font-mono">assigned to you</span>
          </div>
          <p className="text-[10px] font-mono text-content-muted">{activeTasks.length} Total studio tasks</p>
        </div>
      </div>

      {/* 03. QUICK WORKSPACE MODULE ACCESS STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono text-content-secondary">
        <Link
          to="/app/attendance"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          ⏱️ Attendance
        </Link>
        <Link
          to="/app/tasks"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          ✅ My Tasks
        </Link>
        <Link
          to="/app/projects"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          📁 Shared Projects
        </Link>
        <Link
          to="/app/internships"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          🏢 Internships
        </Link>
        <Link
          to="/app/academics"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          🎓 Academics
        </Link>
        <Link
          to="/app/calendar"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          📅 Calendar
        </Link>
        <Link
          to="/app/notes"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          📝 Notes
        </Link>
        <Link
          to="/app/documents"
          onClick={() => soundFx.playClick()}
          className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated whitespace-nowrap transition-colors"
        >
          📂 Documents
        </Link>
      </div>

      {/* 04. MULTI-PANEL OPERATIONAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Tasks & Active Projects */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Tasks Widget */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-content-primary">Active Sprint Tasks</h3>
                <p className="text-xs text-content-muted">Tasks awaiting completion across projects</p>
              </div>
              <Link
                to="/app/tasks"
                onClick={() => soundFx.playClick()}
                className="text-xs font-mono text-burgundy-soft hover:underline flex items-center gap-1"
              >
                <span>Kanban Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {activeTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-content-primary">{task.title}</p>
                    <span className="text-[10px] font-mono text-content-muted">
                      Assigned to: {task.assignedTo === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-surface-card text-content-muted'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Widget */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-content-primary">Active Studio Projects</h3>
                <p className="text-xs text-content-muted">Repository linkage and deployment health</p>
              </div>
              <Link
                to="/app/projects"
                onClick={() => soundFx.playClick()}
                className="text-xs font-mono text-burgundy-soft hover:underline flex items-center gap-1"
              >
                <span>All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_PROJECTS.slice(0, 4).map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="uppercase text-burgundy-soft">{p.category}</span>
                    <span className="text-emerald-400">● LIVE</span>
                  </div>
                  <h4 className="font-semibold text-xs text-content-primary truncate">{p.title}</h4>
                  <p className="text-[11px] text-content-muted truncate">{p.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Deadlines & Recent Notes */}
        <div className="lg:col-span-4 space-y-8">
          {/* Upcoming Milestones & Deadlines */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
            <h3 className="font-display font-bold text-base text-content-primary flex items-center justify-between">
              <span>Upcoming Deadlines</span>
              <Calendar className="w-4 h-4 text-burgundy-soft" />
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1">
                <span className="font-mono text-[10px] text-burgundy-soft font-bold">Nov 18, 2026</span>
                <p className="font-medium text-content-primary">Raft Protocol Assignment Due</p>
                <p className="text-[10px] text-content-muted">CS601 Distributed Systems</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1">
                <span className="font-mono text-[10px] text-burgundy-soft font-bold">Nov 20, 2026</span>
                <p className="font-medium text-content-primary">National AI Challenge Submission</p>
                <p className="text-[10px] text-content-muted">Autonomous Agent Hackathon</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1">
                <span className="font-mono text-[10px] text-burgundy-soft font-bold">Dec 04, 2026</span>
                <p className="font-medium text-content-primary">Midterm Examination Window</p>
                <p className="text-[10px] text-content-muted">College Semester 7</p>
              </div>
            </div>
          </div>

          {/* Recent Technical Notes */}
          <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-content-primary">Recent Notes</h3>
              <Link
                to="/app/notes"
                onClick={() => soundFx.playClick()}
                className="text-[10px] font-mono text-burgundy-soft hover:underline"
              >
                Open Vault
              </Link>
            </div>

            <div className="space-y-2">
              {INITIAL_NOTES.map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-1 text-xs">
                  <p className="font-medium text-content-primary truncate">{note.title}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-content-muted">
                    <span>By {note.author === 'sreesh' ? 'Sreesh' : 'Mrithula'}</span>
                    <span>{note.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
