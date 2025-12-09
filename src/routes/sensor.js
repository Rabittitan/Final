const router = require('express').Router();
const sensorController = require('../controllers/sensor');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', sensorController.query);

module.exports = router;
