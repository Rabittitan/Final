// src/middlewares/correlation.middleware.js
const { v4: uuidv4 } = require('uuid');

module.exports = function correlationMiddleware(req, res, next) {
  const cid = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = cid;
  res.setHeader('X-Correlation-Id', cid);
  next();
};
