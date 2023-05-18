const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipeController');

router.post('/upload', recipeController.uploadRecipe);


module.exports = router;