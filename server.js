const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const cookieParser = require('cookie-parser');
var multer = require('multer');
require('dotenv').config();

const port = process.env.PORT || 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(cookieParser());


/** Routes */
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
app.use(webRoutes);
app.use(apiRoutes);

const server = http.createServer(app);
const io = new Server(server);


let users = new Map();
io.on('connection', socket => {
    socket.on('connected', function(userId) {
        users[userId] = socket.id;
    });

    socket.on('messageSended', function(messageObject) {
        if(users[messageObject.receiver_id]) {
            socket.to(users[messageObject.receiver_id]).emit('messageReceived', JSON.stringify(messageObject));
        }
    });

    socket.on('typingNow', function(statusObject) {
        if(users[statusObject.receiver_id]) {
            socket.to(users[statusObject.receiver_id]).emit('typingNow', JSON.stringify(statusObject));
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('connected closed');
    });
});

server.listen(port, () => {
    console.log(`Listening to port ${port}`);
})