import React from 'react';
import './Footer.css';
import logo from '../logo.jpeg';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <img src={logo} alt="InsightPilot AI" className="footer-logo" />
          </div>
          <span className="footer-title">
            InsightPilot
            <span className="footer-subtitle">AI</span>
          </span>
          <p className="footer-description">
            AI-Powered Auto-EDA & Business Insights Platform. Turn raw data
            into actionable intelligence.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3 className="footer-column-title">Product</h3>
            <ul className="footer-list">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#upload">Upload CSV</a></li>
              <li><a href="#dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Resources</h3>
            <ul className="footer-list">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="footer-list">
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © Team Penguin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
