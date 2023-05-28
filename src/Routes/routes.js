const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');


router.get('/', userController.renderIndex);
router.get('/login', userController.renderLogIn);
router.get('/about', userController.renderAbout);
router.get('/contact',userController.renderContact);
router.get('/user_profile',userController.renderUserProfile);
router.get('/register', (req, res) => {
  const message = req.flash('message')[0];
  res.render('register', { error: '' });
});
router.get('/home', (req, res) => {
  if (req.user) {
    res.render('home', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
