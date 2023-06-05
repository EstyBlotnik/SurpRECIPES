const multer = require('multer');
const Recipe = require('../models/recipe');
const User = require('../models/users');

// Create the multer upload middleware
const upload = multer({ dest: 'uploads/' });

// Handle POST request to '/recipe/upload'
exports.uploadRecipe = [
  upload.single('image'), // Handle the 'image' field as a single file upload
  async (req, res) => {
    try {
      const { category, name, instructions, preparationTime, dishes, ingredients } = req.body;
      const ingredientsArray = JSON.parse(ingredients);
      //Array.isArray(ingredients) ? ingredients.map(String) : [];
      console.log(req.user.email);
      console.log(ingredientsArray);

      let recipeData = {
        category,
        name,
        instructions,
        preparationTime,
        dishes,
        ingredients: ingredientsArray,
        uploader: req.user.email
      };

      // Check if an image was uploaded
      if (req.file) {
        // Image uploaded, include it in the recipe data
        recipeData.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }

      // Create the recipe
      const recipe = new Recipe(recipeData);
      await recipe.save();

      // Update the user's uploadedRecipes field
      const user = await User.findById(req.user._id);
      user.uploadedRecipes.push(recipe);
      await user.save();

      // Send a successful response back to the client
      res.sendStatus(200);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).send('Error creating recipe. Please try again.');
    }
  },
];
