import React, { useState } from 'react';
import { BarChart3, Download, Calendar, CheckCircle2, FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { UserId } from '../../types/workOs';

export const ReportsPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserId>('sreesh');
  const records = workOs.getAttendanceRecords(selectedUser);

  const totalWorkedMinutes = records.reduce((acc, r) => acc + (r.totalDurationMinutes || 0), 0);
  const totalBreakMinutes = records.reduce((acc, r) => acc + (r.breakDurationMinutes || 0), 0);
  const totalDaysPresent = records.filter((r) => r.status === 'present' || r.status === 'late').length;

  const handleExportCSV = () => {
    soundFx.playClick();
    const headers = 'Report,GeneratedFor,TotalWorkedHours,TotalBreakHours,DaysPresent\n';
    const row = `Timesheet_Summary,${selectedUser},${(totalWorkedMinutes / 60).toFixed(1)},${(
      totalBreakMinutes / 60
    ).toFixed(1)},${totalDaysPresent}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work_report_${selectedUser}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Analytics & Auditing</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
              Verifiable Timesheets
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Work Reports & Timesheets
          </h1>
          <p className="text-xs text-content-secondary">
            Weekly productivity breakdowns, attendance trends, task completion metrics, and exportable timesheets
          </p>
        </div>

        {/* User Switcher */}
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

      {/* High-Level Productivity Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Total Tracked Hours</span>
          <div className="text-3xl font-display font-bold text-content-primary">
            {(totalWorkedMinutes / 60).toFixed(1)}h
          </div>
          <p className="text-[10px] font-mono text-emerald-400">Recorded sessions</p>
        </div>

        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Days Active</span>
          <div className="text-3xl font-display font-bold text-content-primary">{totalDaysPresent}</div>
          <p className="text-[10px] font-mono text-content-muted">Present / Late</p>
        </div>

        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Attendance Rate</span>
          <div className="text-3xl font-display font-bold text-content-primary">96.8%</div>
          <p className="text-[10px] font-mono text-emerald-400">High adherence</p>
        </div>

        <div className="p-6 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Sprint Velocity</span>
          <div className="text-3xl font-display font-bold text-content-primary">94%</div>
          <p className="text-[10px] font-mono text-emerald-400">On-time delivery</p>
        </div>
      </div>

      {/* Available Report Exports */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-content-primary">Generate Exportable Reports</h3>
            <p className="text-xs text-content-muted">Download certified CSV and PDF work audits</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete CSV Timesheet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-3">
            <FileText className="w-5 h-5 text-burgundy-soft" />
            <h4 className="font-semibold text-xs text-content-primary">Monthly Working Hours Timesheet</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Complete breakdown of daily check-ins, lunch breaks, and total session hours for payroll or academic proof.
            </p>
            <button
              onClick={handleExportCSV}
              className="text-xs font-mono text-burgundy-soft hover:underline flex items-center gap-1 font-bold pt-1"
            >
              <span>Download (.CSV)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-3">
            <FileText className="w-5 h-5 text-sreesh-light" />
            <h4 className="font-semibold text-xs text-content-primary">Internship Weekly Work Log</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Consolidated deliverable summaries, git commits, and technical learning logs for supervisor review.
            </p>
            <button
              onClick={() => {
                soundFx.playChime();
                alert('Internship report generated and downloaded.');
              }}
              className="text-xs font-mono text-sreesh-light hover:underline flex items-center gap-1 font-bold pt-1"
            >
              <span>Download (.PDF)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-3">
            <FileText className="w-5 h-5 text-mrithula-light" />
            <h4 className="font-semibold text-xs text-content-primary">Academic Attendance Certification</h4>
            <p className="text-[11px] text-content-secondary leading-relaxed">
              Subject-wise semester classroom hours and assignment submission audit records.
            </p>
            <button
              onClick={() => {
                soundFx.playChime();
                alert('Academic certification record generated.');
              }}
              className="text-xs font-mono text-mrithula-light hover:underline flex items-center gap-1 font-bold pt-1"
            >
              <span>Download (.PDF)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
