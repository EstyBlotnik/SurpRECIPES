const User = require('../models/users');
const Recipe = require('../models/recipe');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');


exports.renderIndex = (req, res) => {
  res.render('index');
};

exports.renderUserHomePage = (req, res) => {
  res.render('user_home_page');
};

exports.renderUserNotes= async (req, res) => {
  const comments = await Comment.find(); 
  const posts = await Recipe.find();

  if (req.user) {
    res.render('notification', { mongo_user: req.user, comments:comments, posts:posts });
  }

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
      const postIds = req.user.uploadedRecipes;
      // Fetch the saved recipes from the database
      const followers = await User.find({ _id: { $in: followersIds } });
      const followings = await User.find({ _id: { $in: followingsIds } });
      const posts=await Recipe.find({ _id: { $in:postIds } });
      const comments = await Comment.find();
      res.render('user_profile', { followers: followers, followings: followings, mongo_user: req.user , current_user: req.user ,posts:posts, comments:comments});
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
};




