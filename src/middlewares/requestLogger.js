// src/middlewares/requestLogger.middleware.js
const logger = require('../utils/logger');

module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP',
      { method: req.method, url: req.originalUrl, status: res.statusCode, cid: req.correlationId, ms: Date.now() - start }
    );
  });
  next();
};
