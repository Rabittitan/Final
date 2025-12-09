const mongoose = require('mongoose');

const deviceBindingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinator', required: true },
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  permission: { type: String, enum: ['read','write','control'], default: 'read' }
});

module.exports = mongoose.model('DeviceBinding', deviceBindingSchema);
