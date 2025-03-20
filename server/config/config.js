const configOptions = {
  development: {
    port: process.env.PORT || 3001,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: 'gemini-2.0-flash',
    logLevel: 'debug',
    jwtSecret: process.env.JWT_SECRET || 'ai-dnd-dev-secret-key',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      name: process.env.DB_NAME || 'ai_dnd_game',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    },
    aiConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  },
  production: {
    port: process.env.PORT || 80,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: 'gemini-2.0-flash',
    logLevel: 'info',
    jwtSecret: process.env.JWT_SECRET || 'ai-dnd-prod-secret-key',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      name: process.env.DB_NAME || 'ai_dnd_game',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    },
    aiConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 1024,
    }
  },
  test: {
    port: 3002,
    geminiApiKey: process.env.GEMINI_API_KEY || 'test-key',
    geminiModel: 'gemini-2.0-flash',
    logLevel: 'debug',
    jwtSecret: process.env.JWT_SECRET || 'ai-dnd-test-secret-key',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      name: process.env.DB_NAME || 'ai_dnd_game_test',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    },
    aiConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  }
};

// Determine which environment we're running in
const env = process.env.NODE_ENV || 'development';

// Make sure we have a valid environment, or fall back to development
const config = configOptions[env] || configOptions.development;

module.exports = config;