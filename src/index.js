const express = require('express');
const app = express();
const path = require('path');
const connectToDatabase = require('./db/db');
const routes = require('./Routes/routes');
const authRouter = require('./Routes/authRoutes');
const recipeRouter = require('./Routes/recipe');
const viewRecipeRoute = require('./Routes/viewRecipeRout');
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const passportLocalMongoose = require("passport-local-mongoose");
const User = require('./models/users');
const port = process.env.PORT || 3000;
// Connect to MongoDB and start the server
connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
}))
  


passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Assuming email is the field for the username
    passwordField: 'password' // Assuming password is the field for the password
  },
  async function(email, password, done) {
    try {
      // Perform the search using Mongoose by email and password
      const user = await User.findOne({ email, password });
      console.log(user)
      if (!user) {
        console.log('no user');
        return done(null, false, { message: 'Invalid email or password' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(error => {
        done(error);
      });
  });
app.use(passport.initialize());
app.use(passport.session());
    
// Register routes
app.use('/viewRecipe', viewRecipeRoute);
app.use('/', routes);
//app.use('/auth', authRouter);
app.use('/recipe', recipeRouter);
// Handle sign-in request
app.post('/auth/signin', passport.authenticate('local', {
    
    successRedirect: "/about",
    failureRedirect: "/log_in"
})
);
app.get("/home", isLoggedIn, function (req, res) {
    res.render("home");
    });
// Handle sign-up request
app.post('/auth/signup',(req, res) => {
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
            res.render('user_home_page',{user:newUser});
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
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/log_in");
    }
app.get('/try', (req, res) => {
    // Handle GET request for '/users' route
    // Retrieve data, perform operations, etc.
    // Send a response back to the client
    res.render('user_home_page');
});
