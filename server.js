const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session')
const { Server } = require("socket.io");
require('dotenv').config();


const port = 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    saveUninitialized: false,
    resave: false
}))


/** Routes */
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
app.use(webRoutes);
app.use(apiRoutes);


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})


const server = http.createServer(app);
const io = new Server(server);
