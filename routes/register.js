const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/AuthenticationController');

router.post('/', AuthenticationController.registerController);

module.exports = router;