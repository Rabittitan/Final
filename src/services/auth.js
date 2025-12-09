const User = require('../models/user');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');

// Đăng ký user mới
exports.register = async ({ username, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password_hash: hashed });
  return { id: user._id, username: user.username, email: user.email };
};

// Đăng nhập
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await RefreshToken.create({ user_id: user._id, token: refreshToken, expires_at: new Date(Date.now() + 7*24*60*60*1000) });

  return { accessToken, refreshToken };
};

// Refresh token
exports.refresh = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const record = await RefreshToken.findOne({ user_id: decoded.id, token, revoked: false });
  if (!record) throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH');

  const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return { accessToken: newAccessToken };
};

// Logout
exports.logout = async (userId, token) => {
  await RefreshToken.findOneAndUpdate({ user_id: userId, token }, { revoked: true });
};
