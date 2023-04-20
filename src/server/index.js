import express from 'express';

const port = process.env.PORT || 3000;
const app = express();
// const path = require('path');
// const filePath = path.join(__dirname, 'public', 'home_page.html');

app.get('/', (req, res) => {
    console.log('A new request has arrived to index.js');
    res.sendFile('/home_page.html', { root: '.' });
    // res.sendFile(__dirname + '/home_page.html');
    res.send('Hello from the server main page');
});

app.get('/hello', (req, res) => {
    console.log('A new request has arrived to /hello');
    res.send({
        message: 'Hello from the server!',
    });
});

app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
});
