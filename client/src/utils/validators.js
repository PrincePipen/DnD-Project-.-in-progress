/**
 * Utility functions for validating form inputs and game data
 */

/**
 * Validate that a string is not empty
 * @param {String} value - String to check
 * @returns {Boolean} Whether the string is valid
 */
export function isNotEmpty(value) {
  return !!value?.trim();
}

/**
 * Validate a name field
 * @param {String} name - Name to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateName(name) {
  if (!isNotEmpty(name)) {
    return {
      isValid: false,
      message: 'Name is required'
    };
  }
  
  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validate an ability score
 * @param {Number|String} score - Score to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateAbilityScore(score) {
  const numScore = parseInt(score, 10);
  
  if (isNaN(numScore)) {
    return {
      isValid: false,
      message: 'Score must be a number'
    };
  }
  
  if (numScore < 3 || numScore > 20) {
    return {
      isValid: false,
      message: 'Score must be between 3 and 20'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validate a level value
 * @param {Number|String} level - Level to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateLevel(level) {
  const numLevel = parseInt(level, 10);
  
  if (isNaN(numLevel)) {
    return {
      isValid: false,
      message: 'Level must be a number'
    };
  }
  
  if (numLevel < 1 || numLevel > 20) {
    return {
      isValid: false,
      message: 'Level must be between 1 and 20'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Validate a character object has required fields
 * @param {Object} character - Character object to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateCharacter(character) {
  if (!character) {
    return {
      isValid: false,
      message: 'Character data is required'
    };
  }
  
  if (!isNotEmpty(character.name)) {
    return {
      isValid: false,
      message: 'Character name is required'
    };
  }
  
  if (!isNotEmpty(character.race)) {
    return {
      isValid: false,
      message: 'Character race is required'
    };
  }
  
  if (!isNotEmpty(character.class)) {
    return {
      isValid: false,
      message: 'Character class is required'
    };
  }
  
  // Validate all ability scores
  const stats = character.stats || {};
  const statKeys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  
  for (const key of statKeys) {
    if (!stats[key] || stats[key] < 3 || stats[key] > 20) {
      return {
        isValid: false,
        message: `Invalid ${key} score`
      };
    }
  }
  
  return {
    isValid: true,
    message: ''
  };
}