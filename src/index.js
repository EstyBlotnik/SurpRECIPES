const express = require('express');

const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/users');

const port = process.env.PORT || 3000;

// connect to mongoDB
const dbURI = 'mongodb+srv://pm:1234567890@projectmanagement.srxmxoq.mongodb.net/project_management?retryWrites=true&w=majority';
mongoose.connect(dbURI).then((result) => app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
    console.log(result);
})).catch((err) => console.log(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// mongoose & mongo tests
app.get('/add-user', (req, res) => {
    const user = new User({
        name: 'new blog',
        id: 'about my new blog',
        age: 'more about my new blog',
    });
    user.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});
app.get('/all-blogs', (req, res) => {
    User.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/log_in.ejs', (req, res) => {
    res.render('log_in');
});
app.get('/about', (req, res) => {
    res.render('about');
});
