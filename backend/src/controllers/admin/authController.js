require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../../models');

function generateToken(admin) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    { id: admin.id, role: admin.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ where: { email } });

    if (!admin || !admin.is_active) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    await admin.update({ last_login: new Date() });
    const token = generateToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const admin = await AdminUser.findByPk(req.admin.id);

    const isMatch = await bcrypt.compare(current_password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(new_password, 12);
    await admin.update({ password: hashed });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, me, changePassword };
