const mongodb = require('./connectDB')();
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    async checkUserExist(username) {
        const users = mongodb.collection('users');
        const user = await users.findOne({username: username+""});
        return user;
    },

    generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    },

    async login(username, password) {
        const user = await this.checkUserExist(username);
        if(user) {
            const enteredPassword = require('crypto').createHash('sha256').update(password).digest('base64');
            if(user.password == enteredPassword) {
                return {status: true, user: user, token: this.generateAccessToken(user)};
            }
        }
        return {status: false, message: "Your data is invalid !"};
    },

    async loginById(id) {
        const users = mongodb.collection('users');
        const user = await users.findOne({_id: id});
        return this.generateAccessToken(user);
    },

    async signup(userData) {
        let user = await this.checkUserExist(userData.username);

        if(user == null) {
            try {
                const users = mongodb.collection('users');

                const hashedPassword = require('crypto').createHash('sha256').update(userData.password).digest('base64');
                userData.password = hashedPassword;
                userData.friends = [];
                userData.friendship_requests = [];
                const insertedUser = await users.insertOne(userData);
                user = {
                    _id: insertedUser.insertedId, 
                    username: userData.username, 
                    password: userData.password,
                    friends: userData.friends,
                    friendship_requests: userData.friendship_requests
                }
            } catch (error) {
                console.log(error);
                return null;
            }
        }
        else {
            return {status: false, message: 'This account have already exists, please try login.'};
        }
        return {status: true, user: user, token: this.generateAccessToken(user)};
    }
}