const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  rule: { type: String, required: true },
  triggered_at: { type: Date, default: Date.now },
  value: { type: Number },
  severity: { type: String, enum: ['low','medium','high'], default: 'low' },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', alertSchema);
