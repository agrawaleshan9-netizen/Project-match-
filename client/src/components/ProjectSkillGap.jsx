import React from 'react';
import { Target, CheckCircle2, AlertTriangle, UserCheck, Sparkles, Award } from 'lucide-react';

export default function ProjectSkillGap({ project, skillGapData, matches = [] }) {
  if (!project) return null;

  // Normalization helper
  const norm = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. PROJECT NEEDS: required roles and skills
  const projectNeeds = skillGapData?.projectNeeds || [
    ...(project.requiredRoles || []),
    ...(project.requiredSkills || [])
  ];

  // 2. CURRENT TEAM: covered roles and skills
  const currentMembers = project.currentMembers || [];
  let currentTeamCovered = skillGapData?.currentTeam || [];
  if (!skillGapData?.currentTeam) {
    const coveredSet = new Set();
    currentMembers.forEach((m) => {
      if (m.role) coveredSet.add(m.role);
      if (Array.isArray(m.skills)) {
        m.skills.forEach((s) => coveredSet.add(typeof s === 'string' ? s : s.name));
      }
    });
    currentTeamCovered = Array.from(coveredSet);
  }

  // 3. MISSING SKILLS: required items not covered by current team
  let missingSkills = skillGapData?.missingSkills || [];
  if (!skillGapData?.missingSkills) {
    missingSkills = projectNeeds.filter((need) =>
      !currentTeamCovered.some((cov) => norm(cov) === norm(need) || norm(cov).includes(norm(need)) || norm(need).includes(norm(cov)))
    );
  }

  // 4. RECOMMENDED CANDIDATE: highest-ranked candidate who fills a missing skill/role
  let recommendedCandidate = skillGapData?.recommendedCandidate;
  if (!recommendedCandidate && matches.length > 0) {
    const recMatch = matches.find((m) => {
      const fillsSkill = (m.missingSkillsSupplied || []).some((ms) =>
        missingSkills.some((mis) => norm(mis) === norm(ms))
      );
      const fillsRole = missingSkills.some((mis) => norm(mis) === norm(m.roleCovered || m.student?.primaryRole));
      return fillsSkill || fillsRole;
    }) || matches[0];

    if (recMatch) {
      recommendedCandidate = {
        name: recMatch.student?.name || 'Top Candidate',
        role: recMatch.roleCovered || recMatch.student?.primaryRole,
        filledSkillOrRole: (recMatch.missingSkillsSupplied && recMatch.missingSkillsSupplied.length > 0)
          ? recMatch.missingSkillsSupplied.join(', ')
          : (recMatch.roleCovered || recMatch.student?.primaryRole),
        compatibilityScore: recMatch.compatibilityScore
      };
    }
  }

  return (
    <div className="skill-gap-card">
      <div className="skill-gap-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="skill-gap-icon-badge">
            <Target size={18} />
          </div>
          <div>
            <h3 className="skill-gap-title">Project Skill Gap</h3>
            <p className="skill-gap-subtitle">
              Dynamic team gap analysis & capability fulfillment mapping
            </p>
          </div>
        </div>
        <span className="skill-gap-badge">
          {missingSkills.length} Gap{missingSkills.length === 1 ? '' : 's'} Identified
        </span>
      </div>

      {/* 3-Column Grid: PROJECT NEEDS | CURRENT TEAM | MISSING SKILLS */}
      <div className="skill-gap-grid">
        {/* Column 1: PROJECT NEEDS */}
        <div className="skill-gap-column">
          <div className="skill-gap-col-header">
            <span className="skill-gap-col-title">PROJECT NEEDS</span>
            <span className="skill-gap-count">{projectNeeds.length}</span>
          </div>
          <div className="skill-gap-list">
            {projectNeeds.length > 0 ? (
              projectNeeds.map((need, idx) => (
                <div key={idx} className="skill-gap-entry need">
                  <span className="skill-gap-check">✓</span>
                  <span>{need}</span>
                </div>
              ))
            ) : (
              <div className="skill-gap-empty">No specific needs specified</div>
            )}
          </div>
        </div>

        {/* Column 2: CURRENT TEAM */}
        <div className="skill-gap-column">
          <div className="skill-gap-col-header">
            <span className="skill-gap-col-title">CURRENT TEAM</span>
            <span className="skill-gap-count">{currentTeamCovered.length}</span>
          </div>
          <div className="skill-gap-list">
            {currentTeamCovered.length > 0 ? (
              currentTeamCovered.map((cov, idx) => (
                <div key={idx} className="skill-gap-entry covered">
                  <span className="skill-gap-check">✓</span>
                  <span>{cov}</span>
                </div>
              ))
            ) : (
              <div className="skill-gap-empty">No team members yet (Solo project)</div>
            )}
          </div>
        </div>

        {/* Column 3: MISSING SKILLS */}
        <div className="skill-gap-column missing-col">
          <div className="skill-gap-col-header">
            <span className="skill-gap-col-title" style={{ color: 'var(--score-amber)' }}>MISSING SKILLS</span>
            <span className="skill-gap-count warn">{missingSkills.length}</span>
          </div>
          <div className="skill-gap-list">
            {missingSkills.length > 0 ? (
              missingSkills.map((mis, idx) => (
                <div key={idx} className="skill-gap-entry missing">
                  <span className="skill-gap-warn">⚠</span>
                  <span>{mis}</span>
                </div>
              ))
            ) : (
              <div className="skill-gap-entry covered" style={{ color: 'var(--score-emerald)' }}>
                <span className="skill-gap-check">✓</span>
                <span>All project needs fully covered!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECOMMENDED CANDIDATE Box */}
      {recommendedCandidate && (
        <div className="skill-gap-rec-box">
          <div className="skill-gap-rec-left">
            <span className="skill-gap-rec-label">
              <Sparkles size={14} style={{ color: 'var(--brand-500)' }} /> RECOMMENDED CANDIDATE
            </span>
            <div className="skill-gap-rec-candidate">
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                {recommendedCandidate.name}
              </strong>
              <span className="skill-gap-rec-separator">—</span>
              <span className="skill-gap-rec-skill">
                {recommendedCandidate.filledSkillOrRole || recommendedCandidate.role}
              </span>
            </div>
          </div>
          {recommendedCandidate.compatibilityScore && (
            <div className="skill-gap-rec-score">
              <Award size={14} />
              <span>{recommendedCandidate.compatibilityScore}% Compatibility</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
