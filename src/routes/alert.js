const router = require('express').Router();
const alertController = require('../controllers/alert');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', alertController.list);
router.put('/:alertId/resolve', alertController.resolve);

module.exports = router;
