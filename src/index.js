
const express = require('express');
const app = express();
const path = require("path");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
 
    res.render('index');
});
app.get('/log_in.ejs', (req, res) => {
 
    res.render('log_in');
});

app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
});
