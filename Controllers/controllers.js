const User = require('../models/users');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

exports.renderIndex = (req, res) => {
  res.render('index');
};

exports.renderUserHomePage = (req, res) => {
  res.render('user_home_page');
};


exports.renderAbout = (req, res) => {

  res.render('about');
};

exports.renderContact = (req, res) => {
  res.render('contact');
};

exports.renderUserAccount= (req, res) => {

  if (req.user) {
    res.render('user_account', { mongo_user: req.user });
  }

  };


exports.renderUserProfile = (req, res) => {
  if (req.user) {
    res.render('user_profile', { mongo_user: req.user });
  }

};




