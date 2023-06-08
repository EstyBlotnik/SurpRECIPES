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


exports.renderUserProfile =  async (req, res) => {
  if (req.user) {

    try {
      // Retrieve the saved recipe object IDs
      const followersIds = req.user.followers;
      const followingsIds = req.user.followedUsers;

      // Fetch the saved recipes from the database
      const followers = await User.find({ _id: { $in: followersIds } });
      const followings = await User.find({ _id: { $in: followingsIds } });
      res.render('user_profile', { followers: followers, followings: followings, mongo_user: req.user , current_user: req.user });
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
};




