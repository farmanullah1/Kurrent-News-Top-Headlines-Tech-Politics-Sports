import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const [time, setTime] = useState(new Date());

  // Clock & Theme Engine
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    document.documentElement.setAttribute('data-bs-theme', theme);
    return () => clearInterval(timerId);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <nav className="navbar fixed-top navbar-expand-lg glass-navbar">
      <div className="container-fluid px-4">
        
        {/* LOGO (Fixed Path) & BRANDING */}
        <NavLink className="navbar-brand d-flex align-items-center fs-4" to="/">
          <img 
            src="/Logo.png" 
            alt="Logo" 
            width="45" height="45" 
            className="brand-logo rounded-circle me-2"
            onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=KN&background=f11946&color=fff"} 
          />
          <span className="fw-bolder" style={{ color: theme === 'light' ? '#f11946' : '#ff4d6d' }}>Kurrent</span>
          <span className="fw-semibold">News</span>
        </NavLink>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          
          {/* CATEGORIES */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/business">Business</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/technology">Tech</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link px-3 rounded-pill" to="/sports">Sports</NavLink></li>
            
            {/* MEGA DROPDOWN */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle px-3 rounded-pill" role="button" data-bs-toggle="dropdown">Explore</span>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2">
                <li><NavLink className="dropdown-item py-2" to="/entertainment">🎬 Entertainment</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/health">🏥 Health</NavLink></li>
                <li><NavLink className="dropdown-item py-2" to="/science">🔬 Science</NavLink></li>
              </ul>
            </li>
          </ul>

          {/* UTILITIES & TOOLS */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Live Clock */}
            <div className="d-none d-xl-block text-end lh-sm">
              <div className="fw-bold text-danger">{time.toLocaleTimeString()}</div>
              <div className="text-muted" style={{fontSize: '0.75rem'}}>{formattedDate}</div>
            </div>

            {/* Language Switcher */}
            <div className="dropdown">
              <button className="btn btn-sm btn-light rounded-pill fw-bold dropdown-toggle" data-bs-toggle="dropdown">
                EN
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm min-w-0" style={{minWidth: '80px'}}>
                <li><button className="dropdown-item fw-bold">EN</button></li>
                <li><button className="dropdown-item fw-bold">UR</button></li>
              </ul>
            </div>

            {/* Search */}
            <form className="d-flex" role="search">
              <input className="form-control form-control-sm rounded-pill px-3 bg-secondary bg-opacity-10 border-0" type="search" placeholder="Search..." />
            </form>

            {/* Dark Mode */}
            <button onClick={toggleTheme} className="btn border-0 fs-5 p-0 hover-lift" title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Notifications */}
            <div className="position-relative cursor-pointer">
              <span className="fs-5">🔔</span>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">3</span>
            </div>

            {/* Avatar */}
            <img src="https://ui-avatars.com/api/?name=User&background=f11946&color=fff&bold=true" alt="Profile" className="rounded-circle border border-2 border-danger shadow-sm" width="38" height="38" style={{ cursor: 'pointer' }} />
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar;