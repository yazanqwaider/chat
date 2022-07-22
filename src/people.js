const mongo = require('./connectDB');

module.exports = {
    async getUnfriendPeople(user) {
        const client = mongo();
        const database = client.db('chat_db');
        const users = database.collection('users');
        
        var ObjectId = require('mongodb').ObjectId;
        let friends_list = (user.friends)? user.friends : [];
        let friends_ids = [];
        friends_ids.push(new ObjectId(user._id))
        friends_list.map(friend_id => friends_ids.push(new ObjectId(friend_id)))

        let unfriend_people = await users.find({_id: {$nin: friends_ids }});
        return unfriend_people.toArray();
    },

    async getFriendPeople(user) {
        const client = mongo();
        const database = client.db('chat_db');
        const users = database.collection('users');
        
        var ObjectId = require('mongodb').ObjectId;
        let friends_list = (user.friends)? user.friends : [];
        let friends_ids = [];
        friends_list.map(friend_id => friends_ids.push(new ObjectId(friend_id)))

        let friend_people = await users.find({_id: {$in: friends_ids }});
        return friend_people.toArray();
    },

    async addFriend(authed_user, user_id) {
        const client = mongo();
        const database = client.db('chat_db');
        const users = database.collection('users');

        var ObjectId = require('mongodb').ObjectId;
        await users.updateOne({_id: new ObjectId(authed_user._id)}, {$push: {"friends": new ObjectId(user_id)}})
        authed_user.friends.push(user_id);
        return authed_user.friends;
    },

    async removeFriend(authed_user, user_id) {
        const client = mongo();
        const database = client.db('chat_db');
        const users = database.collection('users');

        var ObjectId = require('mongodb').ObjectId;
        await users.updateOne({_id: new ObjectId(authed_user._id)}, {$pull: {"friends": new ObjectId(user_id)}})
        let index = authed_user.friends.findIndex((friend_id) => friend_id == user_id);
        authed_user.friends.splice(index, 1);
        return authed_user.friends;
    }
}