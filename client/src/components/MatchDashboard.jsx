import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Clock, AlertCircle, ChevronDown, ChevronUp, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';
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
      {/* Active Project Selector Bar */}
      <div className="project-selector-bar">
        <div className="project-dropdown-wrapper">
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            Target Project:
          </label>
          <select
            className="select-input"
            value={selectedProjectId || ''}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — [{p.track}]
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
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
        <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(180deg, var(--bg-card-subtle) 0%, var(--bg-card) 100%)', border: '1px solid var(--border-hover)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{activeProject.title}</h2>
                <span className="pill" style={{ background: 'var(--brand-gradient)', color: 'white', fontWeight: 700 }}>
                  {activeProject.track}
                </span>
                <span className="pill pill-exp">
                  Target Team: {activeProject.targetTeamSize || 4} Members
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.5rem', lineHeight: 1.5, maxWidth: '850px' }}>
                {activeProject.description}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span className="pill pill-exp" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> Min {activeProject.minAvailabilityHours}h/wk Commitment
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.04em', display: 'block', marginBottom: '0.35rem' }}>
                Required Roles:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(activeProject.requiredRoles || []).map((r, i) => (
                  <span key={i} className="pill pill-role matched">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.04em', display: 'block', marginBottom: '0.35rem' }}>
                Required / Desired Skills:
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(activeProject.requiredSkills || []).map((s, i) => (
                  <span key={i} className="pill pill-skill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matches Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--brand-500)' }} />
            Ranked Candidate Recommendations
            <span className="pill pill-exp" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              {filteredMatches.length} Eligible
            </span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Multi-stage pipeline: Hard gating $\rightarrow$ Deterministic 4-pillar scoring $\rightarrow$ AI synergy explanation
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

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-500)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Sparkles size={22} className="spin-icon" /> Calculating Compatibility Scores & AI Rationales...
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Evaluating skill complementarity, commitment hours parity, and timezone synergy.
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>Error loading recommendations: {error}</span>
        </div>
      )}

      {/* Candidate Matches Feed */}
      {!loading && !error && filteredMatches.length > 0 && (
        <div>
          {filteredMatches.map((match, idx) => (
            <CandidateCard key={match.student.id} match={match} rank={idx + 1} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMatches.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Layers size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>No Eligible Candidates in this Category</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
            All candidates in this cohort either belong to different tracks or have availability below the project minimum.
          </p>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreateStudent}>
            + Register New Matching Candidate
          </button>
        </div>
      )}

      {/* Ineligible Candidates (Explainable Filter Audit) */}
      {!loading && ineligible.length > 0 && (
        <div className="card" style={{ marginTop: '2rem', border: '1px dashed var(--border-strong)', backgroundColor: 'var(--bg-app)' }}>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} style={{ color: '#fca5a5' }} />
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
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem'
                  }}
                >
                  <div>
                    <strong>{item.name}</strong> <span style={{ opacity: 0.7 }}>({item.primaryRole})</span>
                  </div>
                  <div style={{ color: '#fca5a5', fontSize: '0.8rem' }}>
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
