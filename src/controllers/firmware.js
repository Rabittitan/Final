const firmwareService = require('../services/firmware');

exports.upload = async (req, res, next) => {
  try {
    const fw = await firmwareService.upload(req.user._id, req.file);
    res.status(201).json(fw);
  } catch (err) { next(err); }
};

exports.triggerUpdate = async (req, res, next) => {
  try {
    await firmwareService.triggerUpdate(req.params.deviceId, req.body.version);
    res.json({ success: true });
  } catch (err) { next(err); }
};
