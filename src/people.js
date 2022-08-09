const mongodb = require('./connectDB')();

module.exports = {
    async getUnfriendPeople(user) {
        const users = mongodb.collection('users');
        
        var ObjectId = require('mongodb').ObjectId;
        let authed_user = await users.findOne({_id: new ObjectId(user._id)});
        let friends_list = authed_user.friends;
        let friends_ids = [];
        friends_ids.push(new ObjectId(user._id))
        friends_list.map(friend => friends_ids.push(new ObjectId(friend.id)))

        let unfriend_people = await users.find({_id: {$nin: friends_ids}});
        return unfriend_people.toArray();
    },

    async getFriendPeople(user) {
        const users = mongodb.collection('users');
        
        var ObjectId = require('mongodb').ObjectId;
        let authed_user = await users.findOne({_id: new ObjectId(user._id)});
        let friends_list = authed_user.friends;
        let friends_ids = [];
        friends_list.map(friend => friends_ids.push(new ObjectId(friend.id)))

        let friend_people = await users.find({_id: {$in: friends_ids }});
        return friend_people.toArray();
    },

    async getRequestsPeople(user) {
        const users = mongodb.collection('users');
        var ObjectId = require('mongodb').ObjectId;
        let authed_user = await users.findOne({_id: new ObjectId(user._id)});
        let friendship_requests_list = authed_user.friendship_requests;
        let users_ids = [];
        friendship_requests_list.map(requestUser => users_ids.push(new ObjectId(requestUser.id)))

        let people = await users.find({_id: {$in: users_ids }});
        return people.toArray();
    },


    async requestFriendship(authed_user, user_id) {
        const users = mongodb.collection('users');

        var ObjectId = require('mongodb').ObjectId;
        await users.updateOne({_id: new ObjectId(user_id)}, {$push: {"friendship_requests": {id: new ObjectId(authed_user._id)} }});
        return true;
    },

    async removeFriendship(authed_user, user_id) {
        const users = mongodb.collection('users');

        var ObjectId = require('mongodb').ObjectId;
        await users.updateOne({_id: new ObjectId(authed_user._id)}, {$pull: {"friends": {id: new ObjectId(user_id)} }})
        let index = authed_user.friends.findIndex((friend) => friend.id == user_id);
        authed_user.friends.splice(index, 1);
        return authed_user.friends;
    },

    async acceptFriendship(authed_user, user_id) {
        const users = mongodb.collection('users');
        var ObjectId = require('mongodb').ObjectId;
    
        await users.updateOne(
            {_id: new ObjectId(authed_user._id)},
            {$pull: {friendship_requests: {id: new ObjectId(user_id)} }}
        );
        await users.updateOne(
            {_id: new ObjectId(authed_user._id)},
            {$push: {friends: {id: new ObjectId(user_id)} }}
        );
        await users.updateOne(
            {_id: new ObjectId(user_id)},
            {$push: {friends: {id: new ObjectId(authed_user._id)} }}
        );
        authed_user.friends.push({id: new ObjectId(user_id)});
        return authed_user.friends;
    },
    
    async declineFriendship(authed_user, user_id) {
        const users = mongodb.collection('users');

        var ObjectId = require('mongodb').ObjectId;
        await users.updateOne(
            {_id: new ObjectId(authed_user._id)}, 
            {$pull: {friendship_requests: {id: new ObjectId(user_id)}}}
        );

        let index = authed_user.friendship_requests.findIndex((friend) => friend.id == user_id);
        authed_user.friendship_requests.splice(index, 1);
        return authed_user.friendship_requests;
    }
}