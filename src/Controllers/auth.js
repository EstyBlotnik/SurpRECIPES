const User = require('../models/users');

// Handle sign-in request
exports.signin = (req, res) => {
  const { email, password } = req.body;

  // Find user by email and password
  User.findOne({ email, password })
    .then(user => {
      if (user) {
        // Store user details in the session
        //req.session.user = user;
        res.status(200).json({ message: 'Sign in successful' });

      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch(error => {
      console.error('Sign in error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};
// Handle sign-up request
exports.signup = (req, res) => {
  const { email, password, username } = req.body;
  const level = 'starter';
  // Check if the user already exists in the database
  User.findOne({ $or: [{ email }, { username }] })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.email === email) {
          res.status(400).json({ error: 'Email already exists' });
        
        }
      } else {
        // Create a new user
        const newUser = new User({ email, password, username ,level});

        // Save the user to the database
        newUser.save()
          .then(() => {
            res.status(200).json({ message: 'Sign up successful' });
          })
          .catch(error => {
            console.error('Sign up error:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
    })
    .catch(error => {
      console.error('User lookup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

