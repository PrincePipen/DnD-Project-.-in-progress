/**
 * API service for making requests to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Check if server is running
 * @returns {Promise<boolean>} Whether server is available
 */
async function checkServerAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/api$/, '')}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout for quick feedback
      signal: AbortSignal.timeout(3000)
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Server availability check failed:', error);
    return false;
  }
}

/**
 * Generic request helper with error handling
 * @param {String} url - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - The API response
 */
async function makeRequest(url, options = {}) {
  try {
    // Check server availability first
    const isAvailable = await checkServerAvailability();
    if (!isAvailable) {
      throw new Error('Server is not responding. Please ensure the backend is running.');
    }
    
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    // Handle non-JSON responses (like proxy errors)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If server is down or unreachable, we'll get a proxy error
      if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
        throw new Error('Server is not responding. Please ensure the backend is running.');
      }
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
    }
    
    // Parse JSON response
    const data = await response.json();
    
    // Handle API errors
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred with the API request');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Provide more user-friendly error messages for common issues
    if (error.message.includes('fetch') || error.name === 'AbortError') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    
    throw error;
  }
}

/**
 * Create a new game session
 * @param {String} playerName - Player's name
 * @returns {Promise} - New session data
 */
async function createGameSession(playerName) {
  return makeRequest('/game/session', {
    method: 'POST',
    body: JSON.stringify({ playerName }),
  });
}

/**
 * Send a player action to the game
 * @param {String} sessionId - Game session ID
 * @param {String} playerAction - Player's action text
 * @returns {Promise} - Game response
 */
async function sendPlayerAction(sessionId, playerAction) {
  return makeRequest('/game/action', {
    method: 'POST',
    body: JSON.stringify({ sessionId, playerAction }),
  });
}

/**
 * Get current game state
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Current game state
 */
async function getGameState(sessionId) {
  return makeRequest(`/game/state/${sessionId}`);
}

/**
 * Save current game state
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Save result
 */
async function saveGameState(sessionId) {
  return makeRequest(`/game/save/${sessionId}`, {
    method: 'POST',
  });
}

/**
 * Start character creation process
 * @param {String} sessionId - Game session ID
 * @returns {Promise} - Character creation guidance
 */
async function startCharacterCreation(sessionId) {
  return makeRequest(`/game/character/create/${sessionId}`, {
    method: 'POST',
  });
}

/**
 * Update character information
 * @param {String} sessionId - Game session ID
 * @param {Object} characterData - Updated character data
 * @returns {Promise} - Updated character
 */
async function updateCharacter(sessionId, characterData) {
  return makeRequest(`/game/character/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(characterData),
  });
}

/**
 * Initiate a combat encounter
 * @param {String} sessionId - Game session ID
 * @param {Object} enemies - Enemy information
 * @returns {Promise} - Combat response
 */
async function initiateCombat(sessionId, enemies) {
  return makeRequest('/game/combat', {
    method: 'POST',
    body: JSON.stringify({ sessionId, enemies }),
  });
}

export default {
  createGameSession,
  sendPlayerAction,
  getGameState,
  saveGameState,
  startCharacterCreation,
  updateCharacter,
  initiateCombat
};