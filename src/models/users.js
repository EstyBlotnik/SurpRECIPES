const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    
  },
  lastName: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  numberOfLikes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
  },
  link: {
    type: String,
    
  },
  uploadedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  savedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  sharedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  likedRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  followedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    data: Buffer, // Store image data as a Buffer type
    contentType: String, // Store the content type of the image
   
  },
  averageLikesPerRecipe: {
    type: Number,
    default: 0
  },
  averageUploadsPerWeek: {
    type: Number,
    default: 0
  },
  commentsOnPost : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
