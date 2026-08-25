import React from 'react';
import { Sparkles, Clock, Globe2, Award, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import ScoreMeter from './ScoreMeter.jsx';
import ScoreBreakdownCard from './ScoreBreakdownCard.jsx';

export default function CandidateCard({ match, rank = 1 }) {
  const {
    student,
    compatibilityScore,
    scoreBreakdown,
    matchedSkills = [],
    missingSkillsSupplied = [],
    roleCovered,
    aiExplanation,
    explanationSource
  } = match;

  const initials = student.avatar || (student.name || 'U').slice(0, 2).toUpperCase();

  return (
    <div className={`candidate-card ${rank === 1 ? 'rank-1' : ''}`}>
      {/* Top Header Row */}
      <div className="candidate-card-header">
        <div className="candidate-profile">
          <div className="avatar-circle">{initials}</div>
          <div>
            <div className="candidate-name">
              {student.name}
              {rank === 1 ? (
                <span className="pill" style={{ background: 'var(--score-emerald-bg)', color: 'var(--score-emerald)', border: '1px solid var(--score-emerald-border)', fontSize: '0.7rem' }}>
                  <Award size={13} /> #1 Top Match
                </span>
              ) : (
                <span className="pill pill-exp" style={{ fontSize: '0.7rem' }}>
                  #{rank} Match
                </span>
              )}
            </div>

            <div className="candidate-meta">
              <span className="pill pill-role matched">
                <UserCheck size={12} /> {roleCovered || student.primaryRole}
              </span>
              <span className="pill pill-exp">{student.experienceLevel}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <Clock size={13} /> {student.availabilityHours}h/wk
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <Globe2 size={13} /> UTC {student.timezoneOffset >= 0 ? `+${student.timezoneOffset}` : student.timezoneOffset}
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility Score Ring Gauge */}
        <ScoreMeter score={compatibilityScore} />
      </div>

      {/* Candidate Bio */}
      {student.shortBio && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontStyle: 'italic', lineHeight: 1.5 }}>
          "{student.shortBio}"
        </p>
      )}

      {/* Matched Skills & Open Gaps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.75rem 0' }}>
        {matchedSkills.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Matched Skills:
            </span>
            {matchedSkills.map((skill, i) => (
              <span key={i} className="pill pill-skill matched">
                <CheckCircle2 size={12} /> {skill}
              </span>
            ))}
          </div>
        )}

        {missingSkillsSupplied.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fills Project Gaps:
            </span>
            {missingSkillsSupplied.map((gap, i) => (
              <span key={i} className="pill pill-gap">
                <ShieldCheck size={12} /> {gap}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Match Rationale Highlight Box */}
      {aiExplanation && (
        <div className="ai-box">
          <div className="ai-box-header">
            <Sparkles size={14} style={{ color: 'var(--brand-500)' }} />
            <span>Why this candidate matches</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', opacity: 0.8, textTransform: 'none', fontWeight: 500 }}>
              {explanationSource === 'ai' ? '🤖 Gemini AI Matchmaker' : '⚡ Deterministic Explainer'}
            </span>
          </div>
          <p className="ai-box-text">{aiExplanation}</p>
        </div>
      )}

      {/* 4-Pillar Score Breakdown */}
      <ScoreBreakdownCard breakdown={scoreBreakdown} />
    </div>
  );
}
