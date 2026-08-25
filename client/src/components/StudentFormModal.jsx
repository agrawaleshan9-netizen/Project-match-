import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ROLE_OPTIONS = ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'UI/UX Designer', 'Product/Domain'];
const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function StudentFormModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Frontend');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [skillsText, setSkillsText] = useState('React, TypeScript, CSS');
  const [interestsText, setInterestsText] = useState('FinTech, Healthcare');
  const [availabilityHours, setAvailabilityHours] = useState(20);
  const [timezoneOffset, setTimezoneOffset] = useState(-5);
  const [shortBio, setShortBio] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Student name is required.');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, proficiency: experienceLevel }));

    if (parsedSkills.length === 0) {
      setError('At least one skill is required.');
      return;
    }

    const parsedInterests = interestsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        primaryRole,
        experienceLevel,
        skills: parsedSkills,
        interests: parsedInterests,
        availabilityHours: Number(availabilityHours) || 10,
        timezoneOffset: Number(timezoneOffset) || 0,
        shortBio: shortBio.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create student profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3>Create Candidate Profile</h3>
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
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Role</label>
              <select
                className="form-input"
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                className="form-input"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills (comma-separated) *</label>
            <input
              type="text"
              className="form-input"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Next.js, TypeScript, Tailwind"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Domain Interests (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="e.g. Healthcare, GenAI, FinTech"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Availability (Hours/Week)</label>
              <input
                type="number"
                min="1"
                max="80"
                className="form-input"
                value={availabilityHours}
                onChange={(e) => setAvailabilityHours(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone (UTC Offset)</label>
              <input
                type="number"
                min="-12"
                max="14"
                className="form-input"
                value={timezoneOffset}
                onChange={(e) => setTimezoneOffset(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Bio / Background</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Brief summary of past projects, hackathon goals, or specific passion..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
