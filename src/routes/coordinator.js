const router = require('express').Router();
const coordinatorController = require('../controllers/coordinator');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', coordinatorController.list);
router.post('/', coordinatorController.add);

module.exports = router;
