const Alert = require('../models/alert');

exports.evaluate = async (device, metric, value) => {
  // Ví dụ rule đơn giản
  if (metric === 'temperature' && value > 50) {
    await Alert.create({
      device_id: device._id,
      rule: 'temperature > 50',
      triggered_at: new Date(),
      value,
      severity: 'high',
      resolved: false
    });
  }
};

exports.listByUser = async (userId) => {
  return Alert.find({ user_id: userId });
};

exports.resolve = async (alertId) => {
  return Alert.findByIdAndUpdate(alertId, { resolved: true });
};
//emitAlert(device.owner, alert);
