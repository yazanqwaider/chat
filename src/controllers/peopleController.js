module.exports.people_get = async function(req, res) {
    const people = require('../people');
    let authUser = JSON.parse(req.cookies.user);
    let unfriendPeople = await people.getUnfriendPeople(authUser);
    res.render('people', {unfriendPeople: unfriendPeople});
}

module.exports.api_people_get = async function(req, res) {
    const people = require('../people');
    let authUser = JSON.parse(req.cookies.user);
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
    let authUser = JSON.parse(req.cookies.user);
    let response = null;

    if(req.params.required_action == 'request') {
        response = await people.requestFriendship(authUser, req.params.id);
    }
    else if(req.params.required_action == 'remove'){
        response = await people.removeFriendship(authUser, req.params.id);
    }
    res.json(response);
}

module.exports.api_response_friendship_post = async function(req, res) {
    const people = require('../people');
    let response = null;
    let authUser = JSON.parse(req.cookies.user);

    if(req.params.required_action == 'accept') {
        user.friends = await people.acceptFriendship(authUser, req.params.id);
    }
    else if(req.params.required_action == 'decline'){
        user.friendship_requests = await people.declineFriendship(authUser, req.params.id);
    }
    res.json(response);
}
