const router = require('express').Router();
const deviceController = require('../controllers/device');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/:zcId', deviceController.list);
router.delete('/:deviceId', deviceController.remove);

module.exports = router;
