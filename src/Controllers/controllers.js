const User = require('../models/users');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const email = 'adi@gmail.com';
const mongo_user = mongoose.model(email, {});

exports.renderIndex = (req, res) => {
  res.render('index');
};

exports.renderUserHomePage = (req, res) => {
  res.render('user_home_page');
};

exports.renderLogIn = (req, res) => {
  res.render('log_in');
};

exports.renderAbout = (req, res) => {
  res.render('about');
};

exports.renderContact = (req, res) => {
  res.render('contact');
};

exports.renderUserAccount= (req, res) => {

  // Find the user by the identifier
     User.findOne({ email })
    .then(mongo_user => {
      res.render('user_account', { mongo_user});
    })
    .catch(err => {
      console.error('Error retrieving user:', err);
      // Handle the error appropriately
    });

  };


exports.renderUserProfile = (req, res) => {
  // Find the user by the identifier
  User.findOne({ email })
    .then(mongo_user => {
     res.render('user_profile', { mongo_user});
 })
 .catch(err => {
   console.error('Error retrieving user:', err);
   // Handle the error appropriately
 });

};




