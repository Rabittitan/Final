const mongoose = require('mongoose');

const firmwareSchema = new mongoose.Schema({
  version: { type: String, required: true },
  device_type: { type: String, required: true },
  file_url: { type: String, required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploaded_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Firmware', firmwareSchema);
