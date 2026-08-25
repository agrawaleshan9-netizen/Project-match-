import React from 'react';

export default function ScoreBreakdownCard({ breakdown }) {
  if (!breakdown) return null;

  const pillars = [
    {
      key: 'skillComplementarity',
      label: 'Skills Match',
      weight: '40%',
      value: breakdown.skillComplementarity || 0,
      color: '#6366f1'
    },
    {
      key: 'availabilityFit',
      label: 'Availability',
      weight: '25%',
      value: breakdown.availabilityFit || 0,
      color: '#10b981'
    },
    {
      key: 'interestAlignment',
      label: 'Domain Interest',
      weight: '20%',
      value: breakdown.interestAlignment || 0,
      color: '#a855f7'
    },
    {
      key: 'experienceSynergy',
      label: 'Experience',
      weight: '15%',
      value: breakdown.experienceSynergy || 0,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="breakdown-grid">
      {pillars.map((p) => (
        <div key={p.key} className="breakdown-item">
          <div className="breakdown-label">
            <span>{p.label} <small style={{ opacity: 0.6 }}>({p.weight})</small></span>
            <strong>{p.value}%</strong>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(5, p.value))}%`,
                background: p.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
