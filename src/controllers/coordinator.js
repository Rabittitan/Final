const coordinatorService = require('../services/coordinator');

exports.list = async (req, res, next) => {
  try {
    const list = await coordinatorService.listByUser(req.user._id);
    res.json(list);
  } catch (err) { next(err); }
};

exports.add = async (req, res, next) => {
  try {
    const zc = await coordinatorService.add(req.user._id, req.body);
    res.status(201).json(zc);
  } catch (err) { next(err); }
};
