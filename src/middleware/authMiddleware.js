const jwt = require('jsonwebtoken');

module.exports.checkAuthentication = function(req, res, next) {
    let token = req.cookies.token;
    if(token && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

module.exports.checkApiAuthentication = function (req, res, next) {
    let token = req.cookies.token;
    if(token && token) {
        if(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
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

module.exports.checkGuest = function(req, res, next) {
    if(!req.cookies.token) {
        next();
    }
    else {
        res.redirect('/');
    }
}
