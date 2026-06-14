import { Link } from "react-router-dom";

const features = [
  "Adaptive learning path generation based on one-click preferences",
  "Automatic tracking for videos, courses, articles, and notes in one place",
  "Performance dashboard with progress analytics and coach-style summaries",
  "Downloadable reports and completion certificates for your learning journey"
];

const steps = [
  "Create an account and tell the system what you want to learn.",
  "Get a chapter-by-chapter plan with curated videos, courses, notes, and articles.",
  "Let the platform auto-track activity and unlock the next stage as you finish."
];

export function LandingPage() {
  return (
    <div className="page landing-page">
      <section className="hero glass-card">
        <div className="hero-copy">
          <span className="eyebrow">Personalized Learning Path Generator</span>
          <h1>Turn learning goals into a guided roadmap with automatic progress tracking.</h1>
          <p>
            LearnPath  builds a structured path around your topic, purpose, and current level, then measures activity
            across videos, courses, and reading time to keep momentum visible.
          </p>
          <div className="button-row">
            <Link to="/register" className="primary-button inline-button">
              Get Started
            </Link>
            <Link to="/login" className="secondary-button inline-button">
              Existing user
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <Link to="/about" className="glass-card highlight-card clickable-card">
            <strong>About</strong>
            <p>Build a realistic, motivating path instead of guessing what to study next.</p>
          </Link>
          <Link to="/about" className="glass-card highlight-card clickable-card">
            <strong>Features</strong>
            <p>Auth, progress automation, dashboards, feedback, certificates, and reports.</p>
          </Link>
          <Link to="/about" className="glass-card highlight-card clickable-card">
            <strong>How it works</strong>
            <p>Choose one topic, one purpose, one level, then start learning from curated resources immediately.</p>
          </Link>
        </div>
      </section>

      <section className="two-column-grid">
        <div className="glass-card section-card">
          <div className="section-heading">
            <h2>Core features</h2>
            <p>Designed to feel structured, calm, and motivating on both mobile and desktop.</p>
          </div>
          <div className="stack-list">
            {features.map((item) => (
              <div key={item} className="list-item">
                <span className="dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card section-card">
          <div className="section-heading">
            <h2>How it works</h2>
            <p>Three simple steps to go from goal to measurable progress.</p>
          </div>
          <div className="steps-grid">
            {steps.map((item, index) => (
              <div key={item} className="step-card">
                <span>0{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
