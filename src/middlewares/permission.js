const DeviceBinding = require('../models/deviceBinding');

module.exports = function permissionMiddleware(requiredPermission) {
  return async (req, res, next) => {
    const { user } = req;
    const { deviceId, zcId } = req.params;

    const binding = await DeviceBinding.findOne({
      user_id: user._id,
      ...(deviceId ? { device_id: deviceId } : {}),
      ...(zcId ? { zc_id: zcId } : {})
    });

    if (!binding) return res.status(403).json({ error: 'No binding found' });
    if (binding.permission !== requiredPermission && binding.permission !== 'control') {
      return res.status(403).json({ error: 'Insufficient permission' });
    }
    next();
  };
};
