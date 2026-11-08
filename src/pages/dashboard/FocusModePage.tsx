import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';
import { FocusSession } from '../../types/workOs';

export const FocusModePage: React.FC = () => {
  const currentUser = workOs.getCurrentUser();
  const [mode, setMode] = useState<'pomodoro' | 'deep_work' | 'quick_sprint'>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundscape, setSoundscape] = useState<'none' | 'brown' | 'pink' | 'white' | 'binaural'>('none');
  const [volume, setVolume] = useState(0.04);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [selectedTask, setSelectedTask] = useState('Antigravity Core Architecture');
  const [sessionNotes, setSessionNotes] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const presets = [
    { id: 'sprint', label: '15m Sprint', minutes: 15, mode: 'quick_sprint' as const },
    { id: 'pomodoro', label: '25m Pomodoro', minutes: 25, mode: 'pomodoro' as const },
    { id: 'deep_work', label: '50m Deep Work', minutes: 50, mode: 'deep_work' as const },
  ];

  useEffect(() => {
    setSessions(workOs.getFocusSessions(currentUser.id));
  }, [currentUser.id]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSelectPreset = (p: typeof presets[0]) => {
    soundFx.playClick();
    setIsRunning(false);
    setMode(p.mode);
    setCustomMinutes(p.minutes);
    setSecondsLeft(p.minutes * 60);
  };

  const toggleRunning = () => {
    soundFx.playClick();
    if (!isRunning) {
      if (soundscape !== 'none') {
        soundFx.startNoise(soundscape, volume);
      }
    } else {
      soundFx.stopNoise();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    soundFx.playClick();
    setIsRunning(false);
    soundFx.stopNoise();
    setSecondsLeft(customMinutes * 60);
  };

  const handleSoundscapeChange = (val: 'none' | 'brown' | 'pink' | 'white' | 'binaural') => {
    setSoundscape(val);
    if (val === 'none' || !isRunning) {
      soundFx.stopNoise();
    } else {
      soundFx.startNoise(val, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (soundscape !== 'none' && isRunning) {
      soundFx.startNoise(soundscape, newVol);
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    soundFx.stopNoise();
    soundFx.playTimerEnd();

    const logged = workOs.logFocusSession({
      userId: currentUser.id,
      mode,
      durationMinutes: customMinutes,
      taskTitle: selectedTask,
      notes: sessionNotes || 'Focused sprint completed successfully.',
    });
    setSessions([logged, ...sessions]);
    setSecondsLeft(customMinutes * 60);
  };

  // Total minutes today
  const todayStr = new Date().toISOString().split('T')[0];
  const minutesToday = sessions
    .filter((s) => s.completedAt.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const totalSeconds = customMinutes * 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const minutesDisplay = Math.floor(secondsLeft / 60);
  const secondsDisplay = secondsLeft % 60;

  return (
    <div className={`space-y-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-canvas p-10 overflow-y-auto flex flex-col justify-center items-center' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6 w-full max-w-5xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display tracking-tight text-content-primary">
              Focus & Deep Work Engine
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft uppercase">
              Monk Mode Ready
            </span>
          </div>
          <p className="text-xs text-content-secondary mt-1">
            Zero-distraction intervals, procedural Web Audio soundscapes, and session accountability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-elevated text-xs font-mono text-content-secondary hover:text-content-primary transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Monk Mode' : 'Monk Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Timer & Soundscape */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            {/* Ambient Background Glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
                isRunning ? 'opacity-20 bg-gradient-radial from-burgundy/40 to-transparent' : 'opacity-0'
              }`}
            />

            {/* Presets */}
            <div className="flex items-center gap-2 mb-8 z-10">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    customMinutes === p.minutes
                      ? 'bg-burgundy text-white shadow-sm'
                      : 'bg-surface-elevated border border-border-subtle text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-72 h-72 flex items-center justify-center z-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="stroke-border-subtle"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  className="stroke-burgundy transition-all duration-500 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-display font-extrabold text-5xl tracking-tight text-content-primary">
                  {String(minutesDisplay).padStart(2, '0')}:{String(secondsDisplay).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-content-muted mt-1 uppercase tracking-wider">
                  {isRunning ? 'Flow State Active' : 'Ready to Focus'}
                </span>
                <span className="text-xs font-medium text-burgundy-soft mt-1 max-w-[180px] truncate">
                  {selectedTask}
                </span>
              </div>
            </div>

            {/* Timer Action Buttons */}
            <div className="flex items-center gap-4 mt-8 z-10">
              <button
                onClick={resetTimer}
                className="p-3 rounded-full border border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleRunning}
                className="px-8 py-3 rounded-full bg-burgundy hover:bg-burgundy-soft text-white font-medium text-sm flex items-center gap-2 shadow-lg hover:shadow-burgundy/20 transition-all transform active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Flow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Enter Flow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Procedural Soundscape Generator */}
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-burgundy-soft" />
                <h2 className="text-sm font-semibold text-content-primary">
                  Procedural Soundscape Generator
                </h2>
              </div>
              <span className="text-[10px] font-mono text-content-muted">
                Zero audio files • Synthesized live
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none' as const, label: 'Silence' },
                { id: 'brown' as const, label: 'Brown Noise' },
                { id: 'pink' as const, label: 'Pink Noise' },
                { id: 'white' as const, label: 'White Noise' },
                { id: 'binaural' as const, label: 'Binaural Drone' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSoundscapeChange(s.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    soundscape === s.id
                      ? 'border-burgundy bg-burgundy/10 text-burgundy-soft'
                      : 'border-border-subtle bg-surface-elevated text-content-secondary hover:text-content-primary'
                  }`}
                >
                  <div className="text-xs font-semibold">{s.label}</div>
                </button>
              ))}
            </div>

            {soundscape !== 'none' && (
              <div className="flex items-center gap-3 pt-2">
                <VolumeX className="w-3.5 h-3.5 text-content-muted" />
                <input
                  type="range"
                  min="0.01"
                  max="0.15"
                  step="0.005"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-burgundy"
                />
                <Volume2 className="w-3.5 h-3.5 text-content-muted" />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Session Context & Log */}
        <div className="space-y-6">
          {/* Daily Tally */}
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-content-muted">
                Daily Discipline
              </span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
                <div className="text-[10px] font-mono text-content-muted uppercase">Today's Focus</div>
                <div className="text-xl font-bold font-display text-content-primary mt-1">
                  {minutesToday} <span className="text-xs font-normal text-content-muted">mins</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle">
                <div className="text-[10px] font-mono text-content-muted uppercase">Completed</div>
                <div className="text-xl font-bold font-display text-content-primary mt-1">
                  {sessions.filter((s) => s.completedAt.startsWith(todayStr)).length}{' '}
                  <span className="text-xs font-normal text-content-muted">sessions</span>
                </div>
              </div>
            </div>

            {/* Task Tagging */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <label className="text-xs font-medium text-content-secondary">Active Sprint Goal</label>
              <input
                type="text"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-content-secondary">Session Notes / Insights</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={2}
                placeholder="Key takeaways or output delivered..."
                className="w-full text-xs p-2.5 rounded-xl border border-border-subtle bg-surface-elevated text-content-primary focus:outline-none focus:border-burgundy resize-none"
              />
            </div>
          </div>

          {/* Recent Completed Sessions */}
          <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Recent Deep Work Sessions</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-border-subtle bg-surface-elevated space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-content-primary truncate max-w-[150px]">
                      {s.taskTitle || 'Deep Work Session'}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-burgundy/15 text-burgundy-soft">
                      {s.durationMinutes}m
                    </span>
                  </div>
                  {s.notes && <p className="text-[11px] text-content-muted italic line-clamp-1">{s.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
