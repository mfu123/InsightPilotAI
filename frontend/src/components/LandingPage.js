import React from 'react';
import './LandingPage.css';

function LandingPage({ setCurrentPage }) {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-Powered Auto-EDA Platform
            </div>

            <h1 className="hero-title">
              UPLOAD DATA, GET {' '}
              <span className="hero-title-accent">INSIGHTS</span>
            </h1>

            <p className="hero-description">
              Upload any CSV and let InsightPilot AI automatically clean, analyze,
              visualize, and generate executive-ready reports — with an
              interactive AI assistant to explain everything.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary btn-lg"
                onClick={() => setCurrentPage('upload')}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload CSV
              </button>
              <button
                className="btn-outline btn-lg"
                onClick={() => setCurrentPage('upload')}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Demo
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="mockup-title">InsightPilot Dashboard</span>
              </div>
              <div className="mockup-kpis">
                <div className="mockup-kpi">
                  <div className="kpi-icon">📊</div>
                  <div className="kpi-value">12,847</div>
                  <div className="kpi-label">Rows</div>
                </div>
                <div className="mockup-kpi">
                  <div className="kpi-icon">📈</div>
                  <div className="kpi-value">24</div>
                  <div className="kpi-label">Trends</div>
                </div>
                <div className="mockup-kpi">
                  <div className="kpi-icon">💡</div>
                  <div className="kpi-value">8</div>
                  <div className="kpi-label">Insights</div>
                </div>
              </div>
              <div className="mockup-charts">
                <div className="mockup-chart">
                  <div className="chart-label">Revenue Trend</div>
                  <div className="chart-bars">
                    {[40, 55, 35, 65, 50, 72, 60, 80].map((h, i) => (
                    <div key={i} className="chart-bar" style={{ height: `${h * 0.5}px` }}></div>
                    ))}
                  </div>
                </div>
                <div className="mockup-chart">
                  <div className="chart-label">Distribution</div>
                  <div className="chart-pie"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything You Need for Data Analysis
            </h2>
            <p className="features-subtitle">
              From raw data to actionable insights, InsightPilot AI handles every
              step of the exploratory data analysis pipeline.
            </p>
          </div>

          <div className="features-grid">
            {[
              { icon: '✨', title: 'Automated Data Cleaning', desc: 'Instantly detect and handle missing values, duplicates, and inconsistencies in your data.' },
              { icon: '📊', title: 'Smart Visualizations', desc: 'Automatically generate the most appropriate charts and graphs based on your data types.' },
              { icon: '⚠️', title: 'Outlier Detection', desc: 'Identify anomalies and outliers using statistical methods to uncover hidden data issues.' },
              { icon: '📈', title: 'Trend Analysis', desc: 'Discover patterns, seasonality, and trends across time-series and categorical data.' },
              { icon: '🧠', title: 'AI Business Insights', desc: 'Generate executive-ready summaries with key findings, risks, and actionable recommendations.' },
              { icon: '💬', title: 'Interactive AI Data Agent', desc: 'Ask natural language questions about your dataset and get precise, analytical responses.' },
            ].map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
