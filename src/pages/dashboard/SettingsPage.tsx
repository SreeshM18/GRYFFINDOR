import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, User, Globe, Save, Check } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const SettingsPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [timezone, setTimezone] = useState('Asia/Kolkata (GMT+05:30)');
  const [privateNotesDefault, setPrivateNotesDefault] = useState(true);
  const [voluntaryStatusShare, setVoluntaryStatusShare] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="space-y-1 border-b border-border-subtle pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: System & Privacy</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-emerald-400">
            Zero Surveillance Policy
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-content-primary">
          Work OS Settings & Privacy Boundaries
        </h1>
        <p className="text-xs text-content-secondary">
          Configure personal credentials, working hour schedules, and strict privacy boundary rules
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
          <h3 className="font-display font-bold text-lg text-content-primary">Profile Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-muted">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-muted">Account Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
              />
            </div>
          </div>
        </div>

        {/* Working Hours & Timezone */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
          <h3 className="font-display font-bold text-lg text-content-primary">Working Hours & Timezone</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-muted">Timezone Reference</label>
              <input
                type="text"
                disabled
                value={timezone}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-muted font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-content-muted">Configured Shift Schedule</label>
              <input
                type="text"
                disabled
                value="09:30 AM — 06:00 PM IST (Late after 09:30)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-muted font-mono"
              />
            </div>
          </div>
        </div>

        {/* Privacy Invariants & Consent Controls */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-4">
          <h3 className="font-display font-bold text-lg text-content-primary">Privacy & Boundary Controls</h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle cursor-pointer">
              <input
                type="checkbox"
                checked={privateNotesDefault}
                onChange={(e) => setPrivateNotesDefault(e.target.checked)}
                className="rounded text-burgundy focus:ring-0"
              />
              <div>
                <p className="font-semibold text-content-primary">Keep Personal Notes Private by Default</p>
                <p className="text-content-muted text-[11px]">Notes remain strictly inaccessible to other collaborators unless explicitly marked as Shared.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated/40 border border-border-subtle cursor-pointer">
              <input
                type="checkbox"
                checked={voluntaryStatusShare}
                onChange={(e) => setVoluntaryStatusShare(e.target.checked)}
                className="rounded text-burgundy focus:ring-0"
              />
              <div>
                <p className="font-semibold text-content-primary">Enable Voluntary Real-Time Status Broadcast</p>
                <p className="text-content-muted text-[11px]">Allows sharing your current availability (Available, Working, On Break) with zero background monitoring.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white font-semibold text-xs shadow-lg transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

