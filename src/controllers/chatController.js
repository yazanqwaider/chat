const jwt = require('jsonwebtoken');

module.exports.chats_get = async function(req, res) {
    const mongodb = require('../connectDB')();
    let friendsIds = [];

    let authUser = res.locals.user;
    let usersCollection = mongodb.collection('users');
    authUser = await usersCollection.findOne({_id: authUser._id });

    if(authUser.friends) {
        authUser.friends.forEach(function(friend) {
            friendsIds.push(friend.id);
        });
    }

    let friends = await usersCollection.find({_id: {$in: friendsIds}}).toArray();
    res.render('chats', {friends: friends});
}


module.exports.api_get_messages = async function(req, res) {
    const mongodb = require('../connectDB')();
    let chats = mongodb.collection('chats');
    let ObjectId = require('mongodb').ObjectId;

    let authUser = res.locals.user;
    let friendUserId = req.params.user_id;
    
    let users = mongodb.collection('users');
    authUser = await users.findOne({_id: authUser._id });
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
        
        let senderUserChat = {_id: new ObjectId(friendUserId), chatId: createdChat.insertedId};
        let receiverUserChat = {_id: new ObjectId(authUser._id), chatId: createdChat.insertedId};
        users.updateOne(
            {_id: new ObjectId(authUser._id)}, 
            {$push: {chats: senderUserChat}}
        );

        users.updateOne(
            {_id: new ObjectId(friendUserId)}, 
            {$push: {chats: receiverUserChat}}
        );

        chat = await chats.findOne({_id: createdChat.insertedId});
    }

    res.json({chat: chat});
}


module.exports.api_post_messages = async function(req, res) {
    const mongodb = require('../connectDB')();
    let chats = mongodb.collection('chats');
    let ObjectId = require('mongodb').ObjectId;
    let authUserId = jwt.decode(req.cookies.token);
    
    let images = [];
    let audio_record_path = null;

    if(req.body.type == 'audio') {
        const fs = require("fs")
        const uniqueSuffix = req.params.chat_id + '-' +  Date.now();
        audio_record_path = `messages/audios/${uniqueSuffix}.webm`;

        const buffer = Buffer.from(
            req.body.content_audio.split('base64,')[1], // content after base64,
            'base64'
        );

        fs.writeFile(`public/${audio_record_path}`, buffer, (err) => {
            console.log(err);
        });
    }

    else if(req.body.type == 'image') {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.json({status: false, statusMessage: 'No files were uploaded.'});
            return;
        }
        
        let imagesFiles = req.files.images;
        imagesFiles = Array.isArray(imagesFiles)? imagesFiles : [imagesFiles];

        let imgIndex = 1;
        imagesFiles.forEach((imageFile) => {
            const uniqueSuffix = req.params.chat_id + '-' +  Date.now() + '-' + (imgIndex++);
            const extension = imageFile.mimetype.split('/')[1];
            const imagePath = 'messages/images/' + uniqueSuffix + '.' + extension;           
        
            imageFile.mv(`public/${imagePath}`, function(err) {
                if (err) {
                    return res.json({status: false, statusMessage: 'Error has happend !'});
                }

                images.push(imagePath);
            });
        });
    }

    let newMessage = {
        user_sender: new ObjectId(authUserId),
        type: req.body.type,
        text: req.body.content_text,
        images: images,
        audio_path: audio_record_path,
        created_at: new Date()
    };

    await chats.updateOne({_id: new ObjectId(req.params.chat_id)}, { $push: {messages: newMessage}});
    res.json({status: true, message: newMessage});
}
