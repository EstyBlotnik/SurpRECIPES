const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Recipe = require('../models/recipe');

const validateEmail = (email) => {
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



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
  console.log(postId);
  const post=await Recipe.findById(postId);
  res.render('edit_recipe',{post});
});

router.put('/edit_recipe', (req, res) => {
  console.log("name");
  const{category, name, instructions, preparationTime, dishes}=req.body;
  console.log("name");
  console.log("category");
  return res.status(200).json({ message: 'Password updated successfully' });
});

router.get('/editRecipe', (req, res) => {
  if (req.user) {
    res.render('user_profile', { mongo_user: req.user, current_user: req.user});
  }
});

router.post('/register', async (req, res) => {
  const { email, username, password, confirmpassword } = req.body;
  const level = 'starter';
  console.log(email);
  console.log(username);
  console.log(password);
  console.log(confirmpassword);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'The email provided is already registered. Please try with a different email.' });
    }
    if (username.length < 4 && username.length > 20) {
      return res.render('register', { error: 'Username must have at least 4 characters' });
    }
    if (!validateEmail(email)) {
      return res.render('register', { error: 'Invalid email format' });
    }
    if (password.length < 6 && password.length > 20) {
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
  res.redirect('/');
});

router.get('/', userController.renderIndex);


router.get('/about', userController.renderAbout);

router.post('/viewOtherProfile', async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
 
  res.render('user_profile', { mongo_user: user, current_user: req.user});
});

router.get('/user_profile', (req, res) => {
  if (req.user) {
    res.render('user_profile', { mongo_user: req.user, current_user: req.user});
  }
});
router.get('/uploadrecipe', (req, res) => {
  if (req.user) {
    res.render('recipeUpload', { user: req.user });
  }
});
router.get('/recipeLiked', async (req, res) => {
  if (req.user) {
    try {
      // Retrieve the liked recipe object IDs
      const likedRecipeIds = req.user.likedRecipes;

      // Fetch the liked recipes from the database
      const likedRecipes = await Recipe.find({ _id: { $in: likedRecipeIds } });

      res.render('home', { currentUser: req.user, posts: likedRecipes });
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
});

router.get('/recipeSaved', async (req, res) => {
  if (req.user) {
    try {
      // Retrieve the saved recipe object IDs
      const savedRecipeIds = req.user.savedRecipes;

      // Fetch the saved recipes from the database
      const savedRecipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

      res.render('home', { currentUser: req.user, posts: savedRecipes });
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
router.get('/home', (req, res) => {
  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('home', { currentUser: req.user, posts: result });
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/explore', (req, res) => {
  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('explore', { currentUser: req.user, posts: result });
      });
  } else {
    res.redirect('/login');
  }
});
router.get('/search_recipe', (req, res) => {
  if (req.user) {
    Recipe.find()
      .then(result => {
        res.render('search_recipe', { currentUser: req.user, posts: result });
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/category', (req, res) => {
  const category = req.query.category; // Get the category from the URL parameter

  if (req.user) {
    Recipe.find({ category }) // Filter the recipes by category
      .then(result => {
        res.render('category', { currentUser: req.user, posts: result, category });
      })
      .catch(error => {
        console.error(error);
        // Handle the error appropriately
      });
  } else {
    res.redirect('/login');
  }
});

router.get('/contact',userController.renderContact);
router.get('/user_profile',userController.renderUserProfile);
router.get('/user_account',userController.renderUserAccount);
//Define the route to handle the delete request
router.delete('/deleteAccount', function(req, res) {
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
  const {oldPassword } = req.body;

  try {
    // Retrieve the current user's password from the database
    const user = await User.findById(req.user._id); // Assuming you have the authenticated user's ID available in req.user.id

    if (!user) {console.log("errorrr!!!!");

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



router.put('/updateFirstName', function(req, res) {
    // Get the updated first name from the request body
    const updatedFirstName = req.body.firstName;
    const updatedLastName = req.body.lastName;
    const updatedStatus = req.body.status;
    const updatedUserName = req.body.username;
    const userId = req.user._id;
    if(updatedFirstName==null){
      console.log("undefind!");
    }
    else{
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
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch(error => {
      // Handle any errors that occur during the update
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });

});
router.post('/follow', (req, res) => {
  const { uploader, current_user } = req.body;
  const redirectUrl = req.headers.referer || '/';
  User.findById(current_user)
      .then(user => {
          user.followedUsers.push(uploader);
          return user.save();
      })
      .catch(err => {
          console.log(err);
      });
  User.findById(uploader)
      .then(user => {
          user.followers.push(uploader);
          // Retrieve the saved recipe object IDs
          const followRecipeIds = req.user.followedUsers;

          // Fetch the saved recipes from the database
          const followRecipe =  Recipe.find({ _id: { $in: followRecipeIds } });
          res.redirect('/home');
          return user.save();
      })
      .catch(err => {
          console.log(err);
      });
});

router.post('/unfollow', (req, res) => {
  const { uploader, current_user } = req.body;
  const redirectUrl = req.headers.referer || '/';
  User.findById(current_user)
      .then(user => {
          user.followedUsers.pop(uploader);
          return user.save();
      })
      .catch(err => {
          console.log(err);
      });
  User.findById(uploader)
      .then(user => {
          user.followers.pop(current_user);
          res.redirect('/home');
          return user.save();
      })
      .catch(err => {
          console.log(err);
      });

});

module.exports = router;
