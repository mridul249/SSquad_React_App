const { validationResult } = require('express-validator');
const User = require('../models/User');


const addBusinessInfo = async (req, res, next) => {
  try {
    console.log('Received addBusinessInfo request body:', req.body);
    console.log('Session before processing:', req.session);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { brandName, primaryCategory, outletType, numberOfOutlets, businessAddress, termsAgreed } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      console.log('Unauthorized access attempt.');
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register first.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found.');
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    if (user.currentSignupStep < 3) {
      console.log('Access to Business Information denied before OTP verification.');
      return res.status(403).json({ success: false, message: 'Cannot access Business Information before OTP verification.' });
    }

    user.businessInfo = {
      brandName,
      primaryCategory,
      outletType,
      numberOfOutlets: outletType === 'Multiple outlets' ? numberOfOutlets : 1,
      businessAddress,
      termsAgreed,
    };

    user.currentSignupStep = 4;
    await user.save();

    req.session.currentSignupStep = 4;
    req.session.save((err) => {
      if (err) {
        console.log('Error saving session:', err);
        return next(err);
      }
      console.log('Session after processing:', req.session);
      res.status(201).json({ success: true, message: 'Business information added successfully.', currentSignupStep: 4 });
    });
  } catch (error) {
    console.log('Error in addBusinessInfo:', error);
    next(error);
  }
};

const getBusinessInfo = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register first.' });
    }

    const user = await User.findById(userId).select('businessInfo');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, businessInfo: user.businessInfo });
  } catch (error) {
    next(error);
  }
};

const submitBusinessDocuments = async (req, res, next) => {
  try {
    console.log('Received submitBusinessDocuments request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { ownerName, panNumber, gstNumber, hasGSTIN, bankDetails, fssaiCertificateNumber, isFssaiAvailable } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register first.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    if (user.currentSignupStep < 4) {
      return res.status(403).json({ success: false, message: 'Cannot access Business Documents before filling Business Information.' });
    }

    user.businessDocuments = {
      ownerName: ownerName.trim(),
      panNumber: panNumber.trim().toUpperCase(),
      gstNumber: hasGSTIN ? gstNumber.trim().toUpperCase() : '',
      hasGSTIN,
      bankDetails: {
        ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
        accountNumber: bankDetails.accountNumber.trim(),
      },
      fssaiCertificateNumber: isFssaiAvailable ? fssaiCertificateNumber.trim() : '',
      isFssaiAvailable,
      submittedForVerification: false,
    };

    user.currentSignupStep = 5;
    await user.save();

    req.session.currentSignupStep = 5;
    await req.session.save();

    res.status(201).json({ success: true, message: 'Business documents submitted successfully.', currentSignupStep: 5 });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'PAN Number already exists.' });
    }
    console.log('Error in submitBusinessDocuments:', error);
    next(error);
  }
};

const getBusinessDocuments = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register first.' });
    }

    const user = await User.findById(userId).select('businessDocuments');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, businessDocuments: user.businessDocuments });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please register first.' });
    }

    await User.findByIdAndDelete(userId);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Could not delete user. Please try again.' });
      }
      res.clearCookie('connect.sid'); // Adjust cookie name if different
      res.status(200).json({ success: true, message: 'User deleted successfully.' });
    });
  } catch (error) {
    next(error);
  }
};

const approveUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifiedUser = new VerifiedUser({
      _id: userId,
      username,
      password: hashedPassword,
      email: req.user.email,
      isAdmin: false,
    });

    await verifiedUser.save();

    res.status(201).json({ success: true, message: 'User approved successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBusinessInfo,
  getBusinessInfo,
  submitBusinessDocuments,
  getBusinessDocuments,
  deleteUser,
  approveUser,
};