import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import MatchDashboard from './components/MatchDashboard.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import CandidatesView from './components/CandidatesView.jsx';
import StudentFormModal from './components/StudentFormModal.jsx';
import ProjectFormModal from './components/ProjectFormModal.jsx';
import { fetchProjects, fetchStudents, createStudent, createProject, resetDatabase } from './services/api.js';
import { Sparkles, Users, FolderKanban, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('matches');
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load initial projects and students
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

  // Handlers
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

        {/* Hero SaaS Banner */}
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

      {/* Modals */}
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
