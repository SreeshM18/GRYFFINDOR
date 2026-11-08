import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight, Volume2, VolumeX, Sun, Moon, FileText, User, Sparkles } from 'lucide-react';
import { soundFx } from './AudioSynthesizer';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  currentTheme: 'dark' | 'light';
  soundEnabled: boolean;
  onToggleSound: () => void;
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          soundFx.playClick();
          // Open handled by parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { id: 'home', label: 'Home — Studio Opening', icon: Sparkles, action: () => navigate('/') },
    { id: 'sreesh', label: "Sreesh's Personal Portfolio", icon: User, action: () => navigate('/sreesh') },
    { id: 'mrithula', label: "Mrithula's Personal Portfolio", icon: User, action: () => navigate('/mrithula') },
    { id: 'work', label: 'Explore All Projects & Work', icon: ArrowRight, action: () => navigate('/work') },
    { id: 'collabs', label: 'Collaborative Projects & Graph', icon: Sparkles, action: () => navigate('/collaborations') },
    { id: 'skills', label: 'Technical Capabilities Matrix', icon: ArrowRight, action: () => navigate('/skills') },
    { id: 'journey', label: 'Career & Collaborative Timeline', icon: ArrowRight, action: () => navigate('/journey') },
    { id: 'resumes', label: 'Professional Resumes & ATS Exporter', icon: FileText, action: () => navigate('/resumes') },
    { id: 'contact', label: 'Direct & Studio Contact', icon: ArrowRight, action: () => navigate('/contact') },
    { id: 'workspace', label: 'Private Studio Workspace (Login)', icon: Command, action: () => navigate('/login') },
    {
      id: 'theme',
      label: `Switch Theme (Currently ${currentTheme === 'dark' ? 'Dark' : 'Light'})`,
      icon: currentTheme === 'dark' ? Sun : Moon,
      action: onToggleTheme,
    },
    {
      id: 'sound',
      label: `Toggle UI Sound Synthesizer (${soundEnabled ? 'Enabled' : 'Muted'})`,
      icon: soundEnabled ? Volume2 : VolumeX,
      action: onToggleSound,
    },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-border-strong bg-surface-card shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border-subtle flex items-center gap-3">
          <Search className="w-5 h-5 text-content-muted" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, projects, resumes, or execute actions..."
            className="w-full bg-transparent text-sm text-content-primary outline-none placeholder:text-content-muted"
          />
          <kbd className="text-[10px] font-mono text-content-muted border border-border-subtle px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-content-muted">No commands or pages matching "{query}"</div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    item.action();
                    onClose();
                  }}
                  className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-surface-elevated text-xs transition-colors group"
                >
                  <div className="flex items-center gap-3 text-content-secondary group-hover:text-content-primary">
                    <Icon className="w-4 h-4 text-content-muted group-hover:text-burgundy-soft transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-content-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        <div className="p-2.5 border-t border-border-subtle bg-surface-elevated/40 flex items-center justify-between text-[11px] text-content-muted">
          <span>Navigate with mouse or keyboard</span>
          <div className="flex items-center gap-2">
            <span>Open:</span>
            <kbd className="font-mono bg-surface-elevated border border-border-subtle px-1.5 py-0.5 rounded text-[10px]">
              Ctrl+K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

