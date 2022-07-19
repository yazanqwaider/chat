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
    }
}