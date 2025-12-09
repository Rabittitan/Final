const deviceService = require('../services/device');

exports.list = async (req, res, next) => {
  try {
    const devices = await deviceService.listByCoordinator(req.params.zcId);
    res.json(devices);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await deviceService.remove(req.params.deviceId);
    res.json({ success: true });
  } catch (err) { next(err); }
};
