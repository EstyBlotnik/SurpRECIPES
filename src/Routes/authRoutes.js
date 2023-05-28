const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
const validatePassword = (password) => {
    return password.length >= 6 && password.length <= 20;
  };
const User = require('../models/users');

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
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
  req.logout();
  res.redirect('/login');
});

module.exports = router;
