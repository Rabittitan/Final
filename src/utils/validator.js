const Joi = require('joi');

// ==== AUTH ====
const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// ==== DEVICE ====
const addDeviceSchema = Joi.object({
  zcId: Joi.string().required(),
  ieee_address: Joi.string().required(),
  friendly_name: Joi.string().required(),
  device_type: Joi.string().valid('sensor','relay','switch').required()
});

// ==== COORDINATOR ====
const addCoordinatorSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required()
});

// ==== SENSOR ====
const sensorQuerySchema = Joi.object({
  deviceId: Joi.string().required(),
  metric: Joi.string().valid('temperature','humidity','battery','linkquality','pressure','voltage','current').required(),
  from: Joi.date().required(),
  to: Joi.date().required()
});

// ==== FIRMWARE ====
const firmwareUploadSchema = Joi.object({
  version: Joi.string().required(),
  device_type: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  addDeviceSchema,
  addCoordinatorSchema,
  sensorQuerySchema,
  firmwareUploadSchema
};
