const express = require('express');

const app = express();
const path = require('path');
const connectToDatabase = require('./db/db');
const routes = require('./Routes/routes');
const authRouter = require('./Routes/authRoutes');
const recipeRouter = require('./Routes/recipe');

const port = process.env.PORT || 5000;

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

// Register routes
app.use('/', routes);
app.use('/auth', authRouter);
app.use('/recipe', recipeRouter);

app.get('/try', (req, res) => {
    // Handle GET request for '/users' route
    // Retrieve data, perform operations, etc.
    // Send a response back to the client
    res.render('user_home_page');
});
