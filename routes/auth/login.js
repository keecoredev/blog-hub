const router = require('express').Router();
const AuthenticationController = require('../../controllers/AuthenticationController');

router.post('/', AuthenticationController.loginController);

module.exports = router;
