// src/services/otpService.js
const User = require("../models/User");
const { sendEmail } = require("./emailService");
const dotenv = require("dotenv");

dotenv.config();

const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit OTP
};

const sendOtpEmail = async (email, otp) => {
  const subject = "Your OTP Verification Code";
  const html = `<p>Your OTP code is <b>${otp}</b>. It expires in ${process.env.OTP_EXPIRATION_MINUTES} minutes.</p>`;
  await sendEmail(email, subject, html);
};

const createOtp = async (userId) => {
  const otpCode = generateOtp();
  const expiresAt = new Date(
    Date.now() + process.env.OTP_EXPIRATION_MINUTES * 60000
  ); // e.g., 5 minutes

  // Update User with OTP
  await User.findByIdAndUpdate(userId, {
    otp: {
      code: otpCode,
      expiresAt,
    },
  });

  return otpCode;
};

const verifyOtp = async (userId, otpCode) => {
  const user = await User.findById(userId);

  if (!user || !user.otp || user.otp.code !== otpCode) {
    throw new Error("Invalid OTP");
  }

  if (user.otp.expiresAt < Date.now()) {
    throw new Error("OTP has expired");
  }

  // OTP is valid; clear it
  user.otp = {};
  await user.save();

  return true;
};

module.exports = { createOtp, sendOtpEmail, verifyOtp };
