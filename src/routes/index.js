const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/coordinators', require('./coordinator'));
router.use('/devices', require('./device'));
router.use('/sensor', require('./sensor'));
router.use('/alerts', require('./alert'));
router.use('/firmwares', require('./firmware'));

module.exports = router;
