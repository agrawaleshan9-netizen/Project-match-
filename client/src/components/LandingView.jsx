import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Users, Compass, ChevronRight, Award, CheckCircle2 } from 'lucide-react';

export default function LandingView({ onGetStarted, onSignIn, onDirectExplore }) {
  return (
    <div className="landing-container">
      {/* Top Floating Nav */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="brand-logo">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <span>ProjectMatch</span>
            <span className="brand-badge">AI SQUAD ENGINE</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={onSignIn}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={onGetStarted}>
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Zap size={14} />
            <span>Next-Gen Hackathon & Project Matchmaker</span>
          </div>

          <h1 className="landing-title">
            Find the right people.<br />
            <span className="gradient-text">Build better teams.</span>
          </h1>

          <p className="landing-subtitle">
            ProjectMatch pairs creators, developers, and researchers based on deep skill complementarity, 
            verified availability, and shared domain passion — powered by transparent 4-pillar scoring and explainable AI.
          </p>

          <div className="landing-cta-group">
            <button className="btn btn-primary landing-btn-large" onClick={onGetStarted}>
              <Sparkles size={18} />
              Get Started — Create Profile
            </button>

            <button className="btn btn-secondary landing-btn-large" onClick={onSignIn}>
              <Users size={18} />
              Explore Demo Personas
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="landing-trust-strip">
            <div className="trust-item">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Deterministic Hard Gating</span>
            </div>
            <div className="trust-item">
              <Cpu size={16} className="text-brand" />
              <span>4-Pillar Weighted Math</span>
            </div>
            <div className="trust-item">
              <Sparkles size={16} className="text-magenta" />
              <span>AI Synergy Explanations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="landing-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper brand">
              <Cpu size={24} />
            </div>
            <h3>Skill Complementarity</h3>
            <p>
              Identifies candidate strengths that directly fulfill vacant project roles while avoiding redundant duplicate skill sets.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper emerald">
              <ShieldCheck size={24} />
            </div>
            <h3>Schedule & Timezone Overlap</h3>
            <p>
              Guarantees aligned weekly sprint hours and manageable timezone deltas so teammates can pair-program without scheduling friction.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper magenta">
              <Sparkles size={24} />
            </div>
            <h3>Explainable AI Rationale</h3>
            <p>
              Generates instant, human-readable match summaries highlighting why each teammate fits the open slot and project mission.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quick Preview Card */}
      <section className="landing-preview-section">
        <div className="preview-card-outer">
          <div className="preview-card-header">
            <div className="preview-dot red" />
            <div className="preview-dot yellow" />
            <div className="preview-dot green" />
            <span className="preview-title">Live Match Score Preview</span>
          </div>

          <div className="preview-card-content">
            <div className="preview-candidate-row">
              <div className="avatar-circle" style={{ width: 44, height: 44 }}>LM</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Leo Martinez <span className="pill pill-role matched" style={{ marginLeft: '0.4rem', fontSize: '0.7rem' }}>UI/UX Designer</span></div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Matched for <strong>MediScan AI</strong> (Healthcare Track)</div>
              </div>
              <div className="score-badge-saas high" style={{ padding: '0.35rem 0.75rem', minWidth: 70 }}>
                <span className="score-number-saas" style={{ fontSize: '1.25rem' }}>87%</span>
                <span className="score-label-saas">Top Match</span>
              </div>
            </div>

            <div className="ai-box" style={{ margin: '0.75rem 0 0', padding: '0.75rem 1rem' }}>
              <div className="ai-box-header" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={12} /> AI Rationale
              </div>
              <p className="ai-box-text" style={{ fontSize: '0.825rem' }}>
                "Leo fills the critical UI/UX gap with advanced Figma design systems and brings clinical workflow passion to MediScan AI."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
