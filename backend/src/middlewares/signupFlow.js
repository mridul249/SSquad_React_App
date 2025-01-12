const User = require('../models/User');

module.exports = (requiredStep) => {
  return async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ success: false, message: 'No active session. Please start again.' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.session.currentSignupStep = user.currentSignupStep;
    await req.session.save();

    if (requiredStep > user.currentSignupStep) {
      return res.status(403).json({ success: false, message: `Not allowed. You must complete step ${user.currentSignupStep} first.` });
    }

    next();
  };
};