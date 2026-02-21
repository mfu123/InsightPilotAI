import React, { useState, useCallback, useRef } from 'react';
import './UploadPage.css';
import ProcessingStatus from './ProcessingStatus';

function UploadPage({ onUploadComplete }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stages, setStages] = useState([
    { label: 'Cleaning Data', status: 'pending' },
    { label: 'Detecting Patterns', status: 'pending' },
    { label: 'Generating Visualizations', status: 'pending' },
    { label: 'Writing Insights', status: 'pending' },
    { label: 'Preparing Report', status: 'pending' },
  ]);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.slice(0, 11).map(line => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile.name.endsWith('.csv')) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setCsvPreview(parseCSV(text));
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = () => {
    setFile(null);
    setCsvPreview([]);
    setIsProcessing(false);
    setProgress(0);
    setStages(prev => prev.map(s => ({ ...s, status: 'pending' })));
  };

  const startProcessing = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setStages(prev => prev.map(s => ({ ...s, status: 'pending' })));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await response.json();
      const taskId = uploadData.task_id;

      if (!taskId) {
        throw new Error('No task ID received from server');
      }

      // Poll for progress
      const pollProgress = async () => {
        try {
          const progressResponse = await fetch(`/api/progress/${taskId}`);
          if (!progressResponse.ok) {
            throw new Error('Failed to get progress');
          }

          const progressData = await progressResponse.json();

          // Update progress
          const currentProgress = progressData.progress || 0;
          setProgress(currentProgress);

          // Update stages based on current stage index
          const currentStageIndex = progressData.stage !== undefined ? progressData.stage : -1;
          
          // Handle stage -1 (initializing) - show first stage as active
          if (currentStageIndex === -1) {
            setStages(prev =>
              prev.map((s, i) => ({
                ...s,
                status: i === 0 ? 'active' : 'pending'
              }))
            );
          } else {
            setStages(prev =>
              prev.map((s, i) => {
                if (i < currentStageIndex) {
                  return { ...s, status: 'done' };
                } else if (i === currentStageIndex) {
                  return { ...s, status: 'active' };
                } else {
                  return { ...s, status: 'pending' };
                }
              })
            );
          }

          // Check if complete
          if (progressData.status === 'complete') {
            setStages(prev => prev.map(s => ({ ...s, status: 'done' })));
            setProgress(100);
            setTimeout(() => {
              onUploadComplete(progressData.result);
            }, 600);
          } else if (progressData.status === 'error') {
            throw new Error(progressData.error || progressData.message || 'Processing failed');
          } else {
            // Continue polling
            setTimeout(pollProgress, 500); // Poll every 500ms
          }
        } catch (err) {
          alert('Progress check failed: ' + err.message);
          setIsProcessing(false);
        }
      };

      // Start polling
      setTimeout(pollProgress, 500);
    } catch (err) {
      alert('Upload failed: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <main className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="upload-title">Upload Your Dataset</h1>
          <p className="upload-subtitle">
            Drop your CSV file below and let InsightPilot AI handle the rest.
          </p>
        </div>

        {!file && (
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon-wrapper">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="upload-text">Drag & drop your CSV file here</p>
            <p className="upload-hint">or click to browse from your computer</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {file && !isProcessing && (
          <div className="file-preview-section">
            <div className="file-card">
              <div className="file-info">
                <div className="file-icon-wrapper">
                  <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button className="file-remove" onClick={removeFile} aria-label="Remove file">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {csvPreview.length > 1 && (
              <div className="csv-preview">
                <div className="preview-header">
                  <p className="preview-title">Data Preview</p>
                  <p className="preview-subtitle">Showing first {csvPreview.length - 1} rows</p>
                </div>
                <div className="preview-table-wrapper">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        {csvPreview[0]?.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="upload-actions">
              <button className="btn-primary btn-lg" onClick={startProcessing}>
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Analyze Dataset
              </button>
            </div>
          </div>
        )}

        {isProcessing && (
          <ProcessingStatus
            fileName={file?.name}
            progress={progress}
            stages={stages}
          />
        )}
      </div>
    </main>
  );
}

export default UploadPage;
