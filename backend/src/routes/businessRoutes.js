const express = require('express');
const { body } = require('express-validator');
const {
  addBusinessInfo,
  getBusinessInfo,
  submitBusinessDocuments,
  getBusinessDocuments,
  deleteUser,
  approveUser,
} = require('../controllers/businessController');
const signupFlow = require('../middlewares/signupFlow');
const auth = require('../middlewares/auth'); // To check if authenticated
const admin = require('../middlewares/admin'); // To check if admin

const router = express.Router();

// Add Business Information (Signup Step 3)
router.post(
  '/add-info',
  signupFlow(3), // Only accessible if currentSignupStep >=3
  [
    body('brandName').notEmpty().withMessage('Brand Name is required'),
    body('primaryCategory').notEmpty().withMessage('Primary Category is required'),
    body('outletType').isIn(['Single outlet', 'Multiple outlets']).withMessage('Outlet Type must be Single outlet or Multiple outlets'),
    body('numberOfOutlets')
      .if(body('outletType').equals('Multiple outlets'))
      .isInt({ min: 2 })
      .withMessage('Number of Outlets must be at least 2'),
    body('businessAddress.addressOnMap').notEmpty().withMessage('Address on Map is required'),
    body('businessAddress.fullAddress').notEmpty().withMessage('Full Address is required'),
    body('businessAddress.landmark').optional().isString(),
    body('termsAgreed')
      .isBoolean().withMessage('termsAgreed must be a boolean')
      .custom((value) => {
        if (!value) {
          throw new Error('You must agree to the terms and conditions');
        }
        return true;
      }),
  ],
  addBusinessInfo
);

// Get Business Information (View)
router.get('/info', signupFlow(3), getBusinessInfo);

// Submit Business Documents (Signup Step 4)
router.post(
  '/submit-documents',
  signupFlow(4), // Only accessible if currentSignupStep >=4
  [
    body('ownerName').notEmpty().withMessage('Owner’s Name is required'),
    body('panNumber').notEmpty().withMessage('PAN Number is required'),
    body('panNumber').isLength({ min: 10, max: 10 }).withMessage('PAN Number must be 10 characters'),
    body('gstNumber')
      .if(body('hasGSTIN').equals(true))
      .notEmpty()
      .withMessage('GST Number is required'),
    body('bankDetails.ifscCode').notEmpty().withMessage('Bank IFSC Code is required'),
    body('bankDetails.accountNumber').notEmpty().withMessage('Bank Account Number is required'),
    body('fssaiCertificateNumber').if(body('isFssaiAvailable').equals(true)).notEmpty().withMessage('FSSAI Certificate Number is required'),
  ],
  submitBusinessDocuments
);

// Get Business Documents (View)
router.get('/documents/info', signupFlow(5), getBusinessDocuments);

// Delete User and Reset Signup (Move Back to Login)
router.delete('/delete-user', signupFlow(2), deleteUser);

// Approve User Route (Admin Only)
router.post(
  '/approve-user',
  auth, // Ensure authenticated
  admin, // Ensure admin privileges
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  approveUser
);

module.exports = router;