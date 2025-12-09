const mongoose = require('mongoose');

const coordinatorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  mqtt_prefix: { type: String, default: 'zigbee2mqtt' },
  status:  { type: String, enum: ['online','offline'], default: 'offline' },
  last_seen: { type: Date }
});

module.exports = mongoose.model('Coordinator', coordinatorSchema);
