import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import MatchDashboard from './components/MatchDashboard.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import CandidatesView from './components/CandidatesView.jsx';
import StudentFormModal from './components/StudentFormModal.jsx';
import ProjectFormModal from './components/ProjectFormModal.jsx';
import { fetchProjects, fetchStudents, createStudent, createProject, resetDatabase } from './services/api.js';
import { Sparkles, Users, FolderKanban, CheckCircle2, AlertCircle } from 'lucide-react';

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
    showToast(`Candidate "${res.data.name}" added successfully!`);
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
              <strong>Backend Connection Issue:</strong> {error}
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Ensure the backend is running at <code>http://localhost:5000</code>.
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner */}
        {activeTab === 'matches' && (
          <div className="hero-banner">
            <div>
              <h1 className="hero-title">Intelligent Hackathon Team Formation</h1>
              <p className="hero-subtitle">
                Discover complementary teammates with transparent deterministic compatibility scoring
                (Skills, Availability, Interests, Experience) paired with AI-driven synergy rationales.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setIsStudentModalOpen(true)}
              >
                <Users size={16} /> + Candidate
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsProjectModalOpen(true)}
              >
                <FolderKanban size={16} /> + Post Project
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
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Connecting to ProjectMatch Core...
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Loading hackathon rosters and projects.
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
