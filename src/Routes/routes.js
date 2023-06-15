const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Recipe = require('../models/recipe');
const Comment = require('../models/comment');
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

const validateEmail = (email) => {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const calculateUnreadComments = async (req, res, next) => {
  if (req.user) {
    // Fetch the logged-in user's comments
    const user = await User.findById(req.user._id).populate('commentsOnPost');

    // Filter the comments to get the unread ones
    const unreadComments = user.commentsOnPost.filter(comment => !comment.read);

    // Add the unreadComments array to response locals
    res.locals.unreadComments = unreadComments;
  }

  next();
};

// Register the middleware function
router.use(calculateUnreadComments);


router.get('/login', (req, res) => {
  const message = req.flash('error')[0]; // Retrieve the error message from the flash session
  res.render('login', { error: message }); // Pass the error message to the login view
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true // Enable flash messages for failure cases
}));



router.post('/editRecipe', async (req, res) => {
  const { postId } = req.body;
  const post = await Recipe.findById(postId);
  return res.render('edit_recipe', { post: post });

});

router.post('/register', async (req, res) => {
  const { email, username, password, confirmpassword } = req.body;
  const level = 'beginner';
  console.log(email);
  console.log(username);
  console.log(password);
  console.log(confirmpassword);
  console.log(username.length);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'The email provided is already registered. Please try with a different email.' });
    }
    if (username.length < 4 || username.length > 20) {
      return res.render('register', { error: 'Username must have at least 4 characters' });
    }
    if (!validateEmail(email)) {
      return res.render('register', { error: 'Invalid email format' });
    }
    if (password.length < 6 || password.length > 20) {
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
  // req.logout();
  res.redirect('/login');
});

router.get('/', userController.renderIndex);


router.get('/about', userController.renderAbout);

router.get('/viewOtherProfile', userController.renderUserProfile);

router.post('/uploadphoto',upload.single('image'),  async(req,res)=>{
  try {
  const userId = req.user.id; // Assuming req.user contains the user's ID
   console.log("hii")
    // Find the user based on the user ID
    const user = await User.findById(userId);
// Check if an image was uploaded
  if (req.file) {
    console.log("hi2")
    // Image uploaded, include it in the recipe data
    user.image = {
      data: fs.readFileSync(req.file.path),
      contentType: req.file.mimetype
    };
  }
  await user.save();
  
  res.sendStatus(200);
 } catch (error) {
      console.log("error")
      console.error('Error creating profilphoto:', error);
      res.status(500).send('Error creating profilphoto. Please try again.');
    }
});

router.post('/viewOtherProfile', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  try {
    // Retrieve the saved recipe object IDs
    const followersIds = user.followers;
    const followingsIds = user.followedUsers;
    const postIds = user.uploadedRecipes;
    // Fetch the saved recipes from the database
    const followers = await User.find({ _id: { $in: followersIds } });
    const followings = await User.find({ _id: { $in: followingsIds } });
    const posts = await Recipe.find({ _id: { $in: postIds } });
    res.render('user_profile', { followers: followers, followings: followings, mongo_user: user, current_user: req.user, posts: posts });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/uploadrecipe', (req, res) => {
  if (req.user) {
    res.render('recipeUpload', { user: req.user });
  }
});
router.get('/recipeLiked', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {
    try {
      // Retrieve the liked recipe object IDs
      const likedRecipeIds = req.user.likedRecipes;

      // Fetch the liked recipes from the database
      const likedRecipes = await Recipe.find({ _id: { $in: likedRecipeIds } });

      res.render('likedRecipe', { currentUser: req.user, posts: likedRecipes, comments:comments });
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

router.get('/recipeSaved', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {
    try {
      // Retrieve the saved recipe object IDs
      const savedRecipeIds = req.user.savedRecipes;

      // Fetch the saved recipes from the database
      const savedRecipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

      res.render('savedRecipe', { currentUser: req.user, posts: savedRecipes , comments:comments});
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

router.get('/register', (req, res) => {
  const message = req.flash('message')[0];
  res.render('register', { error: '' });
});
router.get('/home', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {
    try {
      // Fetch the unread comments
      const unreadComments = res.locals.unreadComments;

      // Fetch the other necessary data for the "home" page
      const user = await User.findById(req.user._id);
      const followedUsersId = user.followedUsers;
      const followedUsers = await User.find({ _id: { $in: followedUsersId } });
      let recipesId = [];

      followedUsers.forEach(followedUser => {
        recipesId = recipesId.concat(followedUser.uploadedRecipes, followedUser.sharedRecipes);
      });

      const recipes = await Recipe.find({ _id: { $in: recipesId } });

      res.render('home', { currentUser: req.user, posts: recipes, unreadComments: unreadComments, comments:comments });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.redirect('/error'); // Redirect to an error page or handle the error accordingly
    }
  } else {
    res.redirect('/login');
  }
});

router.get('/exploreByupload_date', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {

    Recipe.find()
      .sort({ createdAt: -1 }) // Sort in descending order based on the `updatedAt` field
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result , comments:comments});
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/explore', async (req, res) => {
  const comments = await Comment.find();
  if (req.user) {

    Recipe.find()
      .sort({ likes: -1 }) // Sort in descending order based on the `updatedAt` field
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result, comments: comments });
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/exploreBylikes',async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {

    Recipe.find()
      .sort({ likes: -1 }) // Sort in descending order based on the `updatedAt` field
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result, comments:comments });
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/exploreByab_desc', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {

    Recipe.find()
      .collation({ locale: "en" })
      .sort({ name: -1 }) // Sort in descending order based on the `updatedAt` field
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result, comments:comments });
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/exploreByab_asc', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {

    Recipe.find()
      .collation({ locale: "en" })
      .sort({ name: 1 }) // Sort in descending order based on the `updatedAt` field
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result, comments:comments });
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/search_recipe', async (req, res) => {
  const comments = await Comment.find();

  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('search_recipe', { currentUser: req.user, posts: result, comments:comments });
      });
  } else {
    res.redirect('/login');
  }
});

// router.get('/notification', (req, res) => {
//   if (req.user) {
//     Recipe.find()
//       .then(result => {
//         res.render('notification', { currentUser: req.user, posts: result });
//       });
//   } else {
//     res.redirect('/login');
//   }
// });

router.get('/category', async (req, res) => {
  const category = req.query.category; // Get the category from the URL parameter
  const comments = await Comment.find();
  if (req.user) {
    Recipe.find({ category }) // Filter the recipes by category
      .then(result => {
        res.render('category', { currentUser: req.user, posts: result, category, comments:comments });
      })
      .catch(error => {
        console.error(error);
        // Handle the error appropriately
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/contact', userController.renderContact);
router.get('/user_profile', userController.renderUserProfile);
router.get('/user_account', userController.renderUserAccount);
router.get('/notification', userController.renderUserNotes);
//Define the route to handle the delete request
router.delete('/deleteAccount', function (req, res) {
  const userId = req.user._id;
  console.log(userId);
  User.findByIdAndRemove(userId)
    .then(() => {
      // Deletion successful
      res.sendStatus(200);
    })
    .catch(error => {
      // Handle deletion error
      console.error(error);
      res.sendStatus(500);
    });
});


router.post('/checkOldPassword', async (req, res) => {
  const { oldPassword } = req.body;

  try {
    // Retrieve the current user's password from the database
    const user = await User.findById(req.user._id); // Assuming you have the authenticated user's ID available in req.user.id

    if (!user) {
      console.log("errorrr!!!!");

      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the hashed password in the database
    const isCorrect = await bcrypt.compare(oldPassword, user.password);

    return res.status(200).json({ isCorrect });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/updatePassword', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Retrieve the current user's password from the database
    const user = await User.findById(req.user._id); // Assuming you have the authenticated user's ID available in req.user.id

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the old password with the hashed password in the database
    const isCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrect) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/updateFirstName', function (req, res) {
  // Get the updated first name from the request body
  const updatedFirstName = req.body.firstName;
  const updatedLastName = req.body.lastName;
  const updatedStatus = req.body.status;
  const updatedUserName = req.body.username;
  const userId = req.user._id;
  if (updatedFirstName == null) {
    console.log("undefind!");
  }
  else {
    console.log(updatedFirstName);
    console.log(userId);
  }
  // Update the record in the database using a database query or an ORM
  User.findOneAndUpdate(
    { _id: userId }, // Query condition to find the user
    {
      $set: {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        status: updatedStatus,
        username: updatedUserName

      }
    }, // Update operation

    { new: true } // Options (e.g., to return the updated document)
  )
    .then(updatedUser => {
      // Handle the updated user if needed
      return res.status(200).json({ message: 'the user updated successfully' });
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch(error => {
      // Handle any errors that occur during the update
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });

});
router.post('/follow', async (req, res) => {
  const { uploader, current_user } = req.body;
  const redirectUrl = req.headers.referer || '/';
  const current = await User.findById(current_user);
  current.followedUsers.push(uploader);
  await current.save();
  const user = await User.findById(uploader)
  user.followers.push(current_user);
  // Retrieve the saved recipe object IDs
  // const followRecipeIds = req.user.followedUsers;
  // const followRecipe = Recipe.find({ _id: { $in: followRecipeIds } });
  await user.save();
  try {
    // Retrieve the saved recipe object IDs
    const followersIds = user.followers;
    const followingsIds = user.followedUsers;
    const postIds = user.uploadedRecipes;
    // Fetch the saved recipes from the database
    const followers = await User.find({ _id: { $in: followersIds } });
    const followings = await User.find({ _id: { $in: followingsIds } });
    const posts = await Recipe.find({ _id: { $in: postIds } });
    return res.render('user_profile', { followers: followers, followings: followings, mongo_user: user, current_user: current, posts: posts });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/unfollow', async (req, res) => {
  const { uploader, current_user } = req.body;
  const redirectUrl = req.headers.referer || '/';
  const current = await User.findById(current_user);
  current.followedUsers.pull(uploader);
  await current.save();
  const user = await User.findById(uploader)
  user.followers.pull(current_user);
  // Retrieve the saved recipe object IDs
  // const followRecipeIds = req.user.followedUsers;
  // const followRecipe = Recipe.find({ _id: { $in: followRecipeIds } });
  await user.save();
  try {
    // Retrieve the saved recipe object IDs
    const followersIds = user.followers;
    const followingsIds = user.followedUsers;
    const postIds = user.uploadedRecipes;
    // Fetch the saved recipes from the database
    const followers = await User.find({ _id: { $in: followersIds } });
    const followings = await User.find({ _id: { $in: followingsIds } });
    const posts = await Recipe.find({ _id: { $in: postIds } });
    return res.render('user_profile', { followers: followers, followings: followings, mongo_user: user, current_user: current, posts: posts });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/editRecipe', async (req, res) => {
  const { category, name, ingridients, instructions, preparationTime, dishes, postId } = req.body;
  const post = await Recipe.findById(postId);
  console.log(category);
  console.log(name);
  console.log(ingridients);
  console.log(instructions);
  console.log(preparationTime);
  console.log(dishes);
  console.log(postId);
  Recipe.findOneAndUpdate(
    { _id: postId }, // Filter to find the recipe by its ID
    {
      $set: {
        category: category,
        preparationTime: preparationTime,
        name: name,
        dishes: dishes,
        ingredients: ingridients,
        instructions: instructions
      }
    },
    { new: true } // Return the updated recipe
  )
    .then(updatedRecipe => {
      console.log(updatedRecipe);
      res.status(200).json(updatedRecipe);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to update recipe' });
    });
  // const post = await Recipe.findById(postId);
  // return res.render('edit_recipe', { post: post });

});

router.post('/comment', async (req, res) => {
  const { postId, text, uploader, poster } = req.body;
  console.log(text);
  console.log(uploader);
  console.log(postId);
  console.log(poster);

  // Check if an image was uploaded

  // Create the recipe
  const comment = new Comment({ uploader: uploader, text: text, post: postId, read:false });
  await comment.save();
  const comments = await Comment.find();
  Recipe.findById(postId)
    .then(recipe => {
      recipe.comments.push(comment._id); // Add the new comment to the recipe's comments array
      return recipe.save();
    })
    .then(result => {
      if (req.user) {
        Recipe.find()
          .sort({ likes: -1 }) // Sort in descending order based on the `updatedAt` field
          .then(result => {
            res.redirect('/explore'); // Redirect to the explore route after successful comment addition
          });
      } else {
        res.redirect('/login');
      }
    })
    .catch(error => {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  
  Recipe.findById(postId)
    .then(result => {
      User.findOne({ email: result.uploader })
        .then(user => {
          user.commentsOnPost.push(comment);
          return user.save();
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      // Handle any errors related to finding the recipe
      console.error(err);
    });
});

router.post('/read_comment', async (req, res) => {
  const { commentId} = req.body;

  Comment.findById(commentId)

  .then(comment => {
    comment.read = true; // Add the new comment to the recipe's comments array
    comment.save();
    res.redirect('/user_profile');
  })
  .catch(err => {
      // Handle any errors related to finding the recipe
      console.error(err);
    });

});

router.delete('/delete_comment', async (req, res) => {
  const { commentId } = req.query;

  Comment.findByIdAndRemove(commentId)
    .then(() => {
      // Deletion successful
      res.sendStatus(200);
    })
    .catch(error => {
      // Handle deletion error
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete('/deleteComment', function (req, res) {
  const { commentId } = req.query;

  Comment.findByIdAndRemove(commentId)
    .then(() => {
      // Deletion successful
      res.sendStatus(200);
    })
    .catch(error => {
      // Handle deletion error
      console.error(error);
      res.sendStatus(500);
    });
});




module.exports = router;
