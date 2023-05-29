const express = require('express');
const router = express.Router();
const userController = require('../Controllers/controllers');
const User = require('../models/users');
const email = 'adi@gmail.com';

router.get('/', userController.renderIndex);
router.get('/log_in', userController.renderLogIn);
router.get('/about', userController.renderAbout);
router.get('/contact',userController.renderContact);
router.get('/user_profile',userController.renderUserProfile);
router.get('/user_account',userController.renderUserAccount);

router.put('/updateFirstName', function(req, res) {
    // Get the updated first name from the request body
    
    const updatedFirstName = req.body.firstName;
    if(updatedFirstName==null){
      console.log("undefind!!!!!!!!");
    }
    else{
    console.log(updatedFirstName);}
    // Update the record in the database using a database query or an ORM
    User.findOneAndUpdate(
      { email },
      { firstName: updatedFirstName },
      { new: true } 
    )
      .then(updatedUser => {
        // Handle the updated user if needed
        res.json(updatedUser);
      })
      .catch(error => {
        // Handle any errors that occur during the update
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });

});

module.exports = router;
