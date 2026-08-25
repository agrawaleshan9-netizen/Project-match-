import React from 'react';
import { Plus, Users, Clock, ArrowRight } from 'lucide-react';

export default function ProjectsView({ projects = [], onSelectProject, onOpenCreateProject }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>Active Projects</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Browse active hackathon projects or post your own idea.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateProject}>
          <Plus size={16} /> Post New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {projects.map((project) => (
          <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>{project.title}</h3>
                <span className="pill" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
                  {project.track}
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
                {project.description}
              </p>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Required Roles:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(project.requiredRoles || []).map((role, i) => (
                    <span key={i} className="pill pill-role matched">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Desired Skills:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(project.requiredSkills || []).map((skill, i) => (
                    <span key={i} className="pill pill-skill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> {project.minAvailabilityHours}h/wk min
              </span>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onSelectProject(project.id)}
              >
                Find Teammates <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
