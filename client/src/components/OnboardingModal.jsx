import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, ArrowRight, UserCheck, Clock, MapPin, Briefcase } from 'lucide-react';

const ROLE_OPTIONS = ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'UI/UX Designer', 'Product/Domain'];
const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

export default function OnboardingModal({ isOpen, onClose, onCompleteProfile }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Frontend');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [skillsText, setSkillsText] = useState('React, TypeScript, Tailwind CSS');
  const [interestsText, setInterestsText] = useState('FinTech, Healthcare, GenAI');
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
      setError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((skillName) => ({ name: skillName, proficiency: experienceLevel }));

    if (parsedSkills.length === 0) {
      setError('Please list at least one skill.');
      return;
    }

    const parsedInterests = interestsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      const studentPayload = {
        name: name.trim(),
        email: email.trim(),
        primaryRole,
        experienceLevel,
        skills: parsedSkills,
        interests: parsedInterests,
        availabilityHours: Number(availabilityHours) || 15,
        timezoneOffset: Number(timezoneOffset) || 0,
        shortBio: shortBio.trim() || `Passionate ${primaryRole} looking to collaborate on high-impact projects.`
      };

      await onCompleteProfile(studentPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to complete profile onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card onboarding-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              <Sparkles size={14} /> Profile Onboarding
            </div>
            <h2 style={{ fontSize: '1.45rem' }}>Build Your ProjectMatch Profile</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Hayes"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                required
              />
            </div>
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
            <label className="form-label">Core Skills (comma-separated) *</label>
            <input
              type="text"
              className="form-input"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Python, Figma, PyTorch, Node.js"
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
              placeholder="e.g. Healthcare, FinTech, EdTech, DevTools"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weekly Availability (Hours/Week)</label>
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
              <label className="form-label">Timezone Offset (UTC Hours)</label>
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
            <label className="form-label">Short Bio / Pitch</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Tell teams what you love building and what hackathon projects excite you..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Profile...' : 'Complete Profile & Enter Dashboard'}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
