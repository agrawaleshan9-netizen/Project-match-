import React from 'react';

export default function ScoreMeter({ score = 0, size = 'md' }) {
  const getTier = (s) => {
    if (s >= 80) return 'high';
    if (s >= 60) return 'med';
    return 'low';
  };

  const tier = getTier(score);

  return (
    <div className={`score-badge ${tier}`}>
      <span className="score-number">{score}%</span>
      <span className="score-label">Fit Score</span>
    </div>
  );
}
