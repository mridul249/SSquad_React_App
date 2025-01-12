// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const VerifiedUser = require('../models/VerifiedUser');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await VerifiedUser.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = auth;
