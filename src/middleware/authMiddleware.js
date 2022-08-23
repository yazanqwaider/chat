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
    if(token) {
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


module.exports.getUserObject = async function(req, res, next) {
    let token = req.cookies.token;
    let authed_user = null;
    if(token) {
        if(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            const mongodb = require('../connectDB')();
            var ObjectId = require('mongodb').ObjectId;
            let user_id = jwt.decode(token);
            const users = mongodb.collection('users');
            authed_user = await users.findOne({_id: new ObjectId(user_id)});
        }
    }

    res.locals.user = authed_user;
    next();
}