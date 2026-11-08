import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Check, Sparkles, Activity } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { UserStatusType, UserId, UserPresence } from '../../types/workOs';

export const LiveStatusPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [sreeshPresence, setSreeshPresence] = useState<UserPresence>(workOs.getUserPresence('sreesh'));
  const [mrithulaPresence, setMrithulaPresence] = useState<UserPresence>(workOs.getUserPresence('mrithula'));

  const [activeUser, setActiveUser] = useState<UserId>(currentUser.id);
  const [currentStatus, setCurrentStatus] = useState<UserStatusType>('working');
  const [customStatus, setCustomStatus] = useState('');
  const [currentProject, setCurrentProject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const presence = workOs.getUserPresence(activeUser);
    setCurrentStatus(presence.status);
    setCustomStatus(presence.customStatus || '');
    setCurrentProject(presence.currentProject || '');
    setCurrentTask(presence.currentTask || '');
  }, [activeUser]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();
    const updated = workOs.updateUserPresence(activeUser, {
      status: currentStatus,
      customStatus,
      currentProject,
      currentTask,
    });

    if (activeUser === 'sreesh') setSreeshPresence(updated);
    if (activeUser === 'mrithula') setMrithulaPresence(updated);

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const statusOptions: { id: UserStatusType; label: string; color: string; desc: string }[] = [
    { id: 'available', label: 'Available', color: 'bg-emerald-400', desc: 'Open for questions & ad-hoc syncs' },
    { id: 'working', label: 'Working (Deep Focus)', color: 'bg-blue-400', desc: 'Executing deep code or design work' },
    { id: 'busy', label: 'Busy', color: 'bg-amber-400', desc: 'Engaged in high-priority delivery' },
    { id: 'on_break', label: 'On Break', color: 'bg-orange-400', desc: 'Stepped away for coffee, lunch or rest' },
    { id: 'do_not_disturb', label: 'Do Not Disturb', color: 'bg-red-500', desc: 'Urgent focus — notifications suppressed' },
    { id: 'away', label: 'Away', color: 'bg-purple-400', desc: 'Temporarily away from desk' },
    { id: 'offline', label: 'Offline', color: 'bg-gray-500', desc: 'Shift completed for today' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Operations</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
              User-Controlled • Zero Surveillance
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Real-Time Availability & Work Status
          </h1>
          <p className="text-xs text-content-secondary">
            Broadcast voluntary availability, active project focus, and current tasks to each other
          </p>
        </div>

        {/* User Switcher */}
        <div className="flex items-center gap-2">
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                setActiveUser(id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeUser === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              Update as {id === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE TEAM STATUS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SREESH STATUS CARD */}
        <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-sreesh-light" />
              <h3 className="font-display font-bold text-lg text-content-primary">Sreesh M</h3>
            </div>
            <span className="text-[10px] font-mono text-content-muted">Last updated: {sreeshPresence.updatedAt}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                statusOptions.find((s) => s.id === sreeshPresence.status)?.color || 'bg-blue-400'
              }`} />
              <span className="text-xs font-mono font-bold uppercase text-content-primary">
                {sreeshPresence.status.replace('_', ' ')}
              </span>
            </div>
            {sreeshPresence.customStatus && (
              <p className="text-xs text-content-secondary font-medium italic">
                "{sreeshPresence.customStatus}"
              </p>
            )}
            <div className="pt-2 border-t border-border-subtle space-y-1 text-xs">
              <p className="text-content-muted"><strong>Project:</strong> <span className="text-content-primary">{sreeshPresence.currentProject || '—'}</span></p>
              <p className="text-content-muted"><strong>Focus:</strong> <span className="text-content-primary">{sreeshPresence.currentTask || '—'}</span></p>
            </div>
          </div>
        </div>

        {/* MRITHULA STATUS CARD */}
        <div className="p-6 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-mrithula-light" />
              <h3 className="font-display font-bold text-lg text-content-primary">Mrithula</h3>
            </div>
            <span className="text-[10px] font-mono text-content-muted">Last updated: {mrithulaPresence.updatedAt}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                statusOptions.find((s) => s.id === mrithulaPresence.status)?.color || 'bg-emerald-400'
              }`} />
              <span className="text-xs font-mono font-bold uppercase text-content-primary">
                {mrithulaPresence.status.replace('_', ' ')}
              </span>
            </div>
            {mrithulaPresence.customStatus && (
              <p className="text-xs text-content-secondary font-medium italic">
                "{mrithulaPresence.customStatus}"
              </p>
            )}
            <div className="pt-2 border-t border-border-subtle space-y-1 text-xs">
              <p className="text-content-muted"><strong>Project:</strong> <span className="text-content-primary">{mrithulaPresence.currentProject || '—'}</span></p>
              <p className="text-content-muted"><strong>Focus:</strong> <span className="text-content-primary">{mrithulaPresence.currentTask || '—'}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE STATUS FORM */}
      <form onSubmit={handleUpdate} className="p-6 sm:p-8 rounded-3xl border border-border-strong bg-surface-card space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-content-primary">
              Broadcast Status for {activeUser === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
            </h3>
            <p className="text-xs text-content-muted">Choose your current availability state and voluntarily shared task</p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
          >
            {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Activity className="w-4 h-4" />}
            <span>{savedNotice ? 'Status Broadcasted!' : 'Update Presence'}</span>
          </button>
        </div>

        {/* Status Option Radios */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-content-muted">Availability Preset</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStatus(opt.id);
                }}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                  currentStatus === opt.id
                    ? 'border-burgundy-soft bg-surface-elevated shadow-sm'
                    : 'border-border-subtle bg-surface-elevated/40 hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                  <span className="font-semibold text-content-primary">{opt.label}</span>
                </div>
                <p className="text-[10px] text-content-muted leading-tight">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Voluntary Task Sharing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Custom Status Note</label>
            <input
              type="text"
              value={customStatus}
              onChange={(e) => setCustomStatus(e.target.value)}
              placeholder="e.g. In deep work sprint until 2 PM"
              className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Current Project</label>
            <input
              type="text"
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              placeholder="e.g. SREESH × MRITHULA"
              className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Current Active Task</label>
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="e.g. Implementing Work OS architecture"
              className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border-subtle flex items-center gap-2.5 text-xs text-content-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Privacy Guarantee: Work OS never monitors background processes, keystrokes, webcams, or geo-coordinates. Status updates are 100% voluntary and user-controlled.
          </span>
        </div>
      </form>
    </div>
  );
};

