/**
 * Utility functions for formatting various data types
 */

/**
 * Format a timestamp into a human-readable date and time
 * @param {String} timestamp - ISO timestamp
 * @param {Boolean} includeTime - Whether to include the time
 * @returns {String} Formatted date string
 */
export function formatDate(timestamp, includeTime = true) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return date.toLocaleDateString(undefined, options);
}

/**
 * Format a number with commas as thousands separators
 * @param {Number} number - Number to format
 * @returns {String} Formatted number
 */
export function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate and format an ability score modifier
 * @param {Number} score - Ability score
 * @returns {String} Formatted modifier
 */
export function formatModifier(score) {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : modifier.toString();
}

/**
 * Format the character's level with suffix
 * @param {Number} level - Character level
 * @returns {String} Formatted level
 */
export function formatLevel(level) {
  if (!level) return '1st';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigit = level % 10;
  const suffix = suffixes[relevantDigit] || suffixes[0];
  
  return `${level}${suffix}`;
}

/**
 * Format a currency amount for the game
 * @param {Number} amount - Currency amount
 * @returns {String} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k gold`;
  } else if (amount >= 100) {
    return `${amount} gold`;
  } else if (amount >= 10) {
    return `${amount} silver`;
  } else {
    return `${amount * 10} copper`;
  }
}

/**
 * Format a message for display with markdown-like rendering
 * @param {String} message - Raw message
 * @returns {String} Formatted message HTML
 */
export function formatGameMessage(message) {
  if (!message) return '';
  
  // Replace ** text ** with <strong>text</strong>
  let formatted = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace * text * with <em>text</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace new lines with <br>
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}