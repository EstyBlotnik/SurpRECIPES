const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Recipe = require('../models/recipe');

const validateEmail = (email) => {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



  router.get('/login', (req, res) => {
    const message = req.flash('error')[0]; // Retrieve the error message from the flash session
    res.render('login', { error: message }); // Pass the error message to the login view
 });
 
 router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true // Enable flash messages for failure cases
 }));
 



router.post('/register', async (req, res) => {
  const { email, username, password, confirmpassword } = req.body;
  const level = 'starter';
  console.log(email);
  console.log(username);
  console.log(password);
  console.log(confirmpassword);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'The email provided is already registered. Please try with a different email.' });
    }
    if (username.length < 4 && username.length > 20) {
      return res.render('register', { error: 'Username must have at least 4 characters' });
    }
    if (!validateEmail(email)) {
      return res.render('register', { error: 'Invalid email format' });
    }
    if (password.length < 6 && password.length > 20) {
      return res.render('register', { error: 'Password must be between 6 and 20 characters long' });
    }
    if (password !== confirmpassword) {
      return res.render('register', { error: 'Passwords do not match' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, level });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

router.get('/logout', (req, res) => {
  // req.logout();
  res.redirect('/');
});

router.get('/', userController.renderIndex);


router.get('/about', userController.renderAbout);

router.get('/user_profile', (req, res) => {
  if (req.user) {
    res.render('user_profile', { mongo_user: req.user });
  }
});
router.get('/uploadrecipe', (req, res) => {
  if (req.user) {
    res.render('recipeUpload', { user: req.user });
  }
});
router.get('/register', (req, res) => {
  const message = req.flash('message')[0];
  res.render('register', { error: '' });
});
router.get('/home', (req, res) => {
  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('home', { currentUser: req.user ,posts:result});
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/explore', (req, res) => {
  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('explore', { currentUser: req.user ,posts:result});
      });
  } else {
    res.redirect('/login');
  }
});


module.exports = router;
