import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Target, Clock, Filter, AlertCircle, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import CandidateCard from './CandidateCard.jsx';
import { fetchProjectMatches } from '../services/api.js';

export default function MatchDashboard({ projects = [], selectedProjectId, onSelectProject, onOpenCreateProject, onOpenCreateStudent }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showIneligible, setShowIneligible] = useState(false);

  useEffect(() => {
    if (!selectedProjectId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProjectMatches(selectedProjectId)
      .then((res) => {
        if (isMounted) {
          setMatchData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load matches');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || matchData?.project;

  const matches = matchData?.matches || [];
  const filteredMatches = roleFilter === 'ALL'
    ? matches
    : matches.filter((m) => (m.roleCovered || m.student.primaryRole || '').toLowerCase() === roleFilter.toLowerCase());

  const ineligible = matchData?.ineligibleCandidates || [];

  return (
    <div>
      {/* Project Selector Bar */}
      <div className="project-selector-bar">
        <div className="project-dropdown-wrapper">
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Active Project:
          </label>
          <select
            className="select-input"
            value={selectedProjectId || ''}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.track})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenCreateProject}>
            + Post Project
          </button>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreateStudent}>
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Active Project Details Card */}
      {activeProject && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem' }}>{activeProject.title}</h2>
                <span className="pill" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                  {activeProject.track}
                </span>
                <span className="pill pill-exp">
                  Target Size: {activeProject.targetTeamSize || 4}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                {activeProject.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> Min {activeProject.minAvailabilityHours}h/wk
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.825rem' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)', marginRight: '0.4rem' }}>Required Roles:</strong>
              {(activeProject.requiredRoles || []).map((r, i) => (
                <span key={i} className="pill pill-role" style={{ marginRight: '0.35rem' }}>
                  {r}
                </span>
              ))}
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', marginRight: '0.4rem' }}>Required Skills:</strong>
              {(activeProject.requiredSkills || []).map((s, i) => (
                <span key={i} className="pill pill-skill" style={{ marginRight: '0.35rem' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matches Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            Ranked Recommendations
            <span className="pill pill-exp" style={{ fontSize: '0.75rem' }}>
              {filteredMatches.length} candidates
            </span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.15rem' }}>
            Deterministic 4-pillar compatibility + AI-assisted match rationale
          </p>
        </div>

        {/* Role Filter Tabs */}
        {activeProject?.requiredRoles && activeProject.requiredRoles.length > 1 && (
          <div className="nav-tabs">
            <button
              className={`nav-tab-btn ${roleFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setRoleFilter('ALL')}
            >
              All Roles
            </button>
            {activeProject.requiredRoles.map((role) => (
              <button
                key={role}
                className={`nav-tab-btn ${roleFilter === role ? 'active' : ''}`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            Calculating Compatibility Scores & Generating AI Explanations...
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Applying hard filters, evaluating skill complementarity, and verifying schedule synergy.
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>Error loading recommendations: {error}</span>
        </div>
      )}

      {/* Candidate Matches List */}
      {!loading && !error && filteredMatches.length > 0 && (
        <div>
          {filteredMatches.map((match, idx) => (
            <CandidateCard key={match.student.id} match={match} rank={idx + 1} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMatches.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Layers size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>No Eligible Candidates Found</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '450px', margin: '0 auto 1rem' }}>
            No candidates currently match the required roles and minimum availability for this project.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreateStudent}>
            + Add Matching Candidate Profile
          </button>
        </div>
      )}

      {/* Ineligible Candidates (Explainable Transparency) */}
      {!loading && ineligible.length > 0 && (
        <div className="card" style={{ marginTop: '2rem', borderStyle: 'dashed' }}>
          <button
            onClick={() => setShowIneligible(!showIneligible)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            <span>
              Deterministic Filter Audit ({ineligible.length} candidates excluded by hard filters)
            </span>
            {showIneligible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showIneligible && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ineligible.map((item) => (
                <div
                  key={item.studentId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <strong>{item.name}</strong> <span style={{ opacity: 0.7 }}>({item.primaryRole})</span>
                  </div>
                  <div style={{ color: '#fca5a5' }}>
                    {item.reasons.join(' | ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
