import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Activity,
  CheckSquare,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Calendar,
  BookOpen,
  FileText,
  Sun,
  BarChart3,
  FileEdit,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Timer,
  Flame,
  Lightbulb,
  CreditCard,
  MessageSquare,
  Lock,
  Globe,
  Compass,
  Laptop,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { workOs } from '../../services/workOsStorage';

export const DashboardLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem('sm_auth_user');
    if (!raw) {
      navigate('/login');
    } else {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    soundFx.playClick();
    localStorage.removeItem('sm_auth_user');
    navigate('/login');
  };

  const navSections = [
    {
      group: 'MY CHAMBER',
      items: [
        { path: '/app/dashboard', label: 'The Common Room', icon: LayoutDashboard },
        { path: '/app/my-space', label: 'My Chamber & Journal', icon: Lock },
        { path: '/app/focus', label: 'Chamber of Focus', icon: Timer },
        { path: '/app/analytics', label: 'The Observatory', icon: TrendingUp },
        { path: '/app/devices', label: 'Devices & Connected Apps', icon: Laptop },
      ],
    },
    {
      group: 'THE GREAT HALL (COLLABORATION)',
      items: [
        { path: '/app/tasks', label: 'My Quests (Tasks)', icon: CheckSquare },
        { path: '/app/projects', label: 'The Quest Board (Projects)', icon: FolderGit2 },
        { path: '/app/calendar', label: 'The Timekeeper (Calendar)', icon: Calendar },
        { path: '/app/notes', label: 'The Library (Knowledge)', icon: BookOpen },
        { path: '/app/messages', label: 'Owl Post (Direct Channel)', icon: MessageSquare },
        { path: '/app/habits', label: 'Discipline & Daily Habits', icon: Flame },
        { path: '/app/ideas', label: 'Ideas & ADR Decisions', icon: Lightbulb },
      ],
    },
    {
      group: 'CAREER & ACADEMICS',
      items: [
        { path: '/app/academics', label: 'College Academics (S7)', icon: GraduationCap },
        { path: '/app/internships', label: 'Internships & Guild Logs', icon: Briefcase },
        { path: '/app/career', label: 'Career & Placements', icon: Briefcase },
        { path: '/app/documents', label: 'The Archives (Resumes)', icon: FileText },
        { path: '/app/studio', label: 'Client & Freelance Hub', icon: Compass },
        { path: '/app/leave', label: 'Leave & Time-Off', icon: Sun },
      ],
    },
    {
      group: 'OPERATIONS & THE VAULT',
      items: [
        { path: '/app/attendance', label: 'The Ledger (Clock-In)', icon: Clock },
        { path: '/app/status', label: 'Live Presence Status', icon: Activity },
        { path: '/app/finance', label: 'The Vault (Studio Finance)', icon: CreditCard },
        { path: '/app/reports', label: 'Reports & Timesheets', icon: BarChart3 },
        { path: '/app/content', label: 'Portfolio CMS', icon: FileEdit },
        { path: '/app/settings', label: 'The Control Room', icon: Settings },
      ],
    },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden border-b border-border-subtle bg-surface-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-sm tracking-widest text-content-primary">GRYFFINDOR</span>
          <span className="text-[10px] font-serif italic text-gold">The Common Room</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg border border-border-subtle bg-surface-elevated text-content-primary"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-border-subtle bg-surface-card/95 backdrop-blur-md p-5 flex flex-col justify-between shrink-0 overflow-y-auto transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Elegant Gryffindor Typography Header (Zero Corporate Logo) */}
          <div className="space-y-0.5">
            <div className="font-display font-extrabold text-base tracking-[0.2em] text-content-primary">
              GRYFFINDOR
            </div>
            <p className="font-serif italic text-xs text-gold tracking-wide">
              The Common Room
            </p>
          </div>

          {/* 4 Environment Quick Switcher */}
          <div className="p-1 rounded-xl bg-surface-elevated/70 border border-border-subtle grid grid-cols-2 gap-1 text-[10px] font-mono">
            <Link
              to="/app/my-space"
              onClick={() => soundFx.playClick()}
              className={`p-1.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
                location.pathname === '/app/my-space' ? 'bg-burgundy text-white font-bold' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <Lock className="w-2.5 h-2.5" />
              <span>My Chamber</span>
            </Link>
            <Link
              to="/app/dashboard"
              onClick={() => soundFx.playClick()}
              className={`p-1.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
                location.pathname === '/app/dashboard' || location.pathname === '/app/tasks' ? 'bg-burgundy text-white font-bold' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <span>Common Room</span>
            </Link>
            <Link
              to="/app/attendance"
              onClick={() => soundFx.playClick()}
              className={`p-1.5 rounded-lg text-center transition-colors flex items-center justify-center gap-1 ${
                location.pathname === '/app/attendance' || location.pathname === '/app/reports' ? 'bg-burgundy text-white font-bold' : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              <span>The Ledger</span>
            </Link>
            <Link
              to="/"
              onClick={() => soundFx.playClick()}
              className="p-1.5 rounded-lg text-center transition-colors text-content-secondary hover:text-content-primary flex items-center justify-center gap-1"
            >
              <Globe className="w-2.5 h-2.5" />
              <span>Folio</span>
            </Link>
          </div>

          {/* Nav Sections */}
          <nav className="space-y-5">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-content-muted px-2.5">
                  {sec.group}
                </span>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          soundFx.playClick();
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          active
                            ? 'bg-surface-elevated text-content-primary border border-border-strong shadow-sm'
                            : 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated/40'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-burgundy-soft' : 'text-content-muted'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Card & Public Switcher */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border-strong flex items-center justify-center font-display font-bold text-xs text-burgundy-soft">
              {currentUser.name[0]}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-xs text-content-primary truncate">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-content-muted truncate">{currentUser.role}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <Link
              to="/"
              className="text-content-muted hover:text-content-primary flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
