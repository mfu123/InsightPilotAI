import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

function Chatbot({ sessionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to InsightPilot AI Data Agent. I have analyzed your dataset and am ready to answer questions. Ask me about trends, outliers, statistics, or request an executive summary.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.answer }]);
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversation cleared. I still have your dataset context loaded. How can I help?',
      },
    ]);
  };

  const formatMessage = (content) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="message-bold">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*(.*)/);
        if (match) {
          return (
            <p key={i} className="message-bullet">
              <span className="bullet-bold">{match[1]}</span>
              {match[2]}
            </p>
          );
        }
      }
      if (line.startsWith('- ')) {
        return (
          <p key={i} className="message-bullet">
            <span className="bullet-dot">•</span>
            {line.slice(2)}
          </p>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <p key={i} className="message-numbered">
            {line}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return (
        <p key={i} className="message-text">
          {line}
        </p>
      );
    });
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-button"
          aria-label="Open AI Data Agent"
        >
          <svg className="chatbot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="chatbot-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <div className="chatbot-header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="chatbot-header-title">AI Data Agent</h2>
                <p className="chatbot-header-subtitle">Dataset context loaded</p>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-action-btn"
                onClick={clearConversation}
                aria-label="Clear conversation"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                className="chatbot-action-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chatbot-messages" ref={scrollRef}>
            <div className="messages-container">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}
                >
                  <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                    {msg.role === 'assistant'
                      ? formatMessage(msg.content)
                      : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <div className="message-bubble assistant">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
                placeholder="Ask about your data..."
                className="chatbot-input"
                disabled={loading}
              />
              <button
                className="chatbot-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                {loading ? (
                  <svg className="spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <div className="chatbot-suggestions">
              {[
                { label: 'Main trends', query: 'What are the main trends?' },
                { label: 'Executive summary', query: 'Give me executive summary' },
                { label: 'Outliers', query: 'Why are these outliers flagged?' },
              ].map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => {
                    if (loading) return;
                    setInput(suggestion.query);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="suggestion-btn"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
