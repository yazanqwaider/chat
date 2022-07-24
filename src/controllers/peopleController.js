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
    res.json({list: list});
}


module.exports.api_people_post = async function(req, res) {
    const people = require('../people');
    let response = null;

    if(req.params.required_action == 'add') {
        response = await people.addFriend(req.session.user, req.params.id);
    }
    else if(req.params.required_action == 'remove'){
        response = await people.removeFriend(req.session.user, req.params.id);
    }
    
    let user = req.session.user;
    user.friends = response;
    req.session.save(function(){
        req.session.user = user;
        res.json(response);
    });
}