const Device = require('../models/device');
const DeviceLog = require('../models/deviceLog');


exports.create = async(data) => {
  const device = new Device(data);
  return device.save();
};

exports.listByCoordinator = async (zcId) => {
  return Device.find({ zc_id: zcId, status: 'active' });
};

exports.remove = async (deviceId) => {
  return Device.findByIdAndUpdate(deviceId, { status: 'removed' });
};

exports.getByFriendlyName = async (name) => {
  return Device.findOne({ friendly_name: name, status: 'active' });
};

exports.updateAvailability = async (friendlyName) => {
  const device = await exports.getByFriendlyName(friendlyName);
  if (device) {
    device.last_seen = new Date();
    await device.save();
  }
};


exports.ingestLog = async (deviceId, msg) => {
  await DeviceLog.create({
    device_id: deviceId,
    timestamp: new Date(),
    event_type: msg.type || 'log',
    message: msg.message || JSON.stringify(msg)
  });
};
