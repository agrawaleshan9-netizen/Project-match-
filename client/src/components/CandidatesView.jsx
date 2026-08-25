import React, { useState } from 'react';
import { Plus, Clock, MapPin, Search } from 'lucide-react';

const ROLES = ['ALL', 'Frontend', 'Backend', 'Fullstack', 'AI/ML', 'UI/UX Designer', 'Product/Domain'];

export default function CandidatesView({ students = [], onOpenCreateStudent }) {
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) => {
    const matchesRole = selectedRole === 'ALL' || (student.primaryRole || '').toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch = !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.skills || []).some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.interests || []).some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Participant Roster</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Explore available candidates and talent across all hackathon tracks.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateStudent}>
          <Plus size={16} /> Register Candidate
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="nav-tabs" style={{ overflowX: 'auto' }}>
            {ROLES.map((role) => (
              <button
                key={role}
                className={`nav-tab-btn ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
              placeholder="Search skill, name, domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredStudents.map((student) => {
          const initials = student.avatar || (student.name || 'U').slice(0, 2).toUpperCase();

          return (
            <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="avatar-circle" style={{ width: 42, height: 42, fontSize: '0.9rem' }}>
                    {initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{student.name}</h3>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span className="pill pill-role matched">{student.primaryRole}</span>
                      <span className="pill pill-exp">{student.experienceLevel}</span>
                    </div>
                  </div>
                </div>

                {student.shortBio && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    "{student.shortBio}"
                  </p>
                )}

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Skills & Proficiency:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(student.skills || []).map((skill, i) => (
                      <span key={i} className="pill pill-skill" title={`Proficiency: ${skill.proficiency}`}>
                        {skill.name} <small style={{ opacity: 0.6 }}>({skill.proficiency?.slice(0, 3)})</small>
                      </span>
                    ))}
                  </div>
                </div>

                {student.interests && student.interests.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Interests:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {student.interests.map((interest, i) => (
                        <span key={i} className="pill pill-exp">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {student.availabilityHours}h/wk
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} /> UTC {student.timezoneOffset >= 0 ? `+${student.timezoneOffset}` : student.timezoneOffset}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
