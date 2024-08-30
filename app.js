const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'public/version.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading version file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const version = JSON.parse(data).version;
        res.render('index', { version });
    });
});

app.listen(8000, () => {
    console.log('Starting development server..');
    console.log('Server is running on http://localhost:8000');
});
