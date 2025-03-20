import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Card from './ui/Card';
import './GameConsole.css';

/**
 * Game console component displaying conversation history
 * @returns {JSX.Element} Game console component
 */
const GameConsole = () => {
  const { messages, isLoading } = useGame();
  const consoleEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="game-console" title="Adventure Log">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-console">
            <p>Your adventure hasn't begun yet. Start a new game or enter a command.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message message-${msg.role}`}
            >
              <div className="message-header">
                <span className="message-author">
                  {msg.role === 'dm' ? 'Dungeon Master' : 'You'}
                </span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">
                {msg.message}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message message-loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={consoleEndRef} />
      </div>
    </Card>
  );
};

export default GameConsole;