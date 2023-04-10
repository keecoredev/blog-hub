const router = require('express').Router();
const AuthenticationController = require('../../controllers/AuthenticationController');

router.post('/', AuthenticationController.registerController);

module.exports = router;