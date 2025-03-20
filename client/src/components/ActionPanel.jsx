import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import Button from './ui/Button';
import Card from './ui/Card';
import './ActionPanel.css';

/**
 * Action panel component for player inputs
 * @returns {JSX.Element} Action panel component
 */
const ActionPanel = () => {
  const { sendPlayerAction, isLoading, saveGame, createCharacter } = useGame();
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Common action suggestions
  const actionSuggestions = [
    'Look around', 
    'Check inventory',
    'Talk to innkeeper',
    'Inspect the chest',
    'Cast detect magic'
  ];

  // Handle sending player action
  const handleSendAction = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() || isLoading) return;
    
    try {
      await sendPlayerAction(inputText);
      setInputText('');
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to send action:', error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (isLoading) return;
    sendPlayerAction(suggestion);
    setShowSuggestions(false);
  };

  // Handle save game
  const handleSaveGame = async () => {
    if (isLoading) return;
    try {
      await saveGame();
      // Show save confirmation
      alert('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  // Handle character creation
  const handleCreateCharacter = async () => {
    if (isLoading) return;
    try {
      await createCharacter();
    } catch (error) {
      console.error('Failed to start character creation:', error);
    }
  };

  return (
    <Card className="action-panel">
      <div className="action-container">
        {showSuggestions && (
          <div className="suggestions">
            <p className="suggestions-title">Suggested actions:</p>
            <div className="suggestions-list">
              {actionSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendAction} className="action-form">
          <input
            type="text"
            className="action-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="What would you like to do?"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading}
          >
            Send
          </Button>
        </form>
        
        <div className="action-buttons">
          <Button
            variant="secondary"
            onClick={handleCreateCharacter}
            disabled={isLoading}
          >
            Create Character
          </Button>
          <Button
            variant="secondary"
            onClick={handleSaveGame}
            disabled={isLoading}
          >
            Save Game
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ActionPanel;