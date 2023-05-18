const multer = require('multer');
const Recipe = require('../models/recipe');

// Create the multer upload middleware
const upload = multer({ dest: 'uploads/' });

// Handle POST request to '/recipe/upload'
exports.uploadRecipe = [
  upload.single('image'), // Handle the 'image' field as a single file upload
  async (req, res) => {
    try {
      const { category, name, instructions, preparationTime, dishes, ingredients } = req.body;
      const ingredientsArray = Array.isArray(ingredients) ? ingredients.map(String) : [];

      // Check if an image was uploaded
      if (req.file) {
        // Image uploaded, save it
        const recipe = new Recipe({
          category,
          name,
          instructions,
          preparationTime,
          dishes,
          image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          },
          ingredients: ingredientsArray,
        });
        await recipe.save();
      } else {
        // No image uploaded, save the recipe without the image field
        const recipe = new Recipe({
          category,
          name,
          instructions,
          preparationTime,
          dishes,
          ingredients: ingredientsArray,
        });
        await recipe.save();
      }

      // Send a success response back to the client
      res.sendStatus(200);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).send('Error creating recipe. Please try again.');
    }
  },
];
