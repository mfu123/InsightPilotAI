import React, { useState } from 'react';
import './DashboardPage.css';
import ResultsPanel from './ResultsPanel';
import Chatbot from './Chatbot';

function DashboardPage({ results, sessionId }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleViewDashboard = () => {
    if (results.dashboard) {
      window.open(results.dashboard, '_blank');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">InsightPilot AI</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {!sidebarCollapsed && (
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Dataset Info</h3>
              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <span className="stat-label">Rows</span>
                  <span className="stat-value">{results.metadata.rows.toLocaleString()}</span>
                </div>
                <div className="sidebar-stat">
                  <span className="stat-label">Columns</span>
                  <span className="stat-value">{results.metadata.columns}</span>
                </div>
                <div className="sidebar-stat">
                  <span className="stat-label">Outliers</span>
                  <span className="stat-value">{results.metadata.outliers}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <p className="dashboard-subtitle">Dataset analysis complete</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn-outline btn-sm" onClick={handleViewDashboard}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <ResultsPanel results={results} />
          
          {results.dashboard && (
            <div className="dashboard-iframe-container">
              <iframe
                src={results.dashboard}
                title="Dashboard"
                className="dashboard-iframe"
              />
            </div>
          )}
        </main>
      </div>

      {sessionId && (
        <Chatbot sessionId={sessionId} />
      )}
    </div>
  );
}

export default DashboardPage;
