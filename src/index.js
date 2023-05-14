const express = require('express');

const app = express();
const path = require('path');
const connectToDatabase = require('./db/db');
const routes = require('./Routes/routes');

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Register routes
app.use('/', routes);
