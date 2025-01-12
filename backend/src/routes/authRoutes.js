// src/routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  verifyOtpController,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
  getUserInfo,
} = require('../controllers/authController');
const signupFlow = require('../middlewares/signupFlow');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('companyName').notEmpty().withMessage('Company Name is required'),
    body('yourName').notEmpty().withMessage('Your Name is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('email').isEmail().withMessage('Valid Email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    // Removed password field as per backend changes
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Verify OTP
router.post(
  '/verify-otp',
  signupFlow(2), // Only accessible if currentSignupStep >=2
  [
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  verifyOtpController
);

// Resend OTP
router.post(
  '/resend-otp',
  signupFlow(2), // Only accessible if currentSignupStep >=2
  resendOtp
);

// Get User Info
router.get('/user-info', getUserInfo);

// Forgot Password
router.post(
  '/forgot-password',
  [
    body('identifier').notEmpty().withMessage('Identifier (email or phone) is required'),
  ],
  forgotPassword
);

// Reset Password
router.post(
  '/reset-password',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('New Password must be at least 6 characters'),
  ],
  resetPassword
);

// Logout
router.post('/logout', logout);

module.exports = router;
