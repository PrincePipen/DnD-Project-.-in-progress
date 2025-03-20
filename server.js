const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./server/utils/logger');
const { initErrorHandlers } = require('./server/utils/crashMonitor');
const { checkModels } = require('./server/utils/modelCheck');

// Initialize global error handlers
initErrorHandlers();

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });
}

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Add basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Verify models are available
if (!checkModels()) {
  logger.error('Required models are missing. Application cannot start.');
  process.exit(1);
}

// Wrap startup in try/catch to handle errors gracefully
try {
  // Connect to database (moved inside try/catch)
  const { connectDB } = require('./server/config/database');
  connectDB()
    .then(() => {
      logger.info('MySQL connection initialized successfully');
      
      // Only load routes after successful DB connection
      const gameRoutes = require('./server/routes/gameRoutes');
      const authRoutes = require('./server/routes/authRoutes');
      const testRoutes = require('./server/routes/testRoutes');
      
      // API Routes
      app.use('/api/game', gameRoutes);
      app.use('/api/auth', authRoutes);
      app.use('/api/test', testRoutes);
      
      // Serve static files from React app in production
      if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, 'client/build')));
        
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
        });
      }
      
      // Error handling middleware
      const errorHandler = require('./server/utils/errorHandler');
      app.use(errorHandler);
      
      // Start server
      app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info(`Server healthcheck available at: http://localhost:${PORT}/api/health`);
      });
    })
    .catch(err => {
      logger.error(`❌ Error connecting to MySQL: ${err.message}`);
      process.exit(1);
    });
} catch (error) {
  logger.error('Server initialization failed:', error);
  process.exit(1);
}

module.exports = app;