import React from 'react';
import { Layers, RotateCcw, Plus, Moon, Sun, Users, FolderKanban } from 'lucide-react';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="#" className="brand-logo" onClick={() => onSelectTab('matches')}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Layers size={18} />
            </div>
            ProjectMatch
            <span className="brand-badge">MVP</span>
          </a>

          {/* Nav Tabs */}
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
            title="Reset database with default demo profiles"
          >
            <RotateCcw size={14} /> Reseed Data
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="btn btn-primary btn-sm" onClick={onOpenCreateProject}>
            <Plus size={14} /> Project
          </button>
        </div>
      </div>
    </header>
  );
}
