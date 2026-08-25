import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingView from './components/LandingView.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import SignInModal from './components/SignInModal.jsx';
import MatchDashboard from './components/MatchDashboard.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import CandidatesView from './components/CandidatesView.jsx';
import StudentFormModal from './components/StudentFormModal.jsx';
import ProjectFormModal from './components/ProjectFormModal.jsx';
import { fetchProjects, fetchStudents, createStudent, createProject, resetDatabase } from './services/api.js';
import { Sparkles, Users, FolderKanban, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'projects' | 'candidates'
  const [currentUser, setCurrentUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load initial projects and students from backend API
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projRes, studRes] = await Promise.all([fetchProjects(), fetchStudents()]);
      setProjects(projRes.data || []);
      setStudents(studRes.data || []);

      if (projRes.data && projRes.data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projRes.data[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Onboarding Profile Creation (Get Started flow)
  const handleOnboardingComplete = async (studentData) => {
    const res = await createStudent(studentData);
    setCurrentUser(res.data);
    showToast(`Welcome aboard, ${res.data.name}! Your profile is ready.`);
    await loadData();
    setCurrentView('dashboard');
    setActiveTab('matches');
  };

  // Sign In Persona Selection
  const handleSelectPersona = (student) => {
    setCurrentUser(student);
    showToast(`Exploring dashboard as ${student.name} (${student.primaryRole})`);
    setCurrentView('dashboard');
    setActiveTab('matches');
  };

  const handleContinueAsGuest = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
    setActiveTab('matches');
  };

  // Quick Modal Handlers inside Dashboard
  const handleCreateStudent = async (studentData) => {
    const res = await createStudent(studentData);
    showToast(`Candidate "${res.data.name}" registered successfully!`);
    await loadData();
  };

  const handleCreateProject = async (projectData) => {
    const res = await createProject(projectData);
    showToast(`Project "${res.data.title}" posted successfully!`);
    await loadData();
    setSelectedProjectId(res.data.id);
    setActiveTab('matches');
  };

  const handleResetSeed = async () => {
    try {
      await resetDatabase();
      showToast('Database reset to 15 default students & 5 projects!');
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to reset database', 'error');
    }
  };

  // 1. Render Landing View
  if (currentView === 'landing') {
    return (
      <div className="landing-wrapper">
        <LandingView
          onGetStarted={() => setIsOnboardingOpen(true)}
          onSignIn={() => setIsSignInOpen(true)}
          onDirectExplore={handleContinueAsGuest}
        />

        {/* Onboarding Profile Setup Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onCompleteProfile={handleOnboardingComplete}
        />

        {/* Demo Sign In Persona Modal */}
        <SignInModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
          students={students}
          onSelectPersona={handleSelectPersona}
          onContinueAsGuest={handleContinueAsGuest}
        />
      </div>
    );
  }

  // 2. Render Main Application Dashboard
  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCreateStudent={() => setIsStudentModalOpen(true)}
        onOpenCreateProject={() => setIsProjectModalOpen(true)}
        onResetSeed={handleResetSeed}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onGoToLanding={() => setCurrentView('landing')}
      />

      <main className="main-content">
        {/* Toast Notification */}
        {notification && (
          <div className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Global Connection Error */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div>
              <strong>Backend Connection Notice:</strong> {error}
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Ensure the backend server is running at <code>http://localhost:5000</code>.
              </div>
            </div>
          </div>
        )}

        {/* Hero Dashboard Banner */}
        {activeTab === 'matches' && (
          <div className="hero-banner">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                <Zap size={14} /> AI-Powered Hackathon Matchmaker
              </div>
              <h1 className="hero-title">Assemble Your Dream Hackathon Team</h1>
              <p className="hero-subtitle">
                Discover complementary teammates using deterministic 4-pillar compatibility scoring
                (Skills, Availability, Domain Interests, Experience) paired with explainable AI synergy rationales.
              </p>

              {/* Quick Metrics Strip */}
              <div className="metrics-bar">
                <div className="metric-item">
                  <Users size={15} style={{ color: 'var(--brand-500)' }} />
                  <span>Pool: <strong className="metric-value">{students.length} Candidates</strong></span>
                </div>
                <div className="metric-item">
                  <FolderKanban size={15} style={{ color: '#a855f7' }} />
                  <span>Active: <strong className="metric-value">{projects.length} Projects</strong></span>
                </div>
                <div className="metric-item">
                  <ShieldCheck size={15} style={{ color: 'var(--score-emerald)' }} />
                  <span>Matching: <strong className="metric-value">Deterministic + AI</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setIsStudentModalOpen(true)}
              >
                <Users size={15} /> + Candidate
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsProjectModalOpen(true)}
              >
                <FolderKanban size={15} /> + Post Project
              </button>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {!loading && activeTab === 'matches' && (
          <MatchDashboard
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onOpenCreateProject={() => setIsProjectModalOpen(true)}
            onOpenCreateStudent={() => setIsStudentModalOpen(true)}
          />
        )}

        {!loading && activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveTab('matches');
            }}
            onOpenCreateProject={() => setIsProjectModalOpen(true)}
          />
        )}

        {!loading && activeTab === 'candidates' && (
          <CandidatesView
            students={students}
            onOpenCreateStudent={() => setIsStudentModalOpen(true)}
          />
        )}

        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-500)', marginBottom: '0.5rem' }}>
              Connecting to ProjectMatch Core Engine...
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Loading participants, teams, and active hackathon tracks.
            </p>
          </div>
        )}
      </main>

      {/* Quick Modals */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleCreateStudent}
      />

      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
