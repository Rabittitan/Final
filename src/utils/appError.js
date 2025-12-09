module.exports = function errorMiddleware(err, req, res, next) {
  console.error('[Error]', err.message);

  const status = err.statusCode || 500;
  res.status(status).json({
    code: status,
    message: err.message || 'Internal Server Error'
  });
};


class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode || 500;
    this.code = code;
  }
}
module.exports = AppError;
