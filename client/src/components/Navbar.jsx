import React from 'react';
import { Layers, RotateCcw, Plus, Moon, Sun, Users, FolderKanban, Sparkles } from 'lucide-react';

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenCreateStudent,
  onOpenCreateProject,
  onResetSeed,
  theme,
  onToggleTheme
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); onSelectTab('matches'); }}>
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            ProjectMatch
            <span className="brand-badge">HACKATHON MVP</span>
          </a>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => onSelectTab('matches')}
            >
              <Layers size={15} /> Matches
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => onSelectTab('projects')}
            >
              <FolderKanban size={15} /> Projects
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
              onClick={() => onSelectTab('candidates')}
            >
              <Users size={15} /> Candidates
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="nav-controls">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onResetSeed}
            title="Reset database to default hackathon demo profiles"
          >
            <RotateCcw size={13} /> Reseed Data
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button className="btn btn-primary btn-sm" onClick={onOpenCreateProject}>
            <Plus size={14} /> Post Project
          </button>
        </div>
      </div>
    </header>
  );
}
