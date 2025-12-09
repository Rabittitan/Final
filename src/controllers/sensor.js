const sensorService = require('../services/sensor');

exports.query = async (req, res, next) => {
  try {
    const { deviceId, metric, range } = req.query;
    const data = await sensorService.query(deviceId, metric, range);
    res.json(data);
  } catch (err) { next(err); }
};
