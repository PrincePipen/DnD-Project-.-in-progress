import { useState, useEffect, useCallback } from 'react';
import gameService from '../services/gameService';

/**
 * Custom hook for managing game state
 * @returns {Object} Game state and functions to interact with it
 */
const useGameState = () => {
  const [sessionId, setSessionId] = useState(null);
  const [character, setCharacter] = useState(null);
  const [gameProgress, setGameProgress] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize on mount - check for existing session
  useEffect(() => {
    const storedSessionId = gameService.getCurrentSessionId();
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadGameState(storedSessionId);
    }
  }, []);

  // Load game state from API
  const loadGameState = useCallback(async (id) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const { gameState } = await gameService.loadGameState(id);
      setCharacter(gameState.character);
      setGameProgress(gameState.gameProgress);
      setMessages(gameState.conversationHistory || []);
    } catch (err) {
      setError('Failed to load game state: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a new game
  const startNewGame = useCallback(async (playerName) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add a timeout to detect server unavailability faster
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout - server not responding')), 15000)
      );
      
      const gamePromise = gameService.initializeGame(playerName);
      
      // Race between actual request and timeout
      const response = await Promise.race([
        gamePromise,
        timeoutPromise
      ]);
      
      // Check if response is valid before accessing properties
      if (!response || !response.sessionId) {
        throw new Error('Invalid response from server: missing session ID');
      }
      
      setSessionId(response.sessionId);
      
      // Safely access the message property
      const welcomeMessage = response.message || 'Welcome to your adventure!';
      setMessages([{ role: 'dm', message: welcomeMessage, timestamp: new Date().toISOString() }]);
      
      return response.sessionId;
    } catch (err) {
      console.error('Game initialization error:', err);
      setError(err.message === 'Connection timeout - server not responding' 
        ? 'Failed to connect to the server. Please ensure the backend is running (npm run server in a separate terminal).'
        : 'Failed to start game: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send player action
  const sendPlayerAction = useCallback(async (action) => {
    if (!sessionId) {
      setError('No active game session');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Add player message to UI immediately
      const playerMessage = {
        role: 'player',
        message: action,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, playerMessage]);
      
      // Send to API
      const response = await gameService.processPlayerInput(sessionId, action);
      
      // Update state with response
      setCharacter(response.character);
      setGameProgress(response.gameProgress);
      
      // Add DM response to messages
      const dmMessage = {
        role: 'dm',
        message: response.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, dmMessage]);
      
      return response;
    } catch (err) {
      setError('Failed to process action: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Create character
  const createCharacter = useCallback(async () => {
    if (!sessionId) {
      setError('No active game session');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await gameService.createCharacter(sessionId);
      
      // Add message to conversation
      const dmMessage = {
        role: 'dm',
        message: response.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, dmMessage]);
      
      return response;
    } catch (err) {
      setError('Failed to start character creation: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Update character
  const updateCharacterData = useCallback(async (characterData) => {
    if (!sessionId) {
      setError('No active game session');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await gameService.updateCharacter(sessionId, characterData);
      setCharacter(response.character);
      return response.character;
    } catch (err) {
      setError('Failed to update character: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Save game
  const saveGame = useCallback(async () => {
    if (!sessionId) {
      setError('No active game session');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await gameService.saveGame(sessionId);
    } catch (err) {
      setError('Failed to save game: ' + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // End game
  const endGame = useCallback(() => {
    gameService.endGame();
    setSessionId(null);
    setCharacter(null);
    setGameProgress(null);
    setMessages([]);
  }, []);

  return {
    sessionId,
    character,
    gameProgress,
    messages,
    isLoading,
    error,
    startNewGame,
    sendPlayerAction,
    createCharacter,
    updateCharacterData,
    saveGame,
    loadGameState,
    endGame
  };
};

export default useGameState;