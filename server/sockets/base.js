'use strict';

function socketListener(io) {
    io.on('connection', function (socket) {
        var addedUser = false;

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (username) {
            if (addedUser) {
                return;
            }

            // we store the username in the socket session for this client
            console.log(username + " connected to io");
            socket.username = username;
        });

        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
            console.log("get new message");

            // we tell the client to execute 'new message'
            io.emit('new message', {
                username: socket.username,
                message: data
            });
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
            io.emit('typing', {
                username: socket.username
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
            io.emit('stop typing', {
                username: socket.username
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function() {
            console.log(socket.username + " disconnected from io");
        });
    });
}

module.exports = socketListener;