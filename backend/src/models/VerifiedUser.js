// src/models/VerifiedUser.js

const mongoose = require('mongoose');

const VerifiedUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false }, // Admin flag
  // Add additional fields if necessary
}, { timestamps: true });

module.exports = mongoose.model('VerifiedUser', VerifiedUserSchema);
