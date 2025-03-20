/**
 * Game service for managing game state and interactions
 */
import apiService from './apiService';

/**
 * Initialize a new game session
 * @param {String} playerName - Player's name
 * @returns {Promise} - Session data
 */
async function initializeGame(playerName) {
  try {
    const response = await apiService.createGameSession(playerName);
    
    // Validate the response to ensure it has required properties
    if (!response || !response.sessionId) {
      throw new Error('Invalid response from game server');
    }
    
    // Store session ID in localStorage for persistence
    localStorage.setItem('dndGameSessionId', response.sessionId);
    
    return response;
  } catch (error) {
    console.error('Failed to initialize game:', error);
    throw error;
  }
}

/**
 * Get the current session ID from localStorage
 * @returns {String|null} - Session ID if exists
 */
function getCurrentSessionId() {
  return localStorage.getItem('dndGameSessionId');
}

/**
 * Process player input and get AI response
 * @param {String} sessionId - Game session ID
 * @param {String} playerInput - Player's text input
 * @returns {Promise} - Game response
 */
async function processPlayerInput(sessionId, playerInput) {
  try {
    return await apiService.sendPlayerAction(sessionId, playerInput);
  } catch (error) {
    console.error('Failed to process player input:', error);
    throw error;
  }
}

/**
 * Save the current game state
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Save result
 */
async function saveGame(sessionId) {
  try {
    return await apiService.saveGameState(sessionId);
  } catch (error) {
    console.error('Failed to save game:', error);
    throw error;
  }
}

/**
 * Start the character creation process
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Character creation guidance
 */
async function createCharacter(sessionId) {
  try {
    return await apiService.startCharacterCreation(sessionId);
  } catch (error) {
    console.error('Failed to start character creation:', error);
    throw error;
  }
}

/**
 * Update character information
 * @param {String} sessionId - Game session ID
 * @param {Object} characterData - Updated character data
 * @returns {Promise} - Updated character
 */
async function updateCharacter(sessionId, characterData) {
  try {
    return await apiService.updateCharacter(sessionId, characterData);
  } catch (error) {
    console.error('Failed to update character:', error);
    throw error;
  }
}

/**
 * Load the game state
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Current game state
 */
async function loadGameState(sessionId) {
  try {
    return await apiService.getGameState(sessionId);
  } catch (error) {
    console.error('Failed to load game state:', error);
    throw error;
  }
}

/**
 * Initialize combat encounter
 * @param {String} sessionId - Game session ID
 * @param {Array} enemies - Enemy information
 * @returns {Promise} - Combat response
 */
async function startCombat(sessionId, enemies) {
  try {
    return await apiService.initiateCombat(sessionId, enemies);
  } catch (error) {
    console.error('Failed to start combat:', error);
    throw error;
  }
}

/**
 * End the current game session
 */
function endGame() {
  localStorage.removeItem('dndGameSessionId');
}

export default {
  initializeGame,
  getCurrentSessionId,
  processPlayerInput,
  saveGame,
  loadGameState,
  createCharacter,
  updateCharacter,
  startCombat,
  endGame
};