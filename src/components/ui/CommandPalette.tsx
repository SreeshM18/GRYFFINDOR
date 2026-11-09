import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  ArrowRight,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  FileText,
  User,
  Sparkles,
  Play,
  Square,
  Clock,
  CheckSquare,
  Calendar,
  BookOpen,
  MessageSquare,
  Timer,
  CreditCard,
  GraduationCap,
  Laptop,
  Palette,
  Compass,
  TrendingUp,
  ShieldCheck,
  Flame,
  Lightbulb,
  Lock,
} from 'lucide-react';
import { soundFx } from './AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  currentTheme: 'dark' | 'light';
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface CommandItem {
  id: string;
  category: 'ACTIONS' | 'COLLABORATION' | 'ACADEMICS & LIFE' | 'STUDIO & INTELLIGENCE' | 'NAVIGATION';
  label: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleTheme,
  currentTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [query, setQuery] = useState('');
  const [activeUser, setActiveUser] = useState(() => workOs.getCurrentUser());
  const [activeClockIn, setActiveClockIn] = useState(() => workOs.getActiveClockIn(workOs.getCurrentUser().id));
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const user = workOs.getCurrentUser();
      setActiveUser(user);
      setActiveClockIn(workOs.getActiveClockIn(user.id));
      setQuery('');
      setActionFeedback(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute instantaneous Clock In
  const executeClockIn = () => {
    soundFx.playChime();
    workOs.clockIn(activeUser.id);
    setActiveClockIn(workOs.getActiveClockIn(activeUser.id));
    setActionFeedback(`Clocked in successfully as ${activeUser.name.split(' ')[0]}`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Execute instantaneous Clock Out
  const executeClockOut = () => {
    soundFx.playChime();
    workOs.clockOut(activeUser.id);
    setActiveClockIn(null);
    setActionFeedback(`Clocked out successfully. Work shift logged.`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Switch between Sreesh and Mrithula session
  const switchSession = (targetId: 'sreesh' | 'mrithula') => {
    soundFx.playChime();
    const targetUser =
      targetId === 'sreesh'
        ? {
            id: 'sreesh' as const,
            name: 'Sreesh M',
            role: 'Founder & Systems Architect',
            email: 'sreesh@gryffindor.internal',
          }
        : {
            id: 'mrithula' as const,
            name: 'Mrithula M',
            role: 'Co-Founder & Product Lead',
            email: 'mrithula@gryffindor.internal',
          };
    localStorage.setItem('sm_auth_user', JSON.stringify(targetUser));
    setActiveUser(targetUser);
    setActiveClockIn(workOs.getActiveClockIn(targetId));
    setActionFeedback(`Switched active session to ${targetUser.name}`);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const commandCatalog: CommandItem[] = useMemo(() => [
    // 1. INSTANT ACTIONS (Deterministic JARVIS controls)
    {
      id: 'clock-in',
      category: 'ACTIONS',
      label: activeClockIn ? 'Already Clocked In (Shift Active)' : 'Clock In (Start Official Workday)',
      keywords: 'clock in start work shift attendance punch in ledger check in',
      icon: Play,
      badge: activeClockIn ? 'Active' : 'Instant',
      action: () => {
        if (!activeClockIn) executeClockIn();
      },
    },
    {
      id: 'clock-out',
      category: 'ACTIONS',
      label: 'Clock Out (End Workday & Log Hours)',
      keywords: 'clock out end work shift attendance punch out break stop',
      icon: Square,
      badge: activeClockIn ? 'Required' : 'Idle',
      action: () => {
        if (activeClockIn) executeClockOut();
        else navigate('/app/attendance');
      },
    },
    {
      id: 'switch-to-mrithula',
      category: 'ACTIONS',
      label: 'Switch Active Session to Mrithula M (Product Lead)',
      keywords: 'switch user mrithula change account identity profile cofounder',
      icon: User,
      badge: activeUser.id === 'mrithula' ? 'Current' : 'Switch',
      action: () => switchSession('mrithula'),
    },
    {
      id: 'switch-to-sreesh',
      category: 'ACTIONS',
      label: 'Switch Active Session to Sreesh M (Systems Architect)',
      keywords: 'switch user sreesh change account identity profile founder',
      icon: User,
      badge: activeUser.id === 'sreesh' ? 'Current' : 'Switch',
      action: () => switchSession('sreesh'),
    },
    {
      id: 'toggle-focus',
      category: 'ACTIONS',
      label: 'Enter Chamber of Focus (Pomodoro Timer & Ambient Audio)',
      keywords: 'focus timer pomodoro study deep work ambient sound binaural',
      icon: Timer,
      action: () => navigate('/app/focus'),
    },
    {
      id: 'toggle-color-lab',
      category: 'ACTIONS',
      label: 'Open Universal Color & Shade Laboratory (Live Customizer)',
      keywords: 'color shade hex wheel palette customize website theme background accent',
      icon: Palette,
      badge: 'Live',
      action: () => navigate('/designs'),
    },

    // 2. COLLABORATION & QUESTS
    {
      id: 'quest-board',
      category: 'COLLABORATION',
      label: 'The Quest Board (Consent-Based Task Assignments)',
      keywords: 'quests tasks assign mrithula sreesh todo delegation consent acceptance',
      icon: Sparkles,
      badge: 'Equal Control',
      action: () => navigate('/app/quests'),
    },
    {
      id: 'projects',
      category: 'COLLABORATION',
      label: 'Projects & GitHub Repositories (Architecture & Milestones)',
      keywords: 'projects repos milestones sprints kanban github codebase',
      icon: Compass,
      action: () => navigate('/app/projects'),
    },
    {
      id: 'calendar',
      category: 'COLLABORATION',
      label: 'The Timekeeper (Unified Calendar, Deadlines & Events)',
      keywords: 'calendar schedule events deadlines exams meetings timing',
      icon: Calendar,
      action: () => navigate('/app/calendar'),
    },
    {
      id: 'owl-post',
      category: 'COLLABORATION',
      label: 'Owl Post (Direct Channel & Encrypted Messages)',
      keywords: 'messages chat owl post comments communication talk notify',
      icon: MessageSquare,
      action: () => navigate('/app/messages'),
    },
    {
      id: 'ideas-adrs',
      category: 'COLLABORATION',
      label: 'Ideas & ADR Decisions (Architecture Decision Records)',
      keywords: 'ideas architecture decisions adr records rfc proposals',
      icon: Lightbulb,
      action: () => navigate('/app/ideas'),
    },

    // 3. ACADEMICS & LIFE
    {
      id: 'academics',
      category: 'ACADEMICS & LIFE',
      label: 'College Academics (Semester 7/8 Courses, Attendance & Exams)',
      keywords: 'academics college university studies syllabus marks exams attendance',
      icon: GraduationCap,
      badge: 'S7 Active',
      action: () => navigate('/app/academics'),
    },
    {
      id: 'my-chamber',
      category: 'ACADEMICS & LIFE',
      label: 'My Chamber & Private Life Journal (Personal Life OS)',
      keywords: 'my space chamber private personal journal life goals habits thoughts',
      icon: Lock,
      action: () => navigate('/app/my-space'),
    },
    {
      id: 'habits',
      category: 'ACADEMICS & LIFE',
      label: 'Discipline & Daily Habits Tracker (Streaks & Wellness)',
      keywords: 'habits discipline routines streaks workout water sleep wellness',
      icon: Flame,
      action: () => navigate('/app/habits'),
    },
    {
      id: 'the-vault',
      category: 'ACADEMICS & LIFE',
      label: 'The Vault (Studio Finance, Invoices & Subscriptions)',
      keywords: 'finance money vault invoices revenue subscriptions expenses budget',
      icon: CreditCard,
      action: () => navigate('/app/finance'),
    },
    {
      id: 'the-library',
      category: 'ACADEMICS & LIFE',
      label: 'The Library (Markdown Knowledge Base & Wiki)',
      keywords: 'notes library docs knowledge wiki markdown search files',
      icon: BookOpen,
      action: () => navigate('/app/notes'),
    },
    {
      id: 'the-archives',
      category: 'ACADEMICS & LIFE',
      label: 'The Archives (Verified Resumes, PDFs & Cloud Files)',
      keywords: 'resumes pdf documents files certificates uploads drive storage',
      icon: FileText,
      action: () => navigate('/app/documents'),
    },

    // 4. STUDIO & INTELLIGENCE
    {
      id: 'observatory',
      category: 'STUDIO & INTELLIGENCE',
      label: 'The Observatory (Analytics, Candlesticks & Telemetry)',
      keywords: 'analytics charts trends candlesticks heatmaps statistics telemetry',
      icon: TrendingUp,
      action: () => navigate('/app/analytics'),
    },
    {
      id: 'devices',
      category: 'STUDIO & INTELLIGENCE',
      label: 'Device Manager (HP OMEN, MacBook Air, iPhone Sync)',
      keywords: 'devices hardware hp omen macbook iphone cross-platform sync cloud',
      icon: Laptop,
      action: () => navigate('/app/devices'),
    },
    {
      id: 'design-studio',
      category: 'STUDIO & INTELLIGENCE',
      label: 'Universal Website Design Engine (19 Mirrored Styles)',
      keywords: 'design studio presets marijana aritro eyeballs fudali styles',
      icon: Palette,
      action: () => navigate('/designs'),
    },
    {
      id: 'atrium',
      category: 'STUDIO & INTELLIGENCE',
      label: 'Celestial Atrium (17 Dimensional Worlds Exploration)',
      keywords: 'atrium 17 worlds dimensions celestial 3d spatial exploration',
      icon: Compass,
      action: () => navigate('/atrium'),
    },

    // 5. PUBLIC FOLIO NAVIGATION
    {
      id: 'public-home',
      category: 'NAVIGATION',
      label: 'Public Portfolio (SREESH × MRITHULA Opening)',
      keywords: 'home public portfolio frontpage overview editorial hero',
      icon: Sparkles,
      action: () => navigate('/'),
    },
    {
      id: 'public-sreesh',
      category: 'NAVIGATION',
      label: 'Sreesh M — Systems Architect Public Dossier',
      keywords: 'sreesh portfolio biography architecture systems engineer',
      icon: User,
      action: () => navigate('/sreesh'),
    },
    {
      id: 'public-mrithula',
      category: 'NAVIGATION',
      label: 'Mrithula M — Product & Design Lead Public Dossier',
      keywords: 'mrithula portfolio biography ui ux design tokens product',
      icon: User,
      action: () => navigate('/mrithula'),
    },
    {
      id: 'public-work',
      category: 'NAVIGATION',
      label: 'Public Projects & Case Studies (Production Builds)',
      keywords: 'work projects case studies engineering portfolio',
      icon: ArrowRight,
      action: () => navigate('/work'),
    },
    {
      id: 'public-resumes',
      category: 'NAVIGATION',
      label: 'Curriculum Vitae & ATS Resume Exporter',
      keywords: 'resumes cv download export print ats pdf',
      icon: FileText,
      action: () => navigate('/resumes'),
    },
    {
      id: 'toggle-theme',
      category: 'ACTIONS',
      label: `Switch Theme (Currently ${currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'})`,
      keywords: 'theme dark light appearance toggle color mode',
      icon: currentTheme === 'dark' ? Sun : Moon,
      action: onToggleTheme,
    },
    {
      id: 'toggle-sound',
      category: 'ACTIONS',
      label: `UI Audio Synthesizer (${soundEnabled ? 'Enabled' : 'Muted'})`,
      keywords: 'sound audio sfx chime synthesizer mute volume',
      icon: soundEnabled ? Volume2 : VolumeX,
      action: onToggleSound,
    },
  ], [activeUser, activeClockIn, currentTheme, soundEnabled, onToggleTheme, onToggleSound, navigate]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandCatalog;
    const lower = query.toLowerCase();
    return commandCatalog.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.keywords.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [query, commandCatalog]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-border-strong bg-surface-card/95 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top JARVIS Deterministic Telemetry HUD */}
        <div className="p-4 border-b border-border-subtle bg-surface-elevated/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <div>
              <span className="text-content-muted">JARVIS COMMAND CENTER • </span>
              <strong className="text-content-primary">{activeUser.name}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                activeClockIn
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {activeClockIn ? '● Shift Active' : '○ Clocked Out'}
            </span>

            <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-card text-content-secondary border border-border-subtle">
              Bengaluru IST
            </span>
          </div>
        </div>

        {/* Dynamic Action Feedback Pill */}
        {actionFeedback && (
          <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 text-xs font-mono border-b border-emerald-500/30 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-surface-card">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command (e.g. 'clock in', 'assign quest', 'academics', 'switch to mrithula', 'color lab')..."
            className="w-full bg-transparent text-sm text-content-primary outline-none placeholder:text-content-muted font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[10px] font-mono text-content-muted hover:text-content-primary px-1.5 py-0.5 rounded bg-surface-elevated"
            >
              Clear
            </button>
          )}
          <kbd className="text-[10px] font-mono text-content-muted border border-border-subtle px-1.5 py-0.5 rounded shrink-0">
            ESC
          </kbd>
        </div>

        {/* Filtered Command List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Command className="w-8 h-8 text-content-muted mx-auto opacity-50" />
              <p className="text-xs font-mono text-content-muted">
                No deterministic command found matching "{query}".
              </p>
              <p className="text-[11px] text-content-muted">
                Try: <code className="text-gold">clock in</code>, <code className="text-gold">quests</code>, <code className="text-gold">academics</code>, <code className="text-gold">vault</code>, <code className="text-gold">switch user</code>
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    item.action();
                    if (!item.id.startsWith('clock-') && !item.id.startsWith('switch-')) {
                      onClose();
                    }
                  }}
                  className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl hover:bg-surface-elevated text-xs transition-all group border border-transparent hover:border-border-subtle"
                >
                  <div className="flex items-center gap-3 text-content-secondary group-hover:text-content-primary min-w-0">
                    <span className="p-2 rounded-xl bg-surface-elevated text-gold group-hover:bg-gold/10 group-hover:text-gold transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-content-primary truncate">{item.label}</div>
                      <div className="text-[10px] font-mono text-content-muted truncate uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-card border border-border-subtle text-gold font-bold">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-content-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 border-t border-border-subtle bg-surface-elevated/40 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-content-muted">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Shortcut:</span>
            <kbd className="font-mono bg-surface-elevated border border-border-subtle px-1.5 py-0.5 rounded text-[10px] text-content-primary">
              ⌘ K / Ctrl+K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
