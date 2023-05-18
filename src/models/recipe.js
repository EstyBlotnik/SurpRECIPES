const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  dishes: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploader: {
    type: String,
    // required: true,
  },
  image: {
    data: Buffer, // Store image data as a Buffer type
    contentType: String, // Store the content type of the image
   
  },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
