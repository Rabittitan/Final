const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  timestamp: { type: Date, default: Date.now },
  event_type: { type: String },
  message: { type: String }
});

module.exports = mongoose.model('DeviceLog', deviceLogSchema);
