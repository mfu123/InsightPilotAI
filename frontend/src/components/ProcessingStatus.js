import React from 'react';
import './ProcessingStatus.css';

function ProcessingStatus({ fileName, progress, stages }) {
  return (
    <div className="processing-view">
      <div className="processing-card">
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Processing {fileName}</span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="stages-list">
          {stages.map((stage) => (
            <div key={stage.label} className="stage-item">
              {stage.status === 'done' && (
                <svg className="stage-icon done" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {stage.status === 'active' && (
                <svg className="stage-icon active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {stage.status === 'pending' && (
                <div className="stage-icon pending"></div>
              )}
              <span className={`stage-label ${stage.status === 'active' ? 'active' : stage.status === 'done' ? 'done' : ''}`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProcessingStatus;
