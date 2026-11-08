import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AmbientCanvas } from './components/ui/AmbientCanvas';
import { CommandPalette } from './components/ui/CommandPalette';
import { soundFx } from './components/ui/AudioSynthesizer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectCaseStudyPage } from './pages/ProjectCaseStudyPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { SkillsPage } from './pages/SkillsPage';
import { JourneyPage } from './pages/JourneyPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ResumesPage } from './pages/ResumesPage';
import { ContactPage } from './pages/ContactPage';

// Private Workspace Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { DashboardTasks } from './pages/dashboard/DashboardTasks';
import { DashboardProjects } from './pages/dashboard/DashboardProjects';
import { DashboardNotes } from './pages/dashboard/DashboardNotes';
import { DashboardCalendar } from './pages/dashboard/DashboardCalendar';
import { DashboardContent } from './pages/dashboard/DashboardContent';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    soundFx.playClick();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSound = () => {
    const next = soundFx.toggle();
    setSoundEnabled(next);
  };

  return (
    <div className="min-h-screen bg-canvas text-content-primary flex flex-col font-sans transition-colors selection:bg-burgundy selection:text-white">
      <ScrollToTop />
      {!isDashboard && <AmbientCanvas />}
      {!isDashboard && (
        <Navbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sreesh" element={<ProfilePage forcedId="sreesh" />} />
          <Route path="/mrithula" element={<ProfilePage forcedId="mrithula" />} />
          <Route path="/work" element={<ProjectsPage />} />
          <Route path="/work/:slug" element={<ProjectCaseStudyPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authentication & Private Workspace */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="tasks" element={<DashboardTasks />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="notes" element={<DashboardNotes />} />
            <Route path="calendar" element={<DashboardCalendar />} />
            <Route path="content" element={<DashboardContent />} />
          </Route>
        </Routes>
      </main>

      {!isDashboard && <Footer />}

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
