module.exports = function() {
    const uri = "mongodb+srv://" + process.env.MONGODB_SECRET + "@cluster0.y0xm4.mongodb.net/?retryWrites=true&w=majority";
    const {MongoClient}  = require('mongodb');
    const client = new MongoClient(uri);
    return client.db('chat_db');
}