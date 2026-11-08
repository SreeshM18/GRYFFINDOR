import React, { useState } from 'react';
import { Save, Check, RefreshCw, FileText } from 'lucide-react';
import { PROFILES_DATA } from '../../data/initialData';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { ProfileId } from '../../types';

export const DashboardContent: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<ProfileId>('sreesh');
  const [profileData, setProfileData] = useState(PROFILES_DATA);
  const [saved, setSaved] = useState(false);

  const current = profileData[activeProfile];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playChime();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-content-primary">Portfolio Headless CMS</h1>
          <p className="text-xs text-content-secondary">
            Manage public portfolio biographies, taglines, and focus areas live
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center gap-2">
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                setActiveProfile(id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeProfile === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {profileData[id].name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl border border-border-subtle bg-surface-card space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-content-primary">
              Editing: {current.name}
            </h2>
            <span className="text-[10px] font-mono text-content-muted">
              Role: {current.title}
            </span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Changes Published!' : 'Publish to Live'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Headline Tagline</label>
            <input
              type="text"
              value={current.tagline}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  [activeProfile]: { ...current, tagline: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Professional Biography</label>
            <textarea
              rows={4}
              value={current.bio}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  [activeProfile]: { ...current, bio: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Public Contact Email</label>
            <input
              type="email"
              value={current.email}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  [activeProfile]: { ...current, email: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-content-muted">Location / Base</label>
            <input
              type="text"
              value={current.location}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  [activeProfile]: { ...current, location: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs text-content-primary outline-none focus:border-burgundy-soft"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
