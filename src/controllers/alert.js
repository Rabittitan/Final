const alertService = require('../services/alert');

exports.list = async (req, res, next) => {
  try {
    const alerts = await alertService.listByUser(req.user._id);
    res.json(alerts);
  } catch (err) { next(err); }
};

exports.resolve = async (req, res, next) => {
  try {
    await alertService.resolve(req.params.alertId);
    res.json({ success: true });
  } catch (err) { next(err); }
};
