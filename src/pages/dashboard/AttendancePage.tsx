import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { AttendanceRecord, UserId } from '../../types/workOs';

export const AttendancePage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [selectedUser, setSelectedUser] = useState<UserId>(currentUser.id);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeClockIn, setActiveClockIn] = useState<AttendanceRecord | null>(null);
  const [clockInNotes, setClockInNotes] = useState('');
  const [breakReason, setBreakReason] = useState('Lunch Break');
  const [activeBreak, setActiveBreak] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const loadData = () => {
    const list = workOs.getAttendanceRecords(selectedUser);
    setRecords(list);
    const active = workOs.getActiveClockIn(selectedUser);
    setActiveClockIn(active);

    if (active) {
      const inBreak = active.breaks.some((b) => !b.end);
      setActiveBreak(inBreak);

      const startTime = new Date(active.clockInTime).getTime();
      const now = new Date().getTime();
      setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
    } else {
      setActiveBreak(false);
      setElapsedSeconds(0);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      if (activeClockIn && !activeClockIn.clockOutTime) {
        const startTime = new Date(activeClockIn.clockInTime).getTime();
        const now = new Date().getTime();
        setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedUser, activeClockIn]);

  const handleClockIn = () => {
    soundFx.playChime();
    workOs.clockIn(selectedUser, clockInNotes);
    setClockInNotes('');
    loadData();
  };

  const handleClockOut = () => {
    soundFx.playChime();
    workOs.clockOut(selectedUser);
    loadData();
  };

  const handleStartBreak = () => {
    soundFx.playClick();
    workOs.startBreak(selectedUser, breakReason);
    loadData();
  };

  const handleEndBreak = () => {
    soundFx.playClick();
    workOs.endBreak(selectedUser);
    loadData();
  };

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatHoursMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  };

  // Export CSV
  const handleExportCSV = () => {
    soundFx.playClick();
    const headers = 'ID,Date,User,ClockIn,ClockOut,WorkedMinutes,BreakMinutes,Status,VerificationType\n';
    const rows = records
      .map(
        (r) =>
          `${r.id},${r.date},${r.userId},${r.clockInTime},${r.clockOutTime || ''},${r.totalDurationMinutes},${
            r.breakDurationMinutes
          },${r.status},${r.verificationType}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedUser}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Operations</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
              UTC Storage • Asia/Kolkata
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Attendance & Working Hours
          </h1>
          <p className="text-xs text-content-secondary">
            Daily clock-in/out, working-hour tracking, break management, and verifiable audit records
          </p>
        </div>

        {/* User Switcher for Two-Person Studio */}
        <div className="flex items-center gap-2">
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                setSelectedUser(id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUser === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {id === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
            </button>
          ))}
        </div>
      </div>

      {/* CLOCK-IN / CLOCK-OUT LIVE CONTROL CARD */}
      <div
        data-theme-component="card"
        data-theme-id="attendance-summary"
        className="p-6 sm:p-8 rounded-3xl border border-border-strong bg-surface-card space-y-6 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${activeClockIn ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <h2 className="text-xl sm:text-2xl font-display font-bold text-content-primary">
                {activeClockIn ? (activeBreak ? 'Currently on Break' : 'Currently Clocked In') : 'Not Clocked In'}
              </h2>
            </div>
            <p className="text-xs text-content-secondary font-mono">
              {activeClockIn
                ? `Clocked in at ${new Date(activeClockIn.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Configured standard shift: 09:30 AM — 06:00 PM IST'}
            </p>
          </div>

          {/* Live Timer Display */}
          <div className="text-left md:text-right space-y-1">
            <span className="text-[10px] font-mono text-content-muted uppercase">Today's Session Duration</span>
            <div className="text-4xl sm:text-5xl font-mono font-bold text-content-primary tracking-tight">
              {formatTimer(elapsedSeconds)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle">
          {!activeClockIn ? (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Optional shift notes (e.g. Sprint kickoff, Figma review)..."
                value={clockInNotes}
                onChange={(e) => setClockInNotes(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft flex-1 sm:w-80"
              />
              <button
                data-theme-component="button"
                data-theme-id="attendance-clock-in"
                onClick={handleClockIn}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Clock In Now</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleClockOut}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Clock Out</span>
              </button>

              {!activeBreak ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                    placeholder="Break reason"
                    className="px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none w-36"
                  />
                  <button
                    onClick={handleStartBreak}
                    className="px-4 py-2.5 rounded-xl border border-border-strong bg-surface-elevated hover:bg-surface-elevated/80 text-content-primary font-medium text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <span>Start Break</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEndBreak}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Coffee className="w-4 h-4" />
                  <span>End Break & Resume</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Verification and Audit Notice */}
        <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center justify-between text-[11px] font-mono text-content-muted">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit Guarantee: Server timestamps recorded in UTC with zero unverified overwrites.</span>
          </div>
          <span className="hidden sm:inline">Self-Reported Attendance Tier</span>
        </div>
      </div>

      {/* ATTENDANCE RECORDS TABLE */}
      <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-content-primary">
              Recent Attendance Ledger
            </h3>
            <p className="text-xs text-content-muted">
              Historical clock-ins, duration calculations, and break times
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 text-xs font-mono text-content-primary transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-burgundy-soft" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-[11px] font-mono text-content-muted uppercase">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Check-In</th>
                <th className="py-3 px-3">Check-Out</th>
                <th className="py-3 px-3">Worked Hours</th>
                <th className="py-3 px-3">Break</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-content-primary">{r.date}</td>
                  <td className="py-3 px-3 font-mono text-content-secondary">
                    {new Date(r.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 font-mono text-content-secondary">
                    {r.clockOutTime
                      ? new Date(r.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Active'}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-content-primary">
                    {formatHoursMins(r.totalDurationMinutes)}
                  </td>
                  <td className="py-3 px-3 font-mono text-content-muted">
                    {r.breakDurationMinutes > 0 ? `${r.breakDurationMinutes}m` : '0m'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        r.status === 'present'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : r.status === 'late'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-content-muted">
                    {r.verificationType === 'self_reported' ? 'Self-Reported' : 'Employer-Verified'}
                  </td>
                  <td className="py-3 px-3 text-content-secondary truncate max-w-xs">
                    {r.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

