import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Smartphone,
  Monitor,
  ShieldCheck,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  Sparkles,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { DeviceSession, FiveStatusModel } from '../../types/workOs';

export const DeviceManagerPage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [statusSnapshot, setStatusSnapshot] = useState<FiveStatusModel | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = () => {
    setSessions(workOs.getDeviceSessions(currentUser.id));
    setStatusSnapshot(workOs.getFiveStatusSnapshot(currentUser.id));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  const handleRevoke = (sessionId: string) => {
    soundFx.playClick();
    workOs.revokeDeviceSession(currentUser.id, sessionId);
    loadData();
  };

  const handleRevokeAllOthers = () => {
    soundFx.playClick();
    workOs.revokeOtherDeviceSessions(currentUser.id);
    loadData();
  };

  const handleManualSync = () => {
    soundFx.playChime();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      loadData();
    }, 600);
  };

  const getDeviceIcon = (type: DeviceSession['deviceType']) => {
    switch (type) {
      case 'mac':
        return <Laptop className="w-5 h-5 text-content-primary" />;
      case 'iphone':
        return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'windows':
        return <Monitor className="w-5 h-5 text-burgundy-soft" />;
      default:
        return <Monitor className="w-5 h-5 text-content-muted" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Device Manager & Session Security
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Cross-Platform Ecosystem
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Mac, iPhone, and Windows active sessions, authentication events, and instant remote session revocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary text-xs font-mono transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-burgundy-soft' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            onClick={handleRevokeAllOthers}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium shadow-sm transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Revoke Other Devices</span>
          </button>
        </div>
      </div>

      {/* 5-STATUS ARCHITECTURAL BANNER (As specified in blueprint) */}
      {statusSnapshot && (
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-Dimensional Status Reconciliation</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Wifi className="w-3 h-3 animate-pulse" /> Live Realtime Link (22ms)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* 1. Login Status */}
            <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-1">
              <div className="text-[10px] font-mono text-content-muted uppercase">1. Login Status</div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Signed In</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted">Token Verified</div>
            </div>

            {/* 2. Application Status */}
            <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-1">
              <div className="text-[10px] font-mono text-content-muted uppercase">2. App Status</div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Window</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted">Foreground Window</div>
            </div>

            {/* 3. Work Status */}
            <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-1">
              <div className="text-[10px] font-mono text-content-muted uppercase">3. Work Status</div>
              <div className="flex items-center gap-1.5 font-semibold text-blue-400 capitalize">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>{statusSnapshot.workStatus.replace('_', ' ')}</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted">Voluntary Availability</div>
            </div>

            {/* 4. Attendance Status */}
            <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-1">
              <div className="text-[10px] font-mono text-content-muted uppercase">4. Attendance</div>
              <div className="flex items-center gap-1.5 font-semibold text-burgundy-soft capitalize">
                <span className="w-2 h-2 rounded-full bg-burgundy-soft" />
                <span>{statusSnapshot.attendanceStatus.replace('_', ' ')}</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted">Shift In Progress</div>
            </div>

            {/* 5. Device Status */}
            <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border-subtle space-y-1">
              <div className="text-[10px] font-mono text-content-muted uppercase">5. Connected Device</div>
              <div className="flex items-center gap-1.5 font-semibold text-content-primary truncate">
                <span>{statusSnapshot.deviceStatus.deviceName}</span>
              </div>
              <div className="text-[10px] font-mono text-content-muted">Synced: {statusSnapshot.deviceStatus.lastSyncTime}</div>
            </div>
          </div>
        </div>
      )}

      {/* Registered Device Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-content-primary">Active Device Sessions</h2>
          <span className="text-[10px] font-mono text-content-muted">{sessions.filter(s => s.sessionStatus === 'active').length} Authorized Devices</span>
        </div>

        <div className="space-y-3">
          {sessions.map((device) => {
            const isRevoked = device.sessionStatus === 'revoked';

            return (
              <div
                key={device.id}
                className={`p-5 rounded-2xl border transition-all ${
                  device.isCurrentDevice
                    ? 'border-burgundy/40 bg-surface-card shadow-sm'
                    : isRevoked
                    ? 'border-border-subtle bg-surface-card/40 opacity-50'
                    : 'border-border-subtle bg-surface-card hover:border-border-strong'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle shrink-0">
                      {getDeviceIcon(device.deviceType)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-content-primary">
                          {device.deviceName}
                        </span>
                        {device.isCurrentDevice && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-burgundy/20 text-burgundy-soft font-bold uppercase">
                            This Device
                          </span>
                        )}
                        {isRevoked ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 uppercase">
                            Revoked
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-content-secondary">
                        {device.os} • {device.browser} • {device.location}
                      </div>

                      <div className="text-[10px] font-mono text-content-muted flex items-center gap-3 pt-0.5">
                        <span>Last active: {device.lastActive}</span>
                        <span>•</span>
                        <span>Client: {device.appVersion}</span>
                      </div>
                    </div>
                  </div>

                  {!device.isCurrentDevice && !isRevoked && (
                    <button
                      onClick={() => handleRevoke(device.id)}
                      className="px-3 py-1.5 rounded-xl border border-border-subtle hover:border-red-500/40 text-xs font-mono text-content-secondary hover:text-red-400 transition-colors self-start sm:self-center"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Native Companions Info */}
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-burgundy-soft" />
          <h3 className="text-sm font-semibold text-content-primary">
            Ecosystem Native Client Bridges
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-2">
            <div className="font-bold text-content-primary flex items-center gap-2">
              <Laptop className="w-4 h-4 text-content-primary" />
              <span>macOS Companion</span>
            </div>
            <p className="text-content-secondary text-[11px] leading-relaxed">
              Lightweight menu-bar agent for 1-click clock-in, Pomodoro timer shortcuts, and system presence.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">Ready for Tauri / Swift compilation</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-2">
            <div className="font-bold text-content-primary flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>iPhone PWA & iOS</span>
            </div>
            <p className="text-content-secondary text-[11px] leading-relaxed">
              Install via Safari <em>"Add to Home Screen"</em> for full offline app manifest, tactile Web Audio feedback, and push alerts.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">PWA Manifest Configured</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border-subtle space-y-2">
            <div className="font-bold text-content-primary flex items-center gap-2">
              <Monitor className="w-4 h-4 text-burgundy-soft" />
              <span>Windows Desktop</span>
            </div>
            <p className="text-content-secondary text-[11px] leading-relaxed">
              Runs as a background tray utility with global keyboard shortcuts (`Ctrl+K`), audio synthesizer, and dev server synchronization.
            </p>
            <div className="text-[10px] font-mono text-emerald-400">Active (PID: Port 5173 Host)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

