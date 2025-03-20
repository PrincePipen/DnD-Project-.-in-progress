import React, { createContext, useContext } from 'react';
import useGameState from '../hooks/useGameState';

// Create context
const GameContext = createContext(null);

/**
 * Game context provider component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const GameProvider = ({ children }) => {
  const gameState = useGameState();
  
  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Custom hook to use the game context
 * @returns {Object} Game context
 */
export const useGame = () => {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
};

export default GameContext;