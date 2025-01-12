// src/models/User.js

const mongoose = require('mongoose');

const BusinessAddressSchema = new mongoose.Schema({
  addressOnMap: { type: String },
  fullAddress: { type: String },
  landmark: { type: String },
});

const BusinessInfoSchema = new mongoose.Schema({
  brandName: { type: String },
  primaryCategory: { type: String },
  outletType: { type: String },
  numberOfOutlets: { type: Number },
  businessAddress: { type: BusinessAddressSchema },
  termsAgreed: { type: Boolean, required: false },
});

const OwnerDetailsSchema = new mongoose.Schema({
  ownerName: { type: String },
  panNumber: { type: String, unique: true, sparse: true },
  gstNumber: { type: String },
  hasGSTIN: { type: Boolean },
});

const BankDetailsSchema = new mongoose.Schema({
  ifscCode: { type: String },
  accountNumber: { type: String },
});

const FssaiDetailsSchema = new mongoose.Schema({
  fssaiCertificateNumber: { type: String },
  isAvailable: { type: Boolean },
});

const BusinessDocumentsSchema = new mongoose.Schema({
  ownerName: { type: String },
  panNumber: { type: String },
  gstNumber: { type: String },
  hasGSTIN: { type: Boolean },
  bankDetails: { type: BankDetailsSchema },
  fssaiCertificateNumber: { type: String },
  isFssaiAvailable: { type: Boolean },
  submittedForVerification: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  yourName: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  currentSignupStep: { type: Number, default: 1 },
  otp: {
    code: { type: String, default: null }, // OTP value
    expiresAt: { type: Date, default: null }, // OTP expiration timestamp
  },
  isVerified: { type: Boolean, default: false },
  businessInfo: { type: BusinessInfoSchema, default: {} },
  businessDocuments: { type: BusinessDocumentsSchema, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
