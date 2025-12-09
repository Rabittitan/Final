const Firmware = require('../models/firmware');

exports.upload = async (userId, file) => {
  return Firmware.create({
    version: file.originalname,
    device_type: 'relay',
    file_url: `/uploads/${file.filename}`,
    uploaded_by: userId,
    uploaded_at: new Date()
  });
};

exports.triggerUpdate = async (deviceId, version) => {
  // Publish lệnh OTA qua MQTT
  // mqtt.publish(`zigbee2mqtt/${deviceId}/update`, JSON.stringify({ version }));
};
