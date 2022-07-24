const jwt = require('jsonwebtoken');

module.exports.checkAuthentication = function(req, res, next) {
    let token = req.session.token;
    if(token && jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
        next();
    }
    else {
        res.status(401).send('You don\'t have authorization credentials.');
    }
}

module.exports.checkApiAuthentication = function (req, res, next) {
    let token = req.headers['authorization'];
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

module.exports.checkGuest = function(req, res, next) {
    if(!req.session.token) {
        next();
    }
    else {
        res.redirect('/');
    }
}
