const express = require('express');
const path = require('path');

const app = express();

const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());


/** Routes */
app.get('/', (req, res) => {
    res.end('welcome chat')
})

app.get('/login', (req, res) => {
    res.render('auth/login');
})

app.post('/login', async (req, res) => {
    const auth = require('./src/auth');
    const result = await auth.login(req.body.username, req.body.password);
    res.json(result);
})

app.get('/signup', (req, res) => {
    res.render('auth/signup');
})

app.post('/signup', async (req, res) => {
    const auth = require('./src/auth');
    const userData = {username: req.body.username, password: req.body.password};
    const result = await auth.signup(userData);
    res.json(result);
})

app.listen(port, () => {
    //
})