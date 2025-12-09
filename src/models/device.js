const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  zc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinator', required: true },
  ieee_address: { type: String, required: true, unique: true },
  friendly_name: { type: String, required: true },
  device_type: { type: String, enum: ['sensor','relay','switch'], required: true },
  status: { type: String, enum: ['active','removed'], default: 'active' },
  last_seen: { type: Date }
});

module.exports = mongoose.model('Device', deviceSchema);
