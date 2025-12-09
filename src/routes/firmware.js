const router = require('express').Router();
const firmwareController = require('../controllers/firmware');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(auth);

router.post('/upload', upload.single('file'), firmwareController.upload);
router.post('/:deviceId/update', firmwareController.triggerUpdate);

module.exports = router;
