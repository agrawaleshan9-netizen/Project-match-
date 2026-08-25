import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const TRACK_OPTIONS = ['Healthcare', 'FinTech', 'Climate & Sustainability', 'EdTech', 'DevTools', 'Web3', 'Social Good', 'General'];
const AVAILABLE_ROLES = ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'UI/UX Designer', 'Product/Domain'];

export default function ProjectFormModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [track, setTrack] = useState('Healthcare');
  const [targetTeamSize, setTargetTeamSize] = useState(4);
  const [minAvailabilityHours, setMinAvailabilityHours] = useState(18);
  const [selectedRoles, setSelectedRoles] = useState(['UI/UX Designer', 'Frontend']);
  const [skillsText, setSkillsText] = useState('React, Figma, Tailwind CSS');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Project description is required.');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Please select at least one required role.');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (parsedSkills.length === 0) {
      setError('Please provide at least one required skill.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        track,
        targetTeamSize: Number(targetTeamSize) || 4,
        minAvailabilityHours: Number(minAvailabilityHours) || 10,
        requiredRoles: selectedRoles,
        requiredSkills: parsedSkills,
        currentMembers: []
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3>Post New Project</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NeuroVision XR"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Track / Theme</label>
              <select
                className="form-input"
                value={track}
                onChange={(e) => setTrack(e.target.value)}
              >
                {TRACK_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Team Size</label>
              <input
                type="number"
                min="2"
                max="8"
                className="form-input"
                value={targetTeamSize}
                onChange={(e) => setTargetTeamSize(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Problem Statement / Description *</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem, tech stack, and what you are building..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required Roles to Recruit *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`pill ${isSelected ? 'pill-role matched' : 'pill-exp'}`}
                    style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
                  >
                    {isSelected ? `✓ ${role}` : `+ ${role}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required / Desired Skills (comma-separated) *</label>
            <input
              type="text"
              className="form-input"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Figma, Next.js, PyTorch"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Minimum Hours Commitment (Hours/Week)</label>
            <input
              type="number"
              min="1"
              max="60"
              className="form-input"
              value={minAvailabilityHours}
              onChange={(e) => setMinAvailabilityHours(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
