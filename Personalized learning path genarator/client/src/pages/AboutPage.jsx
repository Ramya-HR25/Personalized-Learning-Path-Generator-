import React from "react";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="page about-page">
      <section className="hero glass-card animate-reveal">
        <div className="hero-copy">
          <span className="eyebrow animate-scale delay-1">Project Details</span>
          <h1 className="animate-reveal delay-2">Everything you need to know about LearnPath AI.</h1>
          <p className="animate-reveal delay-3">
            A comprehensive overview of our purpose, features, and how you can get started on your 
            learning journey today.
          </p>
          <div className="button-row animate-reveal delay-4" style={{ marginTop: '24px' }}>
            <Link to="/register" className="primary-button inline-button">
              Start Your Journey
            </Link>
            <Link to="/" className="secondary-button inline-button">
              Back to Home
            </Link>
          </div>
        </div>
        <div className="hero-panel animate-float">
          <div className="glass-card highlight-card">
            <strong>Clarity</strong>
            <p>No more guessing. Just learning.</p>
          </div>
          <div className="glass-card highlight-card">
            <strong>Structure</strong>
            <p>Organized milestones for better results.</p>
          </div>
        </div>
      </section>

      <div className="two-column-grid">
        {/* Section 1: About */}
        <section className="glass-card section-card animate-reveal delay-1">
          <div className="section-heading">
            <span className="eyebrow">01</span>
            <h2>About</h2>
          </div>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "var(--text-secondary)" }}>
            Build a realistic, motivating path instead of guessing what to study next. Our platform 
            is designed to simplify how you approach new skills by providing a structured and calm 
            environment that helps you focus on what matters most: learning.
          </p>
        </section>

        {/* Section 2: Features */}
        <section className="glass-card section-card animate-reveal delay-2">
          <div className="section-heading">
            <span className="eyebrow">02</span>
            <h2>Features</h2>
          </div>
          <div className="stack-list">
            {[
              { title: "Authentication", desc: "Secure access to your personal learning data." },
              { title: "Progress Automation", desc: "Your journey is tracked automatically as you learn." },
              { title: "Dashboards", desc: "Visualize your growth with detailed analytics." },
              { title: "Feedback", desc: "Share your experience to help us improve." },
              { title: "Certificates & Reports", desc: "Document and celebrate your achievements." }
            ].map((f, i) => (
              <div key={f.title} className="list-item" style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span className="dot" style={{ marginTop: '8px' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{f.title}</h3>
                    <p className="muted-text" style={{ fontSize: '0.85rem' }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Section 3: How it works */}
      <section className="glass-card section-card animate-reveal delay-3">
        <div className="section-heading">
          <span className="eyebrow">03</span>
          <h2>How it works</h2>
        </div>
        <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="step-card animate-scale delay-1">
            <span>01</span>
            <h3>Choose Topic</h3>
            <p>Select the subject you want to master from our extensive catalog.</p>
          </div>
          <div className="step-card animate-scale delay-2">
            <span>02</span>
            <h3>Define Purpose</h3>
            <p>Tell us why you're learning to help us tailor the depth of the content.</p>
          </div>
          <div className="step-card animate-scale delay-3">
            <span>03</span>
            <h3>Select Level</h3>
            <p>Choose your current expertise level to get the most relevant starting point.</p>
          </div>
          <div className="step-card animate-scale delay-4">
            <span>04</span>
            <h3>Start Learning</h3>
            <p>Instantly access curated resources and start tracking your progress.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
