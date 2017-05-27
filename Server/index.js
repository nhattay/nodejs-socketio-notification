var express = require('express');
var app = express();
var path = require("path");
var mysql = require("mysql");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
app.use(express.static('public'));
/* Creating POOL MySQL connection.*/

var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'socketdemo',
    debug: false
});


// var db = require("./db");
var routes = require("../Routes/")(router, mysql, pool);

app.use('/', router);

http.listen(3000, function () {
    console.log("Listening on http://localhost:3000/");
});
var defaultRoom = 'room1', rooms = [defaultRoom],
    clients = {};
io.on('connection', function (socket) {
    console.log('We have user connected !');
    socket.room = defaultRoom;
    socket.join(defaultRoom);
    socket.on('booking', function (data) {
        // socket.broadcast.emit("booking_notify", data);
        socket.broadcast.to(socket.room).emit("booking_notify", data);
        // io.sockets.in(socket.room).emit("booking_notify", data);
    });
    socket.on('new_user', function (user) {
        clients[user.userId] = user;
    });
});
