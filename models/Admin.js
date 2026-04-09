const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio:          { type: String, default: '' },
  socialLinks:  {
    github:   { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter:  { type: String, default: '' }
  }
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
