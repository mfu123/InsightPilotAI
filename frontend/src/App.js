import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import DashboardPage from './components/DashboardPage';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [results, setResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleUploadComplete = (data) => {
    setResults(data);
    setSessionId(data.session_id);
    setCurrentPage('dashboard');
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'landing' && <LandingPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'upload' && <UploadPage onUploadComplete={handleUploadComplete} />}
      {currentPage === 'dashboard' && results && (
        <DashboardPage results={results} sessionId={sessionId} />
      )}
      
      {currentPage !== 'dashboard' && <Footer />}
    </div>
  );
}

export default App;
