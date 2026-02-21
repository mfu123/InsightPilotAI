import React from 'react';
import './Navbar.css';
import logo from '../Logo1.png';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => setCurrentPage('landing')}>
          <img src={logo} alt="InsightPilot AI" className="navbar-logo" />
          <span className="navbar-title">
            InsightPilot
            <span className="navbar-subtitle">AI</span>
          </span>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentPage('landing')}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentPage('upload')}
          >
            Upload
          </button>
          {currentPage === 'dashboard' && (
            <button
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
          )}
        </nav>

        <div className="navbar-actions">
          <button
            className="btn-primary"
            onClick={() => setCurrentPage('upload')}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
