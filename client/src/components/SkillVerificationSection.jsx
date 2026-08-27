import React from 'react';
import { ShieldCheck, Github, Globe, CheckCircle2, XCircle, Award, ExternalLink, ShieldAlert, UserCheck } from 'lucide-react';

export default function SkillVerificationSection({ student, compact = false }) {
  if (!student) return null;

  const hasGithub = Boolean(student.githubUrl && student.githubUrl.trim());
  const hasPortfolio = Boolean(student.portfolioUrl && student.portfolioUrl.trim());
  const hasAssessment = student.assessmentStatus === 'Completed';

  // Calculate Verification Signal Score (0-3)
  const signalCount = (hasGithub ? 1 : 0) + (hasPortfolio ? 1 : 0) + (hasAssessment ? 1 : 0);

  let overallStatus = 'Self-Declared';
  let statusClass = 'self-declared';
  let statusIcon = <UserCheck size={12} />;

  if (signalCount >= 2) {
    overallStatus = 'Verified';
    statusClass = 'verified';
    statusIcon = <ShieldCheck size={12} />;
  } else if (signalCount === 1) {
    overallStatus = 'Partially Verified';
    statusClass = 'partially-verified';
    statusIcon = <CheckCircle2 size={12} />;
  }

  return (
    <div className={`skill-verification-card ${compact ? 'compact' : ''}`}>
      <div className="skill-verification-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <ShieldCheck size={14} style={{ color: 'var(--brand-500)' }} />
          <span className="skill-verification-title">Skill Verification</span>
        </div>
        <span className={`pill-verification ${statusClass}`}>
          {statusIcon} {overallStatus}
        </span>
      </div>

      <div className="skill-verification-grid">
        {/* 1. GitHub */}
        <div className="verification-item">
          <div className="verification-label">
            <Github size={13} />
            <span>GitHub:</span>
          </div>
          <div className="verification-value">
            {hasGithub ? (
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="verification-link connected"
              >
                <span className="v-check">✓</span> Connected <ExternalLink size={10} />
              </a>
            ) : (
              <span className="verification-status not-connected">
                <span className="v-cross">✕</span> Not Connected
              </span>
            )}
          </div>
        </div>

        {/* 2. Portfolio */}
        <div className="verification-item">
          <div className="verification-label">
            <Globe size={13} />
            <span>Portfolio:</span>
          </div>
          <div className="verification-value">
            {hasPortfolio ? (
              <a
                href={student.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="verification-link available"
              >
                <span className="v-check">✓</span> Available <ExternalLink size={10} />
              </a>
            ) : (
              <span className="verification-status not-connected">
                <span className="v-cross">✕</span> Not Available
              </span>
            )}
          </div>
        </div>

        {/* 3. Skill Assessment */}
        <div className="verification-item">
          <div className="verification-label">
            <Award size={13} />
            <span>Skill Assessment:</span>
          </div>
          <div className="verification-value">
            {hasAssessment ? (
              <span className="verification-status completed">
                <span className="v-check">✓</span> Completed
              </span>
            ) : (
              <span className="verification-status not-completed">
                <span className="v-dash">—</span> Not Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
