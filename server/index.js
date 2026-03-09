const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://movie-universe-recomendation-client.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Disable Mongoose buffering to fail fast on connection issues
mongoose.set('bufferCommands', false);

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tmdb', require('./routes/tmdb'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/history', require('./routes/history'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => res.json({
  status: 'online',
  message: 'Cinematic Movie Platform API',
  links: {
    frontend: process.env.CLIENT_URL || 'http://localhost:5173',
    health: '/api/health'
  }
}));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Movie Platform API running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

console.log('⏳ Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000, // Wait up to 15s for Atlas handshake
})
  .then(() => {
    console.log('✅ MongoDB connected successfully to Cloud Atlas');

    // START SERVER ONLY AFTER DB IS READY
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎬 Movie Platform API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    const isNetworkError = err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND') || err.message.includes('querySrv');
    
    if (isNetworkError) {
      console.warn('📡 Network Detected: MongoDB Atlas unreachable. Working in Offline Mode.');
    } else {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.error('👉 TIP: This timeout usually means your IP is NOT whitelisted in MongoDB Atlas.');
      console.error('👉 ACTION: Check your Atlas "Network Access" settings and allow access from anywhere (0.0.0.0/0) for testing.');
    }

    // Still start for health checks, but with limited functionality
    app.listen(PORT, '0.0.0.0', () => {
      console.warn(`🎬 API started in ${isNetworkError ? 'OFFLINE' : 'DEGRADED'} MODE on http://localhost:${PORT}`);
    });
  });

mongoose.connection.on('error', err => {
  console.error('⚠️ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});
