import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// 1. DYNAMIC COUNTRY ARRAY (50+ Countries supported by the APIs)
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
  { code: 've', name: 'Venezuela' },
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

const Navbar = ({ setCountry, setSearchQuery, currentCountry }) => {
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(new Date());
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    document.documentElement.setAttribute('data-bs-theme', theme);
    return () => clearInterval(timerId);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  // 2. Helper to display the full name of the currently selected country on the button
  const currentCountryName = countriesList.find(c => c.code === currentCountry)?.name || currentCountry.toUpperCase();

  return (
    <div className="fixed-top">
      <div className="ticker-bar d-flex align-items-center px-3">
        <span className="badge bg-dark me-3 rounded-pill"><span className="live-pulse"></span>LIVE</span>
        <div className="ticker-text fw-medium">
          BREAKING: Global markets hit record highs | Tech giants announce revolutionary AI models | Major sports upsets in last night's finals!
        </div>
      </div>

      <nav className="navbar navbar-expand-lg glass-navbar">
        <div className="container-fluid px-4">
          
          <NavLink className="navbar-brand d-flex align-items-center fs-4" to="/">
            <img src="/Logo.png" alt="Logo" width="45" height="45" className="brand-logo rounded-circle me-2 shadow-sm" onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=KN&background=f11946&color=fff"} />
            <span className="fw-bolder" style={{ color: theme === 'light' ? '#f11946' : '#ff4d6d' }}>Kurrent</span>
            <span className="fw-bold">News</span>
          </NavLink>

          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/">Top Stories</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/business">Business</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/technology">Tech</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/sports">Sports</NavLink></li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle px-3 rounded-pill" role="button" data-bs-toggle="dropdown">Explore</span>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2">
                  <li><NavLink className="dropdown-item py-2 fw-medium" to="/entertainment"><i className="fa-solid fa-film me-2 text-danger"></i> Entertainment</NavLink></li>
                  <li><NavLink className="dropdown-item py-2 fw-medium" to="/health"><i className="fa-solid fa-heart-pulse me-2 text-danger"></i> Health</NavLink></li>
                  <li><NavLink className="dropdown-item py-2 fw-medium" to="/science"><i className="fa-solid fa-flask me-2 text-danger"></i> Science</NavLink></li>
                </ul>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-xl-block text-end lh-sm border-end pe-3 border-secondary border-opacity-25">
                <div className="fw-bold text-danger">{time.toLocaleTimeString()}</div>
                <div className="text-muted" style={{fontSize: '0.75rem'}}>{formattedDate}</div>
              </div>

              {/* 3. DYNAMIC SCROLLABLE COUNTRY SWITCHER */}
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary rounded-pill fw-bold dropdown-toggle px-3" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-globe me-1"></i> {currentCountryName}
                </button>
                {/* Added maxHeight and overflowY so the 40+ countries don't break the screen */}
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{ minWidth: '150px', maxHeight: '350px', overflowY: 'auto' }}>
                  {countriesList.map((c) => (
                    <li key={c.code}>
                      <button 
                        className={`dropdown-item fw-bold ${currentCountry === c.code ? 'text-danger bg-light' : ''}`} 
                        onClick={() => setCountry(c.code)}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <form className="d-flex position-relative" role="search" onSubmit={handleSearch}>
                <i className="fa-solid fa-search position-absolute text-muted" style={{ top: '10px', left: '12px' }}></i>
                <input 
                  className="form-control form-control-sm rounded-pill search-input bg-secondary bg-opacity-10 border-0 ps-5" 
                  type="search" 
                  placeholder="Search topics..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>

              <button className="btn btn-sm btn-danger rounded-pill px-3 fw-bold shadow-sm d-none d-md-block">Subscribe</button>

              <button onClick={toggleTheme} className="btn border-0 fs-5 p-0 hover-lift text-warning" title="Toggle Theme">
                {theme === 'light' ? <i className="fa-solid fa-moon text-dark"></i> : <i className="fa-solid fa-sun text-warning"></i>}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;