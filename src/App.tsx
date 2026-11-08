import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

// Private Work OS Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { LiveStatusPage } from './pages/dashboard/LiveStatusPage';
import { DashboardTasks } from './pages/dashboard/DashboardTasks';
import { DashboardProjects } from './pages/dashboard/DashboardProjects';
import { InternshipsPage } from './pages/dashboard/InternshipsPage';
import { AcademicsPage } from './pages/dashboard/AcademicsPage';
import { LeavePage } from './pages/dashboard/LeavePage';
import { DocumentsPage } from './pages/dashboard/DocumentsPage';
import { DashboardNotes } from './pages/dashboard/DashboardNotes';
import { DashboardCalendar } from './pages/dashboard/DashboardCalendar';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { DashboardContent } from './pages/dashboard/DashboardContent';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { FocusModePage } from './pages/dashboard/FocusModePage';
import { HabitsPage } from './pages/dashboard/HabitsPage';
import { IdeasAndAdrsPage } from './pages/dashboard/IdeasAndAdrsPage';
import { FinancePage } from './pages/dashboard/FinancePage';
import { MessagesPage } from './pages/dashboard/MessagesPage';

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

  const isAppArea = location.pathname.startsWith('/app') || location.pathname.startsWith('/dashboard');

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
      {!isAppArea && <AmbientCanvas />}
      {!isAppArea && (
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
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/work" element={<ProjectsPage />} />
          <Route path="/work/:slug" element={<ProjectCaseStudyPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<JourneyPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Legacy /dashboard redirect */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/dashboard/*" element={<Navigate to="/app/dashboard" replace />} />

          {/* Private Work OS System */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="timesheets" element={<AttendancePage />} />
            <Route path="status" element={<LiveStatusPage />} />
            <Route path="tasks" element={<DashboardTasks />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="internships" element={<InternshipsPage />} />
            <Route path="academics" element={<AcademicsPage />} />
            <Route path="leave" element={<LeavePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="notes" element={<DashboardNotes />} />
            <Route path="calendar" element={<DashboardCalendar />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="analytics" element={<ReportsPage />} />
            <Route path="content" element={<DashboardContent />} />
            <Route path="focus" element={<FocusModePage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="ideas" element={<IdeasAndAdrsPage />} />
            <Route path="decisions" element={<IdeasAndAdrsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<SettingsPage />} />
          </Route>
        </Routes>
      </main>

      {!isAppArea && <Footer />}

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
