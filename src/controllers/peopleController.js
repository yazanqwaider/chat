const jwt = require('jsonwebtoken');

module.exports.people_get = async function(req, res) {
    const people = require('../people');
    let authUser = res.locals.user;
    let unfriendPeople = await people.getUnfriendPeople(authUser);
    res.render('people', {unfriendPeople: unfriendPeople});
}

module.exports.api_people_get = async function(req, res) {
    const people = require('../people');
    let authUser = res.locals.user;
    let list = [];

    if(req.query.type == 'explore') {
        list = await people.getUnfriendPeople(authUser);
    }
    else if(req.query.type == 'friends') {
        list = await people.getFriendPeople(authUser);
    }
    else if(req.query.type == 'requested') {
        list = await people.getRequestsPeople(authUser);
    }
    res.json({list: list});
}


module.exports.api_people_post = async function(req, res) {
    const people = require('../people');
    let authUserId = jwt.decode(req.cookies.token);
    let response = null;

    if(req.params.required_action == 'request') {
        response = await people.requestFriendship(authUserId, req.params.id);
    }
    else if(req.params.required_action == 'remove'){
        response = await people.removeFriendship(authUserId, req.params.id);
    }
    res.json(response);
}

module.exports.api_response_friendship_post = async function(req, res) {
    const people = require('../people');
    let response = null;
    let authUserId = jwt.decode(req.cookies.token);

    if(req.params.required_action == 'accept') {
        user.friends = await people.acceptFriendship(authUserId, req.params.id);
    }
    else if(req.params.required_action == 'decline'){
        user.friendship_requests = await people.declineFriendship(authUserId, req.params.id);
    }
    res.json(response);
}
