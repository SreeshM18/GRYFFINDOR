import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  BookOpen,
  Calendar,
  FileEdit,
  LogOut,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const DashboardLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string; email: string } | null>(null);
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

  const navItems = [
    { path: '/dashboard', label: 'Overview Cockpit', icon: LayoutDashboard },
    { path: '/dashboard/tasks', label: 'Kanban Tasks', icon: CheckSquare },
    { path: '/dashboard/projects', label: 'Projects & Repo Links', icon: FolderGit2 },
    { path: '/dashboard/notes', label: 'Markdown Knowledge', icon: BookOpen },
    { path: '/dashboard/calendar', label: 'Deadlines & Calendar', icon: Calendar },
    { path: '/dashboard/content', label: 'Portfolio CMS', icon: FileEdit },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-subtle bg-surface-card/60 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Workspace Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-content-primary">
                STUDIO COCKPIT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-burgundy/20 text-burgundy-soft border border-burgundy/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-content-muted">
              Sreesh × Mrithula Workspace
            </p>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => soundFx.playClick()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-surface-elevated text-content-primary border border-border-strong shadow-sm'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-burgundy-soft' : 'text-content-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Session Controls */}
        <div className="pt-6 border-t border-border-subtle space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border-strong flex items-center justify-center font-display font-bold text-xs text-burgundy-soft">
              {currentUser.name[0]}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-xs text-content-primary truncate">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-content-muted truncate">{currentUser.role}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/"
              className="text-[11px] font-mono text-content-muted hover:text-content-primary flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Public Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
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

