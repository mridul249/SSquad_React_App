// src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

const otpRequestLimiter = rateLimit({
  windowMs: 800 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 5 OTP requests per windowMs
  message: { success: false, message: 'Too many OTP requests from this IP, please try again after 15 minutes.' },
});

module.exports = { otpRequestLimiter };
