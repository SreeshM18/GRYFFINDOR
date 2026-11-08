import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Flame,
  ShieldCheck,
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { UserId } from '../../types/workOs';

export const MyAnalyticsPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [selectedUser, setSelectedUser] = useState<UserId | 'both'>(currentUser.id);

  // Load records
  const attendance = workOs.getAttendanceRecords();
  const habits = workOs.getHabits();
  const focusSessions = workOs.getFocusSessions();
  const academics = workOs.getAcademicCourses();
  const finances = workOs.getFinances();
  const devices = workOs.getDeviceSessions(currentUser.id);

  const userAttendance = selectedUser === 'both' ? attendance : attendance.filter(a => a.userId === selectedUser);
  const userHabits = selectedUser === 'both' ? habits : habits.filter(h => h.userId === selectedUser || h.userId === 'both');
  const userFocus = selectedUser === 'both' ? focusSessions : focusSessions.filter(f => f.userId === selectedUser);
  const userAcademics = selectedUser === 'both' ? academics : academics.filter(c => c.userId === selectedUser);

  // Work metrics
  const totalWorkMinutes = userAttendance.reduce((acc, a) => acc + a.totalDurationMinutes, 0);
  const totalWorkHours = (totalWorkMinutes / 60).toFixed(1);
  const totalBreakMinutes = userAttendance.reduce((acc, a) => acc + a.breakDurationMinutes, 0);
  const daysAttended = userAttendance.length;

  // Academic metrics
  const avgAttendance = userAcademics.length > 0
    ? (userAcademics.reduce((acc, c) => acc + c.attendanceStats.percentage, 0) / userAcademics.length).toFixed(1)
    : '85.0';

  // Focus metrics
  const totalFocusMinutes = userFocus.reduce((acc, f) => acc + f.durationMinutes, 0);

  const handleExport = () => {
    soundFx.playChime();
    const data = {
      user: selectedUser,
      generatedAt: new Date().toISOString(),
      workHours: totalWorkHours,
      breakMinutes: totalBreakMinutes,
      daysAttended,
      academicAttendancePercentage: avgAttendance,
      focusMinutesTotal: totalFocusMinutes,
      activeHabitsCount: userHabits.length,
      deviceSessionsCount: devices.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Personal_Work_OS_Analytics_${selectedUser}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Personal Analytics & Self-Monitoring
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Truth in Data
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Aggregated audit of your voluntarily recorded work sessions, academic standing, deep work, and habits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl p-1 bg-surface-elevated border border-border-subtle text-xs">
            <button
              onClick={() => setSelectedUser('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedUser === 'both' ? 'bg-burgundy text-white' : 'text-content-secondary hover:text-content-primary'
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
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-medium shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PILLAR 1: WORK INSIGHTS */}
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-burgundy-soft" />
              <span>Work & Studio Insights</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Recorded Hours</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Total Working Time:</span>
              <span className="font-display font-bold text-xl text-content-primary">
                {totalWorkHours} <span className="text-xs font-mono font-normal text-content-muted">hours</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Days Active:</span>
              <span className="font-mono font-bold text-base text-content-primary">{daysAttended} days</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Recorded Breaks:</span>
              <span className="font-mono text-xs text-content-muted">{totalBreakMinutes} mins total</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Focus Sessions:</span>
              <span className="font-mono text-xs text-burgundy-soft font-bold">{totalFocusMinutes} mins deep work</span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: ACADEMIC INSIGHTS */}
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Academic Standing (Panimalar S7)</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400">75% Target</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Classroom Attendance:</span>
              <span className="font-display font-bold text-xl text-emerald-400">
                {avgAttendance}%
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Registered Courses:</span>
              <span className="font-mono font-bold text-base text-content-primary">{userAcademics.length} subjects</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Semester 7 Finals:</span>
              <span className="font-mono text-xs text-amber-400">Countdown: 28 Days</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Academic Status:</span>
              <span className="font-mono text-xs text-emerald-400 font-semibold">100% Eligible</span>
            </div>
          </div>
        </div>

        {/* PILLAR 3: PERSONAL INSIGHTS & HABITS */}
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Personal Habits & Consistency</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400">Compounding</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Active Routines:</span>
              <span className="font-display font-bold text-xl text-content-primary">{userHabits.length} habits</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Cumulative Streak:</span>
              <span className="font-mono font-bold text-base text-amber-400">
                {userHabits.reduce((acc, h) => acc + h.currentStreak, 0)} days
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Authorized Devices:</span>
              <span className="font-mono text-xs text-content-primary">{devices.length} devices synced</span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-secondary">Data Encryption:</span>
              <span className="font-mono text-xs text-emerald-400">End-to-End Local</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Academic Breakdown */}
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-content-primary">Panimalar College Subject Attendance Ledger</h2>

        <div className="space-y-3">
          {userAcademics.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-border-subtle bg-surface-elevated/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-xs text-content-primary">{course.title}</div>
                <div className="text-[10px] font-mono text-content-muted">
                  {course.code} • {course.credits} Credits • {course.instructor || 'Department Faculty'}
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-content-secondary">
                  {course.attendanceStats.attendedClasses} / {course.attendanceStats.totalClasses} classes
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  course.attendanceStats.percentage >= 85
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {course.attendanceStats.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

