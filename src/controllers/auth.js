const authService = require('../services/auth');
const AppError = require('../utils/appError');

// Đăng ký user mới
exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Đăng nhập
exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result); // { accessToken, refreshToken }
  } catch (err) {
    next(err);
  }
};

// Refresh token
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Missing refresh token', 400, 'REFRESH_TOKEN_REQUIRED');

    const result = await authService.refresh(refreshToken);
    res.json(result); // { accessToken }
  } catch (err) {
    next(err);
  }
};

// Logout (revoke refresh token)
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError('Missing access token', 401);

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await authService.logout(decoded.id, refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
