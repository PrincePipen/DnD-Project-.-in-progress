import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import GameConsole from './components/GameConsole';
import CharacterSheet from './components/CharacterSheet';
import ActionPanel from './components/ActionPanel';
import LoadingSpinner from './components/LoadingSpinner';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import { useGame } from './context/GameContext';
import './App.css';

// Game start modal component
const StartGameModal = ({ isOpen, onClose, onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onStartGame(playerName);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Begin Your Adventure"
      closeOnOutsideClick={false}
      closeOnEscape={false}
    >
      <form onSubmit={handleSubmit}>
        <p>Welcome, adventurer! Tell us your name to begin your journey.</p>
        
        <div className="form-group">
          <label htmlFor="playerName">Your Name</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your character's name"
            required
          />
        </div>
        
        <div className="form-actions">
          <Button type="submit" disabled={!playerName.trim()}>
            Begin Adventure
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Game interface component
const GameInterface = () => {
  const { startNewGame, isLoading, error, sessionId, endGame } = useGame();
  const [showStartModal, setShowStartModal] = useState(!sessionId);
  
  const handleStartGame = async (playerName) => {
    await startNewGame(playerName);
    setShowStartModal(false);
  };
  
  const handleNewGame = () => {
    if (window.confirm("Starting a new game will end your current adventure. Are you sure?")) {
      endGame();
      setShowStartModal(true);
    }
  };
  
  return (
    <>
      {/* Start Game Modal */}
      <StartGameModal
        isOpen={showStartModal}
        onClose={() => {}} // No close option - must start game
        onStartGame={handleStartGame}
      />
      
      {/* Game UI */}
      <div className="game-container">
        <div className="game-header">
          <h1>AI Dungeon Master</h1>
          <div className="game-controls">
            <Button variant="secondary" onClick={handleNewGame}>
              New Game
            </Button>
          </div>
        </div>
        
        {error && (
          <Card className="error-card">
            <p className="error-message">{error}</p>
          </Card>
        )}
        
        <div className="game-content">
          <div className="game-main">
            <GameConsole />
            <ActionPanel />
          </div>
          <div className="game-sidebar">
            <CharacterSheet />
          </div>
        </div>
      </div>
      
      {/* Global loading overlay */}
      {isLoading && <LoadingSpinner overlay text="Processing..." />}
    </>
  );
};

// Main App component
function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <GameInterface />
      </div>
    </GameProvider>
  );
}

export default App;