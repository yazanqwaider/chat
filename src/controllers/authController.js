module.exports.login_get = function (req, res) {
    res.render('auth/login');
}

module.exports.login_post = async function(req, res) {
    const auth = require('../auth');
    const result = await auth.login(req.body.username, req.body.password);

    req.session.regenerate(function(){
        req.session.token = result.token;
        req.session.user = result.user;
        res.json(result);
    });
}


module.exports.signup_get = function(req, res) {
    res.render('auth/signup');
};

module.exports.signup_post = async function(req, res) {
    const auth = require('../auth');
    const userData = {username: req.body.username, password: req.body.password};
    const result = await auth.signup(userData);
    req.session.regenerate(function(){
        req.session.token = result.token;
        req.session.user = result.user;
        res.json(result);
    });
}
