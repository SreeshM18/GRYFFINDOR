import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Sun, Moon, Command, Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { soundFx } from '../ui/AudioSynthesizer';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  currentTheme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/sreesh', label: 'Sreesh' },
    { path: '/mrithula', label: 'Mrithula' },
    { path: '/work', label: 'Work' },
    { path: '/collaborations', label: 'Collabs' },
    { path: '/skills', label: 'Skills' },
    { path: '/journey', label: 'Timeline' },
    { path: '/resumes', label: 'Resumes' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-canvas/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link
          to="/"
          onClick={() => soundFx.playClick()}
          className="flex items-center gap-2.5 group"
          aria-label="Sreesh and Mrithula Studio Home"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-card border border-border-strong flex items-center justify-center font-display font-bold text-xs tracking-wider text-content-primary group-hover:border-burgundy-soft transition-colors">
            S<span className="text-burgundy-soft">×</span>M
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-sm tracking-tight text-content-primary flex items-center gap-1.5">
              SREESH <span className="text-burgundy-soft font-normal">×</span> MRITHULA
            </span>
            <span className="text-[10px] text-content-muted font-mono tracking-widest uppercase hidden sm:block">
              Creative Studio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-surface-card/60 border border-border-subtle">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => soundFx.playClick()}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-surface-elevated text-content-primary shadow-sm'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Command Launcher (Ctrl+K) */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenCommandPalette();
            }}
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-content-muted hover:text-content-primary text-xs transition-colors"
            title="Open Command Launcher (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <kbd className="text-[10px] font-mono opacity-80">⌘K</kbd>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border border-border-subtle transition-colors ${
              soundEnabled
                ? 'bg-burgundy/20 border-burgundy-soft text-burgundy-soft'
                : 'bg-surface-card text-content-muted hover:text-content-primary'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable synthesized sound effects'}
            aria-label="Toggle UI Audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-border-subtle bg-surface-card hover:bg-surface-elevated text-content-secondary hover:text-content-primary transition-colors"
            title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {currentTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Private Studio Workspace Gate */}
          <Link
            to="/login"
            onClick={() => soundFx.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface-elevated hover:bg-burgundy-soft/20 text-xs font-medium text-content-primary transition-all group"
            title="Private Collaborative Cockpit"
          >
            <Lock className="w-3.5 h-3.5 text-content-muted group-hover:text-burgundy-soft transition-colors" />
            <span>Workspace</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-border-subtle bg-surface-card text-content-primary"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-subtle bg-surface-card px-4 py-4 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  soundFx.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-surface-elevated text-content-primary font-semibold'
                    : 'text-content-secondary hover:bg-surface-elevated/50'
                }`}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-elevated text-xs font-medium text-content-primary"
            >
              <Lock className="w-3.5 h-3.5 text-burgundy-soft" />
              <span>Access Private Workspace</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
