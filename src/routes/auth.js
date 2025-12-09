const router = require('express').Router();
const authController = require('../controllers/auth');
const { registerSchema, loginSchema } = require('../utils/validator');
const validate = require('../middlewares/validate');

router.post('/register',validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema) ,authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);



module.exports = router;
