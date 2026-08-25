import React from 'react';
import { X, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, students = [], onSelectPersona, onContinueAsGuest }) {
  if (!isOpen) return null;

  // Curated demo personas for quick showcase
  const demoPersonas = students.slice(0, 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              <Sparkles size={14} /> Quick Demo Access
            </div>
            <h2 style={{ fontSize: '1.35rem' }}>Select a Participant Persona</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Choose a pre-loaded hackathon profile to immediately explore personalized matching and team formation:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
          {demoPersonas.map((student) => {
            const initials = student.avatar || (student.name || 'U').slice(0, 2).toUpperCase();
            return (
              <button
                key={student.id}
                onClick={() => {
                  onSelectPersona(student);
                  onClose();
                }}
                className="persona-btn"
              >
                <div className="avatar-circle" style={{ width: 38, height: 38, fontSize: '0.85rem' }}>
                  {initials}
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-main)' }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    {student.primaryRole} • {student.skills.slice(0, 2).map((s) => s.name).join(', ')} • {student.availabilityHours}h/wk
                  </div>
                </div>
                <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              onContinueAsGuest();
              onClose();
            }}
          >
            Continue as Guest Reviewer
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
