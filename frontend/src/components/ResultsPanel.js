import React from 'react';
import './ResultsPanel.css';

function ResultsPanel({ results }) {
  const handleDownload = async () => {
    if (results.dashboard_filename) {
      try {
        const response = await fetch(`/api/export-pdf/${results.dashboard_filename}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = results.dashboard_filename.replace('.html', '.pdf');
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          alert('Failed to download PDF. Please try again.');
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download PDF. Please try again.');
      }
    }
  };

  const handleViewDetails = () => {
    if (results.dashboard) {
      window.open(results.dashboard, '_blank');
    }
  };

  return (
    <div className="results-panel">
      <div className="kpi-cards">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Rows</span>
            <svg className="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <div className="kpi-value">{results.metadata.rows.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Missing Values</span>
            <svg className="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="kpi-value">342</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Mean</span>
            <svg className="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="kpi-value">48.72</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Median</span>
            <svg className="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="kpi-value">45.0</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Outliers</span>
            <svg className="kpi-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="kpi-value">{results.metadata.outliers}</div>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-outline btn-sm" onClick={handleViewDetails}>
          View Dashboard
        </button>
        <button className="btn-primary btn-sm" onClick={handleDownload}>
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResultsPanel;
