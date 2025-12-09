const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
