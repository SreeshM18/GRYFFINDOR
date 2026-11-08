import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, ShieldCheck, Sun } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { LeaveRequest, UserId } from '../../types/workOs';

export const LeavePage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserId>('sreesh');
  const [requests, setRequests] = useState<LeaveRequest[]>(workOs.getLeaveRequests(selectedUser));
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('exam_prep');
  const [reason, setReason] = useState('');

  const handleUserChange = (u: UserId) => {
    soundFx.playClick();
    setSelectedUser(u);
    setRequests(workOs.getLeaveRequests(u));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();
    const newReq = workOs.submitLeaveRequest({
      userId: selectedUser,
      startDate,
      endDate,
      leaveType,
      reason,
    });
    setRequests([newReq, ...requests]);
    setShowModal(false);
    setReason('');
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Operations</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
              Autonomous Approval Workflow
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-content-secondary">
            Manage academic leaves, exam preparation breaks, and planned studio holidays
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* User Switcher */}
          <div className="flex items-center gap-2">
            {(['sreesh', 'mrithula'] as const).map((id) => (
              <button
                key={id}
                onClick={() => handleUserChange(id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedUser === id
                    ? 'bg-burgundy text-white shadow-sm'
                    : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
                }`}
              >
                {id === 'sreesh' ? 'Sreesh' : 'Mrithula'}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Balance Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Exam Prep Leave</span>
          <div className="text-2xl font-display font-bold text-content-primary">6 Days</div>
          <p className="text-[10px] font-mono text-emerald-400">Available Balance</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Casual Leave</span>
          <div className="text-2xl font-display font-bold text-content-primary">8 Days</div>
          <p className="text-[10px] font-mono text-emerald-400">Available Balance</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Sick Leave</span>
          <div className="text-2xl font-display font-bold text-content-primary">5 Days</div>
          <p className="text-[10px] font-mono text-emerald-400">Available Balance</p>
        </div>

        <div className="p-5 rounded-2xl border border-border-subtle bg-surface-card space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Holidays 2026</span>
          <div className="text-2xl font-display font-bold text-content-primary">14 Days</div>
          <p className="text-[10px] font-mono text-content-muted">National Calendar</p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
        <h3 className="font-display font-bold text-lg text-content-primary">
          Leave History & Scheduled Time-Off
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-[11px] font-mono text-content-muted uppercase">
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">From</th>
                <th className="py-3 px-3">To</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Logged Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-burgundy-soft uppercase">
                    {req.leaveType.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 font-mono text-content-primary">{req.startDate}</td>
                  <td className="py-3 px-3 font-mono text-content-primary">{req.endDate}</td>
                  <td className="py-3 px-3 text-content-secondary max-w-xs truncate">{req.reason}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-semibold">
                      {req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-content-muted">{req.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border-strong bg-surface-card p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-lg text-content-primary">Submit Leave Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-content-muted">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveRequest['leaveType'])}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft"
                >
                  <option value="exam_prep">Exam Preparation Break</option>
                  <option value="academic">College Academic Obligation</option>
                  <option value="casual">Casual Time-Off</option>
                  <option value="sick">Medical / Sick Day</option>
                  <option value="vacation">Studio Vacation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-content-muted">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-content-muted">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-content-muted">Reason / Context</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for the schedule block..."
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary outline-none focus:border-burgundy-soft resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-border-subtle text-content-muted hover:text-content-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white font-semibold"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

