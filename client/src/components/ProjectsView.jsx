import React from 'react';
import { Plus, Users, Clock, ArrowRight, FolderKanban } from 'lucide-react';

export default function ProjectsView({ projects = [], onSelectProject, onOpenCreateProject }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem' }}>Active Hackathon Projects</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Discover active project teams looking for specific talent and skillsets.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateProject}>
          <Plus size={16} /> Post New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <div key={project.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{project.title}</h3>
                <span className="pill" style={{ background: 'var(--brand-gradient)', color: 'white', fontWeight: 700 }}>
                  {project.track}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {project.description}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
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

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                  Required Skills:
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> Min {project.minAvailabilityHours}h/wk
              </span>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onSelectProject(project.id)}
                style={{ fontWeight: 700 }}
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
