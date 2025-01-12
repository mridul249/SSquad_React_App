// src/middlewares/admin.js

const VerifiedUser = require('../models/VerifiedUser');

module.exports = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }

    const user = await VerifiedUser.findById(userId);
    if (user && user.isAdmin) {
      return next();
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden. Admins only.' });
    }
  } catch (error) {
    next(error);
  }
};
