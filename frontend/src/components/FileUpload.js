import React, { useRef, useState } from 'react';
import './FileUpload.css';

function FileUpload({ onFileUpload, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      onFileUpload(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-icon">
          <div className="cloud-icon">☁️</div>
          <div className="play-overlay">▶</div>
        </div>
        <p className="upload-text">Upload CSV File</p>
        <button 
          className="browse-btn"
          type="button"
          disabled={disabled}
        >
          Browse Files
        </button>
        <p className="upload-hint">
          Drag & drop your CSV file here or click<br />
          <span>size: 100MB</span>
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
}

export default FileUpload;
