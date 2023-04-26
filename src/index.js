import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.sendFile('./public/home_page.html', { root: __dirname });
    console.log(__dirname);
});
app.listen(port, () => {
    console.log(`Server is up and running at port: ${port}`);
});
