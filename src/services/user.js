const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async ({ username, email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password_hash: hash });
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error('Invalid credentials');
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
