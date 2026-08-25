import React from 'react';

export default function ScoreBreakdownCard({ breakdown }) {
  if (!breakdown) return null;

  const pillars = [
    {
      key: 'skillComplementarity',
      label: 'Skills Complementarity',
      weight: '40%',
      value: breakdown.skillComplementarity || 0,
      gradient: 'linear-gradient(90deg, #6366f1, #818cf8)'
    },
    {
      key: 'availabilityFit',
      label: 'Availability & Schedule',
      weight: '25%',
      value: breakdown.availabilityFit || 0,
      gradient: 'linear-gradient(90deg, #10b981, #34d399)'
    },
    {
      key: 'interestAlignment',
      label: 'Domain Interest',
      weight: '20%',
      value: breakdown.interestAlignment || 0,
      gradient: 'linear-gradient(90deg, #a855f7, #c084fc)'
    },
    {
      key: 'experienceSynergy',
      label: 'Experience Synergy',
      weight: '15%',
      value: breakdown.experienceSynergy || 0,
      gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
    }
  ];

  return (
    <div className="breakdown-grid">
      {pillars.map((p) => (
        <div key={p.key} className="breakdown-item">
          <div className="breakdown-label">
            <span>{p.label} <small style={{ opacity: 0.6, fontSize: '0.7rem' }}>({p.weight})</small></span>
            <strong style={{ color: 'var(--text-main)' }}>{p.value}%</strong>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(6, p.value))}%`,
                background: p.gradient
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
