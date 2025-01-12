// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // For security headers
const session = require('express-session');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/outgoinggDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));

// Security Headers
app.use(helmet());

// Body Parsing Middleware
app.use(express.json()); // To parse JSON bodies

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Use environment variable in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Rate Limiter Middleware
// app.use(rateLimiter.otpRequestLimiter); // Apply rate limiter globally or to specific routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
// Error Handling Middleware
app.use(errorHandler); // Ensure this is after all other middleware and routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
