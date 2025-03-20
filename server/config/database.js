const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const config = require('./config');

// Create Sequelize instance with MySQL connection
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: msg => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

/**
 * Initialize database connection
 * @returns {Promise} Sequelize connection
 */
const connectDB = async () => {
  try {
    logger.info(`Attempting MySQL connection to: ${config.database.host}:${config.database.port}`);
    
    // Test connection
    await sequelize.authenticate();
    
    logger.info(`MySQL Connected: ${config.database.host}:${config.database.port}`);
    logger.info(`Database name: ${config.database.name}`);
    
    // Sync all models (create tables if they don't exist)
    // In production, you'd want to use migrations instead
    if (process.env.NODE_ENV === 'development') {
      logger.info('Syncing database models...');
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized');
    }
    
    return sequelize;
  } catch (error) {
    logger.error(`❌ Error connecting to MySQL: ${error.message}`);
    
    logger.error('Failed to connect to MySQL server. Possible causes:');
    logger.error('1. MySQL is not running (check if XAMPP MySQL service is started)');
    logger.error('2. Database credentials are incorrect');
    logger.error('3. Database does not exist (run the initialization script)');
    logger.error('\nPlease run the initialization script: node server/scripts/initDb.js');
    
    throw error;
  }
};

module.exports = { sequelize, connectDB };
