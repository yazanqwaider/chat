const mongodb = require('./connectDB')();
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    async checkUserExist(username) {
        const users = mongodb.collection('users');
        const user = await users.findOne({username: username+""});
        return user;
    },

    generateAccessToken(user_id) {
        return jwt.sign(user_id.toString(), process.env.ACCESS_TOKEN_SECRET);
    },

    async login(username, password) {
        const user = await this.checkUserExist(username);
        if(user) {
            const bcrypt = require('bcrypt');
            let is_valid_password = await bcrypt.compare(password, user.password);

            if(is_valid_password) {
                return {status: true, user: user, token: this.generateAccessToken(user._id)};
            }
        }
        return {status: false, message: "Your data is invalid !"};
    },

    async loginById(id) {
        const users = mongodb.collection('users');
        const user = await users.findOne({_id: id});
        return this.generateAccessToken(user._id);
    },

    async signup(userData) {
        let user = await this.checkUserExist(userData.username);

        if(user == null) {
            try {
                const users = mongodb.collection('users');

                const bcrypt = require('bcrypt');
                const salt = await bcrypt.genSalt();
                let hashedPassword = await bcrypt.hash(userData.password, salt);

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
        return {status: true, user: user, token: this.generateAccessToken(user._id)};
    }
}