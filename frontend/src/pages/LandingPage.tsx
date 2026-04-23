/**
 * Landing Page — Public homepage with hero, features, how-it-works, CTA
 * Shown to all visitors (logged in or not)
 */
import "../styles/landing.css";

const LandingPage = () => {
  /** Redirect to Google OAuth */
  const handleGetStarted = () => {
    window.location.href = new URL(
      "/api/auth/google",
      import.meta.env.VITE_BASE_URL
    ).toString();
  };

  return (
    <div className="landing-page" id="landing-page">
      {/* ─── Hero Section ─── */}
      <section className="landing-hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            DSA Practice Management Platform
          </div>

          <h1 className="hero-title">
            Master DSA,{" "}
            <span className="highlight">One Problem</span> at a Time
          </h1>

          <p className="hero-subtitle">
            Track your solved problems across Codeforces and LeetCode, revise
            with spaced repetition, discuss strategies with peers, and get
            AI-powered guidance — all in one place.
          </p>

          <div className="hero-actions">
            <button
              className="hero-btn-primary"
              onClick={handleGetStarted}
              id="hero-cta"
            >
              Get Started — It's Free
            </button>
            <a href="#features" className="hero-btn-secondary">
              See Features ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="landing-stats-bar">
        <div className="landing-stat">
          <div className="landing-stat-value">1000+</div>
          <div className="landing-stat-label">Problems Tracked</div>
        </div>
        <div className="landing-stat">
          <div className="landing-stat-value">3</div>
          <div className="landing-stat-label">Revision Windows</div>
        </div>
        <div className="landing-stat">
          <div className="landing-stat-value">AI</div>
          <div className="landing-stat-label">Powered Tutoring</div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="landing-features" id="features">
        <div className="section-header">
          <span className="section-eyebrow">Features</span>
          <h2 className="section-title">
            Everything you need to <span className="gradient-text">level up</span>
          </h2>
          <p className="section-subtitle">
            Built by competitive programmers, for competitive programmers.
            Stop forgetting problems you've already solved.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1: Spaced Repetition */}
          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">🧠</div>
            <h3 className="feature-title">Spaced Repetition</h3>
            <p className="feature-desc">
              Automatically organizes your solved problems into 1-day, 7-day,
              and 30-day revision buckets. Never forget a technique again.
            </p>
          </div>

          {/* Feature 2: Discussion Hub */}
          <div className="feature-card">
            <div className="feature-icon feature-icon-cyan">💬</div>
            <h3 className="feature-title">Discussion Hub</h3>
            <p className="feature-desc">
              Share insights, post editorials, and discuss approaches with
              fellow competitive programmers. Learn from the community.
            </p>
          </div>

          {/* Feature 3: AI Tutor */}
          <div className="feature-card">
            <div className="feature-icon feature-icon-green">🤖</div>
            <h3 className="feature-title">AI DSA Guide</h3>
            <p className="feature-desc">
              Stuck on a problem? Our AI tutor guides you toward the right
              approach without spoiling the solution. Think of it as a smart
              hint system.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="landing-how-it-works">
        <div className="section-header">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">
            Get started in <span className="gradient-text">3 simple steps</span>
          </h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Sign Up</h3>
            <p className="step-desc">
              Create your account with Google OAuth. Quick, secure, no passwords
              to remember.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Link Your Handle</h3>
            <p className="step-desc">
              Connect your Codeforces handle. We'll automatically sync your
              solved problems.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Start Revising</h3>
            <p className="step-desc">
              Use the dashboard to revisit problems at optimal intervals and
              track your progress.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2 className="cta-title">
            Ready to <span className="gradient-text">level up</span> your DSA?
          </h2>
          <p className="cta-desc">
            Join PracticeCF and turn random problem-solving into structured,
            long-term retention.
          </p>
          <button
            className="hero-btn-primary"
            onClick={handleGetStarted}
            id="cta-bottom"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-brand">PracticeCF</span>
          <span className="footer-text">
            © {new Date().getFullYear()} PracticeCF. Built for competitive programmers.
          </span>
          <div className="footer-links">
            <a
              href="https://github.com/Harsh-2005d/practiceCF"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="https://codeforces.com" target="_blank" rel="noreferrer">
              Codeforces
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
