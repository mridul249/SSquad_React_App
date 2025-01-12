// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerifiedUser = require('../models/VerifiedUser'); 
const { sendOtpEmail } = require('../services/otpService');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateOtp = () => {
  return crypto.randomInt(100000, 900000).toString();
};

// Register (Create Account) - Signup Step 1
const register = async (req, res, next) => {
  try {
    console.log('Received register request body:', req.body);

    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    
    const { companyName, yourName, position, email, phone } = req.body;

    // Check if user exists in User or VerifiedUser collections
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        req.session.userId = user._id;
        req.session.currentSignupStep = user.currentSignupStep;
        // console.log();
        return res.status(200).json({
          success: true,
          message: 'User exists and verified. Fill the rest of details',
          currentSignupStep: user.currentSignupStep,
        });
      } else {
        // If the user is not verified, resend OTP
        const otp = generateOtp();
        user.otp = { code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }; // OTP expires in 5 minutes
        user.currentSignupStep = 2;
        await user.save();

        // Send OTP to the email
        await sendOtpEmail(user.email, otp);

        // Set session
        req.session.userId = user._id;
        req.session.currentSignupStep = 2;

        return res.status(200).json({
          success: true,
          message: 'User exists but not verified. OTP resent to email.',
          currentSignupStep: 2,
        });
      }
    }

    // If user does not exist, create a new user
    const otp = generateOtp();
    const newUser = new User({
      companyName,
      yourName,
      position,
      email,
      phone,
      currentSignupStep: 2,
      otp: { code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }, // OTP expires in 5 minutes
    });

    await newUser.save();

    // Send OTP to email
    await sendOtpEmail(email, otp);

    // Set session
    req.session.userId = newUser._id;
    req.session.currentSignupStep = 2;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. OTP sent to email.',
      currentSignupStep: 2,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      // Handle duplicate email error gracefully
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
      });
    }

    next(error);
  }
};


// Login - Fetches from VerifiedUser collection
const login = async (req, res, next) => {
  try {
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body; // Changed from identifier to username

    // Find user in VerifiedUser collection
    const verifiedUser = await VerifiedUser.findOne({ username });
    if (!verifiedUser) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, verifiedUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = generateToken(verifiedUser);

    // Set cookie
    res.cookie('token', token, { httpOnly: true, secure: true });

    res.status(200).json({ success: true, message: 'Logged in successfully.', token });
  } catch (error) {
    next(error);
  }
};

// OTP Verification - Signup Step 2
const verifyOtpController = async (req, res, next) => {
  try {
    // Log the incoming request body for debugging
    console.log('Received verify-otp request body:', req.body);

    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { otp } = req.body;

    const userId = req.session.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'No user in session. Please register or login first.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if OTP is valid
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Check if OTP has expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = { code: null, expiresAt: null }; // Clear OTP
    user.currentSignupStep = 3; // Move to next step
    await user.save();

    // Update session
    req.session.currentSignupStep = 3;

    res.status(200).json({ success: true, message: 'OTP verified successfully.', currentSignupStep: 3 });
  } catch (error) {
    next(error);
  }
};

// Resend OTP
const resendOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Validate Request
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Generate new OTP
    const otp = generateOtp();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }; // Expires in 5 minutes
    user.currentSignupStep = 2;
    await user.save();

    // Send OTP to email
    await sendOtpEmail(user.email, otp);

    // Update session
    req.session.userId = user._id;
    req.session.currentSignupStep = 2;

    res.status(200).json({ success: true, message: 'OTP resent successfully.', currentSignupStep: 2 });
  } catch (error) {
    next(error);
  }
};

// Forgot Password (Initiate)
const forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body; // email or phone

    // Validate Request
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Identifier is required.' });
    }

    // Find user
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Generate and send OTP for password reset
    const otp = generateOtp();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }; // Expires in 5 minutes
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.status(200).json({ success: true, message: 'OTP sent to your email for password reset.' });
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'User ID, OTP, and new password are required.' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Verify OTP
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    // Check if OTP has expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and reset signup steps if necessary
    user.password = hashedPassword;
    user.currentSignupStep = 1;
    user.isVerified = false;
    user.otp = { code: null, expiresAt: null };
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not logout. Please try again.' });
    }
    res.clearCookie('connect.sid'); // Adjust cookie name if different
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });
};

const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register or login first.' });
    }

    const user = await User.findById(userId).select('email currentSignupStep');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, email: user.email, currentSignupStep: user.currentSignupStep });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyOtpController,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
  getUserInfo,
};