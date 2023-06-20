// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.write("Funzia");
//     res.end();
// });

// server.listen(3080);

const express = require('express');

const app = express();

app.get('/test', function(req, res) {
    res.send('SEZIONE SUPER SEGRETA');
});

app.get('/', function(req, res) {
    res.send('Home page');
});

app.listen(3080);