const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');


router.get('/', userController.renderIndex);
router.get('/log_in', userController.renderLogIn);
router.get('/about', userController.renderAbout);

module.exports = router;
