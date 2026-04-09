const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res) => {
  try {
    if (await Admin.countDocuments() > 0)
      return res.status(403).json({ message: 'Admin already exists' });
    const admin = await Admin.create(req.body);
    res.status(201).json({ token: sign(admin._id) });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      token: sign(admin._id),
      admin: { _id: admin._id, username: admin.username, email: admin.email, profileImage: admin.profileImage, bio: admin.bio, socialLinks: admin.socialLinks }
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMe = async (req, res) => res.json(req.admin);

exports.updateProfile = async (req, res) => {
  try {
    const { bio, email } = req.body;
    let socialLinks = req.body.socialLinks;
    if (typeof socialLinks === 'string') {
      try { socialLinks = JSON.parse(socialLinks); } catch { socialLinks = {}; }
    }
    const update = { bio, email, socialLinks };
    if (req.file) update.profileImage = `/uploads/${req.file.filename}`;
    const admin = await Admin.findByIdAndUpdate(req.admin._id, update, { new: true }).select('-password');
    res.json(admin);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!(await admin.matchPassword(currentPassword)))
      return res.status(400).json({ message: 'Current password incorrect' });
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
