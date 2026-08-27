import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Sparkles, Award, Users } from 'lucide-react';

export default function TeamBalance({ project, teamBalanceData, matches = [] }) {
  if (!project) return null;

  // Normalization helper
  const norm = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const projectNeeds = [
    ...(project.requiredRoles || []),
    ...(project.requiredSkills || [])
  ];

  // 1. Covered skills/roles
  let covered = teamBalanceData?.covered || [];
  if (!teamBalanceData?.covered) {
    const coveredSet = new Set();
    (project.currentMembers || []).forEach((m) => {
      if (m.role) coveredSet.add(m.role);
      if (Array.isArray(m.skills)) {
        m.skills.forEach((s) => coveredSet.add(typeof s === 'string' ? s : s.name));
      }
    });
    covered = Array.from(coveredSet);
  }

  // 2. Missing skills/roles
  let missing = teamBalanceData?.missing || [];
  if (!teamBalanceData?.missing) {
    missing = projectNeeds.filter((need) =>
      !covered.some((cov) => norm(cov) === norm(need) || norm(cov).includes(norm(need)) || norm(need).includes(norm(cov)))
    );
  }

  // 3. Suggested candidates who fill missing skills/roles
  let suggested = teamBalanceData?.suggested || [];
  if (!teamBalanceData?.suggested && matches.length > 0) {
    suggested = matches.filter((m) => {
      const fillsSkill = (m.missingSkillsSupplied || []).some((ms) =>
        missing.some((mis) => norm(mis) === norm(ms))
      );
      const fillsRole = missing.some((mis) => norm(mis) === norm(m.roleCovered || m.student?.primaryRole));
      return fillsSkill || fillsRole;
    }).slice(0, 4).map((m) => ({
      name: m.student?.name || 'Candidate',
      role: m.roleCovered || m.student?.primaryRole,
      filledSkillOrRole: (m.missingSkillsSupplied && m.missingSkillsSupplied.length > 0)
        ? m.missingSkillsSupplied.join(', ')
        : (m.roleCovered || m.student?.primaryRole),
      compatibilityScore: m.compatibilityScore
    }));
  }

  return (
    <div className="team-balance-card">
      <div className="team-balance-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="team-balance-icon-badge">
            <Scale size={18} />
          </div>
          <div>
            <h3 className="team-balance-title">Team Balance</h3>
            <p className="team-balance-subtitle">
              Talent distribution, missing gaps, and targeted candidate recommendations
            </p>
          </div>
        </div>

        {/* Process Flow Ribbon */}
        <div className="team-balance-flow">
          <span className="flow-step">PROJECT</span>
          <ArrowRight size={12} className="flow-arrow" />
          <span className="flow-step highlight">IDENTIFY SKILL GAPS</span>
          <ArrowRight size={12} className="flow-arrow" />
          <span className="flow-step action">FIND PEOPLE WHO FILL THE GAPS</span>
        </div>
      </div>

      {/* Main Grid: Covered vs Missing */}
      <div className="team-balance-grid">
        {/* Covered Column */}
        <div className="team-balance-col covered-col">
          <div className="team-balance-col-header">
            <span className="team-balance-col-label">Covered:</span>
            <span className="skill-gap-count">{covered.length}</span>
          </div>
          <div className="team-balance-list">
            {covered.length > 0 ? (
              covered.map((cov, idx) => (
                <div key={idx} className="team-balance-entry covered">
                  <span className="team-balance-check">✓</span>
                  <span>{cov}</span>
                </div>
              ))
            ) : (
              <div className="skill-gap-empty">No skills currently covered</div>
            )}
          </div>
        </div>

        {/* Missing Column */}
        <div className="team-balance-col missing-col">
          <div className="team-balance-col-header">
            <span className="team-balance-col-label" style={{ color: 'var(--score-amber)' }}>Missing:</span>
            <span className="skill-gap-count warn">{missing.length}</span>
          </div>
          <div className="team-balance-list">
            {missing.length > 0 ? (
              missing.map((mis, idx) => (
                <div key={idx} className="team-balance-entry missing">
                  <span className="team-balance-warn">⚠</span>
                  <span>{mis}</span>
                </div>
              ))
            ) : (
              <div className="team-balance-entry covered" style={{ color: 'var(--score-emerald)' }}>
                <span className="team-balance-check">✓</span>
                <span>Team is fully balanced!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Candidates Section */}
      <div className="team-balance-suggested-section">
        <div className="team-balance-suggested-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Users size={15} style={{ color: 'var(--brand-500)' }} />
            <span className="team-balance-suggested-title">Suggested:</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Candidates who can fill missing skills
          </span>
        </div>

        <div className="team-balance-suggested-list">
          {suggested.length > 0 ? (
            suggested.map((cand, idx) => (
              <div key={idx} className="team-balance-candidate-pill">
                <div className="cand-info">
                  <strong className="cand-name">{cand.name}</strong>
                  <span className="cand-separator">—</span>
                  <span className="cand-skill">{cand.filledSkillOrRole || cand.role}</span>
                </div>
                {cand.compatibilityScore && (
                  <span className="cand-score">
                    {cand.compatibilityScore}% Match
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="skill-gap-empty">
              No specific candidates found matching missing skills
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
