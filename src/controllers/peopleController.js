module.exports.people_get = async function(req, res) {
    const people = require('../people');
    let unfriendPeople = await people.getUnfriendPeople(req.session.user);
    res.render('people', {unfriendPeople: unfriendPeople});
}


module.exports.api_people_get = async function(req, res) {
    const people = require('../people');
    let list = [];
    if(req.query.type == 'explore') {
        list = await people.getUnfriendPeople(req.session.user);
    }
    else if(req.query.type == 'friends') {
        list = await people.getFriendPeople(req.session.user);
    }
    else if(req.query.type == 'requested') {
        list = await people.getRequestsPeople(req.session.user);
    }
    res.json({list: list});
}


module.exports.api_people_post = async function(req, res) {
    const people = require('../people');
    let response = null;

    if(req.params.required_action == 'request') {
        response = await people.requestFriendship(req.session.user, req.params.id);
    }
    else if(req.params.required_action == 'remove'){
        response = await people.removeFriendship(req.session.user, req.params.id);
    }
    
    let user = req.session.user;
    user.friends = response;
    req.session.save(function(){
        req.session.user = user;
        res.json(response);
    });
}

module.exports.api_response_friendship_post = async function(req, res) {
    const people = require('../people');
    let response = null;

    if(req.params.required_action == 'accept') {
        response = await people.acceptFriendship(req.session.user, req.params.id);
    }
    else if(req.params.required_action == 'decline'){
        response = await people.declineFriendship(req.session.user, req.params.id);
    }
    
    let user = req.session.user;
    user.friends = response;
    req.session.save(function(){
        req.session.user = user;
        res.json(response);
    });
}
