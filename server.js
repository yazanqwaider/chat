const express = require('express');
const path = require('path');
const session = require('express-session')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    saveUninitialized: false,
    resave: false
}))


/** Routes */
app.get('/', (req, res) => {
    res.end('welcome chat')
})

app.get('/login', checkGuest, (req, res) => {
    res.render('auth/login');
})

app.post('/login', async (req, res) => {
    const auth = require('./src/auth');
    const result = await auth.login(req.body.username, req.body.password);

    req.session.regenerate(function(){
        req.session.token = result.token;
        res.json(result);
    });
})

app.get('/signup', checkGuest, (req, res) => {
    res.render('auth/signup');
})

app.post('/signup', async (req, res, next) => {
    const auth = require('./src/auth');
    const userData = {username: req.body.username, password: req.body.password};
    const result = await auth.signup(userData);
    req.session.regenerate(function(){
        req.session.token = result.token;
        res.json(result);
    });
})

app.get('/chats', checkAuthentication, (req, res) => {
    res.render('chats');
});


/** Middlewares */
function checkAuthentication(req, res, next) {
    let token = req.session.token;
    if(token && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
        next();
    }
    else {
        res.status(401).send('You don\'t have authorization credentials.');
    }
}

function checkApiAuthentication(req, res, next) {
    let token = req.headers['Authorization'];
    if(token && token.split(' ')[1]) {
        if(jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET)) {
            next();
        }
        else {
            res.status(401).send('You don\'t have authorization credentials.');
        }
    }
    else {
        res.status(401).send('You don\'t have authorization credentials.');
    }
}

function checkGuest(req, res, next) {
    if(!req.session.token) {
        next();
    }
    else {
        res.redirect('/');
    }
}

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})