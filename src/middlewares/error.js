// src/middlewares/error.middleware.js
const logger = require('../utils/logger');

module.exports = function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;

  // Component-specific logging
  const meta = { cid: req.correlationId };
  if (err.component) meta.component = err.component;

  if (status >= 500) logger.error('Error', { message: err.message, stack: err.stack, status, ...meta });
  else logger.warn('Error', { message: err.message, status, ...meta });

  res.status(status).json({
    code: err.code || status,
    message: err.message || 'Internal Server Error'
  });
};
