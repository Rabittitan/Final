const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // số vòng tạo salt, dễ chỉnh sửa sau này

// Hàm mã hóa mật khẩu với salt rounds
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Hàm kiểm tra mật khẩu với hash (bcrypt tự xử lý salt)
async function comparePassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, comparePassword };
