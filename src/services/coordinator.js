const Coordinator = require('../models/coordinator');

exports.listByUser = async (userId) => {
  return Coordinator.find({ user_id: userId });
};

exports.add = async (userId, data) => {
  return Coordinator.create({ ...data, user_id: userId });
};
