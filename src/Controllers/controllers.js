const User = require('../models/users');
const Recipe = require('../models/recipe');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'adi')
  }
});
// Create the multer upload middleware
const upload = multer({ storage: storage });

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

// exports.uploadphoto = async(req,res)=>{
//   try {
//   const userId = req.user.id; // Assuming req.user contains the user's ID
//    console.log("hii")
//     // Find the user based on the user ID
//     const user = await User.findById(userId);
// // Check if an image was uploaded
//   if (req.file) {
//     // Image uploaded, include it in the recipe data
//     user.image = {
//       data: fs.readFileSync(req.file.path),
//       contentType: req.file.mimetype
//     };
//   }
//   await user.save();
  
//   res.sendStatus(200);
//  } catch (error) {
//       console.error('Error creating profilphoto:', error);
//       res.status(500).send('Error creating profilphoto. Please try again.');
//     }
// }

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
      res.render('user_profile', { followers: followers, followings: followings, mongo_user: req.user , current_user: req.user ,posts:posts});
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
};




