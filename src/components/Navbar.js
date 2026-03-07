import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/Logo.png';

const countriesList = [
  { code: 'pk', name: 'Pakistan' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'in', name: 'India' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  { code: 'ae', name: 'UAE' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'za', name: 'South Africa' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'sg', name: 'Singapore' },
  { code: 'my', name: 'Malaysia' },
  { code: 'cn', name: 'China' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'ph', name: 'Philippines' },
  { code: 'th', name: 'Thailand' },
  { code: 'id', name: 'Indonesia' },
  { code: 'ru', name: 'Russia' },
  { code: 'tr', name: 'Turkey' },
  { code: 'eg', name: 'Egypt' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'ar', name: 'Argentina' },
  { code: 'br', name: 'Brazil' },
  { code: 'co', name: 'Colombia' },
  { code: 'mx', name: 'Mexico' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'it', name: 'Italy' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'no', name: 'Norway' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'es', name: 'Spain' },
  { code: 'se', name: 'Sweden' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'ie', name: 'Ireland' },
  { code: 'il', name: 'Israel' }
];

const SUGGESTED_TOPICS = [
  'Artificial Intelligence', 'Climate Change', 'Stock Market',
  'World Cup', 'Space Exploration', 'Cryptocurrency',
  'Election 2025', 'Tech Startups', 'Health & Wellness', 'Geopolitics'
];

const GitHubIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// ── Newsletter Modal ──────────────────────────────────
const NewsletterModal = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  const handleClose = () => { onClose(); setTimeout(() => setSubmitted(false), 400); };

  if (!show) return null;

  return (
    <div
      className="modal fade show newsletter-modal"
      style={{ display: 'block', background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '480px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Hero section */}
          <div className="newsletter-hero">
            <button
              onClick={handleClose}
              style={{
                position: 'absolute', top: 14, right: 16, background: 'rgba(255,255,255,.15)',
                border: 'none', color: '#fff', width: 30, height: 30, borderRadius: 8,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', zIndex: 5
              }}
            >×</button>
            <div className="newsletter-icon">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <h3 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.6rem', marginBottom: 8, position: 'relative', zIndex: 1 }}>
              Stay Ahead of the News
            </h3>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.875rem', lineHeight: 1.6, position: 'relative', zIndex: 1, marginBottom: 0 }}>
              Get the day's most important stories delivered to your inbox — every morning, free.
            </p>
          </div>

          {/* Form section */}
          <div style={{ padding: '28px 32px 32px' }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input
                    className="newsletter-input"
                    type="text"
                    placeholder="Your first name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <input
                    className="newsletter-input"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-submit" disabled={loading}>
                    {loading
                      ? <><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Subscribing...</>
                      : <><i className="fa-solid fa-paper-plane me-2"></i>Subscribe — It's Free</>
                    }
                  </button>
                </div>
                <p style={{ fontSize: '.72rem', color: 'var(--text-3)', textAlign: 'center', marginTop: 12, marginBottom: 0 }}>
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="newsletter-success">
                <div className="success-ring">✓</div>
                <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>
                  You're subscribed!
                </h5>
                <p style={{ color: 'var(--text-2)', fontSize: '.875rem', textAlign: 'center', marginBottom: 0 }}>
                  Welcome{name ? `, ${name}` : ''}! Check your inbox for a confirmation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Navbar ───────────────────────────────────────
const Navbar = ({ setCountry, setSearchQuery, currentCountry }) => {
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(new Date());
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    document.documentElement.setAttribute('data-bs-theme', theme);
    return () => clearInterval(timerId);
  }, [theme]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSuggestions(false);
  };

  const pickSuggestion = (s) => {
    setSearchInput(s);
    setSearchQuery(s);
    setShowSuggestions(false);
  };

  const filteredSuggestions = searchInput.length > 0
    ? SUGGESTED_TOPICS.filter(t => t.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 5)
    : SUGGESTED_TOPICS.slice(0, 5);

  const currentCountryName = countriesList.find(c => c.code === currentCountry)?.name || currentCountry.toUpperCase();

  return (
    <>
      <div className="fixed-top">
        {/* Ticker */}
        <div className="ticker-bar d-flex align-items-center px-3 gap-3">
          <span className="live-badge flex-shrink-0">
            <span className="live-dot"></span>LIVE
          </span>
          <div className="ticker-text fw-medium">
            BREAKING: Global markets reach record highs as Fed signals rate cuts &nbsp;|&nbsp;
            AI models surpass human benchmarks in new Stanford study &nbsp;|&nbsp;
            Champions League semifinals set — two giants clash in Madrid &nbsp;|&nbsp;
            Pakistan PM addresses UN General Assembly on climate crisis &nbsp;|&nbsp;
            SpaceX Starship completes first fully successful orbital flight
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="navbar navbar-expand-lg glass-navbar">
          <div className="container-fluid px-4">

            {/* Brand */}
            <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
              <div className="brand-logo-wrapper">
                <img
                  src={logo}
                  alt="Kurrent News"
                  className="brand-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<span style="color:#fff;font-weight:900;font-size:1.1rem;font-family:'Playfair Display',serif;position:relative;z-index:2">K</span>`;
                  }}
                />
              </div>
              <div className="d-flex flex-column lh-1">
                <span className="brand-wordmark-primary">Kurrent</span>
                <span className="brand-wordmark-sub">News</span>
              </div>
            </NavLink>

            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navContent"
              aria-controls="navContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navContent">
              {/* Nav links */}
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
                <li className="nav-item">
                  <NavLink className="nav-link px-3 rounded-pill" to="/">Top Stories</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3 rounded-pill" to="/business">Business</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3 rounded-pill" to="/technology">Tech</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link px-3 rounded-pill" to="/sports">Sports</NavLink>
                </li>
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle px-3 rounded-pill" role="button" data-bs-toggle="dropdown">
                    More
                  </span>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2">
                    <li>
                      <NavLink className="dropdown-item py-2 fw-medium" to="/entertainment">
                        <i className="fa-solid fa-film me-2 text-danger"></i>Entertainment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item py-2 fw-medium" to="/health">
                        <i className="fa-solid fa-heart-pulse me-2 text-danger"></i>Health
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item py-2 fw-medium" to="/science">
                        <i className="fa-solid fa-flask me-2 text-danger"></i>Science
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* Right controls */}
              <div className="d-flex align-items-center gap-2">
                {/* Date/Time */}
                <div className="d-none d-xl-flex flex-column align-items-end lh-sm pe-3 me-1" style={{ borderRight: '1px solid var(--border)' }}>
                  <span className="fw-bold grad-text" style={{ fontSize: '.82rem' }}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span style={{ fontSize: '.7rem', color: 'var(--text-3)', fontWeight: 600 }}>{formattedDate}</span>
                </div>

                {/* Country */}
                <div className="dropdown">
                  <button
                    className="btn btn-sm rounded-pill fw-bold dropdown-toggle px-3"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-2)', fontSize: '.8rem' }}
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa-solid fa-globe me-1" style={{ color: 'var(--red-1)' }}></i>
                    {currentCountryName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{ minWidth: '160px', maxHeight: '360px', overflowY: 'auto' }}>
                    {countriesList.map((c) => (
                      <li key={c.code}>
                        <button
                          className={`dropdown-item fw-medium ${currentCountry === c.code ? 'active' : ''}`}
                          onClick={() => setCountry(c.code)}
                        >
                          {currentCountry === c.code && <i className="fa-solid fa-check me-2" style={{ color: 'var(--red-1)', fontSize: '.7rem' }}></i>}
                          {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Live Search */}
                <div ref={searchRef} style={{ position: 'relative' }}>
                  <form className="d-flex position-relative" role="search" onSubmit={handleSearch}>
                    <i
                      className="fa-solid fa-search position-absolute"
                      style={{ top: '50%', left: 13, transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: '.8rem', pointerEvents: 'none' }}
                    />
                    <input
                      className="form-control form-control-sm rounded-pill search-input border-0 ps-5 pe-3"
                      type="search"
                      placeholder="Search topics..."
                      value={searchInput}
                      onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      autoComplete="off"
                    />
                  </form>
                  {/* Suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="search-suggestions">
                      {filteredSuggestions.map((s) => (
                        <div key={s} className="suggestion-item" onClick={() => pickSuggestion(s)}>
                          <i className="fa-solid fa-magnifying-glass"></i>
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Newsletter CTA */}
                <button
                  className="btn btn-sm btn-danger rounded-pill px-3 fw-bold d-none d-md-block"
                  style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}
                  onClick={() => setShowNewsletter(true)}
                >
                  <i className="fa-solid fa-envelope me-1"></i>
                  Subscribe
                </button>

                {/* GitHub */}
                <a
                  href="https://github.com/farmanullah1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                  title="farmanullah1 on GitHub"
                  aria-label="GitHub"
                >
                  <GitHubIcon size={20} />
                </a>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="theme-toggle"
                  title="Toggle dark/light mode"
                  aria-label="Toggle theme"
                >
                  {theme === 'light'
                    ? <i className="fa-solid fa-moon" style={{ fontSize: '.9rem' }}></i>
                    : <i className="fa-solid fa-sun" style={{ fontSize: '.9rem', color: '#fbbf24' }}></i>
                  }
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Newsletter Modal */}
      <NewsletterModal show={showNewsletter} onClose={() => setShowNewsletter(false)} />
    </>
  );
};

export default Navbar;