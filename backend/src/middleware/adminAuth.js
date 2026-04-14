const jwt = require('jsonwebtoken');
const { AdminUser } = require('../models');

async function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized – missing token.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ FIXED

    const admin = await AdminUser.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!admin || !admin.is_active) {
      return res.status(401).json({ success: false, message: 'Unauthorized – account inactive.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized – invalid token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden – insufficient role.' });
    }
    next();
  };
}

module.exports = { adminAuth, requireRole };