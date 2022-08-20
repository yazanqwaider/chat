module.exports.login_get = function (req, res) {
    res.render('auth/login');
}

module.exports.login_post = async function(req, res) {
    const auth = require('../auth');
    const result = await auth.login(req.body.username, req.body.password);

    const expire_date = 1000 * 60 * 60 * 24 * 3;
    res.cookie("token", result.token, {maxAge: expire_date, httpOnly: false});
    res.cookie("user", JSON.stringify(result.user), {maxAge: expire_date});
    res.json(result);
}


module.exports.signup_get = function(req, res) {
    res.render('auth/signup');
};

module.exports.signup_post = async function(req, res) {
    const auth = require('../auth');
    const userData = {username: req.body.username, password: req.body.password};

    const result = await auth.signup(userData);
    const expire_date = 1000 * 60 * 60 * 24 * 3;
    res.cookie("token", result.token, {maxAge: expire_date, httpOnly: false});
    res.cookie("user", JSON.stringify(result.user), {maxAge: expire_date});
    res.json(result);
}
