const express = require('express');

const app = express();

const port = 8000;


app.get('/', (req, res) => {
    res.end('welcome chat');
})

app.listen(port, () => {
    console.log('this is tracking requests');
})