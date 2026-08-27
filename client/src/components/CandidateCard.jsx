import React from 'react';
import { Sparkles, Clock, Globe2, Award, UserCheck } from 'lucide-react';
import ScoreMeter from './ScoreMeter.jsx';
import ScoreBreakdownCard from './ScoreBreakdownCard.jsx';
import SkillVerificationSection from './SkillVerificationSection.jsx';

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

      {/* WHY THIS MATCH? Section */}
      <div className="why-match-section">
        <div className="why-match-header">
          <Sparkles size={15} style={{ color: 'var(--brand-500)' }} />
          <span>WHY THIS MATCH?</span>
        </div>

        <div className="why-match-grid">
          {/* 1. Skills Matched */}
          <div className="why-match-item">
            <div className="why-match-title">Skills Matched:</div>
            <div className="why-match-content">
              {matchedSkills && matchedSkills.length > 0 ? (
                <div className="why-match-list">
                  {matchedSkills.map((skill, i) => (
                    <div key={i} className="why-match-entry">
                      <span className="why-match-check">✓</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="why-match-entry subtle">
                  <span>— Foundational match</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Missing Skill Filled */}
          <div className="why-match-item">
            <div className="why-match-title">Missing Skill Filled:</div>
            <div className="why-match-content">
              {missingSkillsSupplied && missingSkillsSupplied.length > 0 ? (
                <div className="why-match-list">
                  {missingSkillsSupplied.map((gap, i) => (
                    <div key={i} className="why-match-entry">
                      <span className="why-match-target">🎯</span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="why-match-entry">
                  <span className="why-match-target">🎯</span>
                  <span>{roleCovered || student.primaryRole}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Availability */}
          <div className="why-match-item">
            <div className="why-match-title">Availability:</div>
            <div className="why-match-content">
              <div className="why-match-entry">
                <span className="why-match-check">✓</span>
                <span>Available for the project timeline ({student.availabilityHours}h/wk)</span>
              </div>
            </div>
          </div>

          {/* 4. Experience */}
          <div className="why-match-item">
            <div className="why-match-title">Experience:</div>
            <div className="why-match-content">
              <div className="why-match-entry">
                <span className="why-match-check">✓</span>
                <span>{student.experienceLevel || 'Intermediate'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. AI Explanation */}
        {aiExplanation && (
          <div className="why-match-ai">
            <div className="why-match-ai-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={13} style={{ color: 'var(--brand-500)' }} />
                <span className="why-match-title" style={{ marginBottom: 0 }}>AI Explanation:</span>
              </div>
              <span className="why-match-ai-tag">
                {explanationSource === 'ai' ? '🤖 Gemini AI' : '⚡ Deterministic Explainer'}
              </span>
            </div>
            <p className="why-match-ai-quote">"{aiExplanation}"</p>
          </div>
        )}
      </div>

      {/* Skill Verification Section */}
      <SkillVerificationSection student={student} compact={false} />

      {/* 4-Pillar Score Breakdown */}
      <ScoreBreakdownCard breakdown={scoreBreakdown} />
    </div>
  );
}
