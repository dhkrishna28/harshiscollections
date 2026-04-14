const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../../models');
const emailService = require('../../services/emailService');

function generateToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.USER_JWT_SECRET,
    { expiresIn: process.env.USER_JWT_EXPIRES_IN || '7d' }
  );
}

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const verification_token = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      first_name, last_name, email, password: hashed, phone, verification_token,
    });

    await emailService.sendVerificationEmail(user.email, verification_token);

    res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

    await user.update({ is_verified: true, verification_token: null });
    res.json({ success: true, message: 'Email verified. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    if (!user.is_verified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    // Always respond 200 to prevent user enumeration
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_token_expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({ reset_token, reset_token_expiry });
    await emailService.sendPasswordResetEmail(user.email, reset_token);

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, new_password } = req.body;
    const user = await User.findOne({
      where: { reset_token: token, reset_token_expiry: { [require('sequelize').Op.gt]: new Date() } },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

    const hashed = await bcrypt.hash(new_password, 12);
    await user.update({ password: hashed, reset_token: null, reset_token_expiry: null });

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyEmail, login, forgotPassword, resetPassword };
