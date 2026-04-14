const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Verifies a user JWT token and attaches the user to req.user.
 */
async function userAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized – missing token.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_token', 'reset_token_expiry'] },
    });
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Unauthorized – account inactive.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized – invalid token.' });
  }
}

module.exports = { userAuth };
