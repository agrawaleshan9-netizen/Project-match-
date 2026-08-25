import React from 'react';

export default function ScoreMeter({ score = 0 }) {
  const getTier = (s) => {
    if (s >= 80) return { class: 'high', label: 'Top Match', stroke: '#10b981', track: 'rgba(16, 185, 129, 0.15)' };
    if (s >= 60) return { class: 'med', label: 'Strong Fit', stroke: '#f59e0b', track: 'rgba(245, 158, 11, 0.15)' };
    return { class: 'low', label: 'Partial Fit', stroke: '#f43f5e', track: 'rgba(244, 63, 94, 0.15)' };
  };

  const tier = getTier(score);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`score-badge-saas ${tier.class}`}>
      <div style={{ position: 'relative', width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="68" height="68" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx="34"
            cy="34"
            r={radius}
            stroke={tier.track}
            strokeWidth="5"
            fill="transparent"
          />
          {/* Progress Stroke */}
          <circle
            cx="34"
            cy="34"
            r={radius}
            stroke={tier.stroke}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="score-number-saas">{score}%</span>
        </div>
      </div>
      <span className="score-label-saas">{tier.label}</span>
    </div>
  );
}
