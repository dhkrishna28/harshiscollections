const bcrypt = require('bcryptjs');
const { User } = require('../../models');

const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['first_name', 'last_name', 'phone', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const user = await User.findByPk(req.user.id);
    await user.update(updates);
    res.json({ success: true, message: 'Profile updated.', data: user });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    const hashed = await bcrypt.hash(new_password, 12);
    await user.update({ password: hashed });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
