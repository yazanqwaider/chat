module.exports.chats_get = async function(req, res) {
    const ObjectId = require('mongodb').ObjectId;
    let friendsIds = [];
    if(req.session.user.friends) {
        req.session.user.friends.forEach(function(friendId) {
            friendsIds.push(new ObjectId(friendId));
        })
    }

    const mongodb = require('../connectDB');
    let database = mongodb().db('chat_db');
    let users = database.collection('users');
    let friends = await users.find({_id: {$in: friendsIds}}).toArray();

    res.render('chats', {friends: friends});
}


module.exports.api_get_messages = async function(req, res) {
    let authUser = req.session.user;
    let friendUserId = req.params.user_id;

    const mongodb = require('../connectDB');
    let database = mongodb().db('chat_db');
    let chats = database.collection('chats');
    let ObjectId = require('mongodb').ObjectId;
    
    let users = database.collection('users');
    authUser = await users.findOne({_id: new ObjectId(authUser._id) });
    let authUserChats = authUser.chats;

    let chat = null;
    if(authUserChats && authUserChats.findIndex((chatItem) => new ObjectId(friendUserId).equals(chatItem._id)) != -1 ) {
        let chatIndex = authUserChats.findIndex((chatItem) => new ObjectId(friendUserId).equals(chatItem._id));
        chat = await chats.findOne({_id: new ObjectId(authUserChats[chatIndex].chatId) });
    }
    else {
        let createdChat = await chats.insertOne({
            user_1: new ObjectId(authUser._id),
            user_2: new ObjectId(friendUserId), 
            last_message: null,
        });

        let userChat = {_id: new ObjectId(friendUserId), chatId: createdChat.insertedId};
        users.updateOne(
            {_id: new ObjectId(authUser._id)}, 
            {$push: {chats: userChat}}
        );

        chat = await chats.findOne({_id: createdChat.insertedId});
        req.session.save(function() {
            req.session.user = authUser
        });
    }

    res.json({chat: chat});
}