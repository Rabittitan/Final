module.exports = {
  secret: process.env.JWT_SECRET || 'changeme',
  expiresIn: '1d', // token hết hạn sau 1 ngày
};
