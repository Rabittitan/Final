const AppError = require('../utils/appError');

/**
 * Middleware validate input bằng Joi schema
 * @param {Object} schema - Joi schema
 * @param {String} property - body | query | params
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }
    req[property] = value; // gán lại dữ liệu đã chuẩn hóa
    next();
  };
}

module.exports = validate;
