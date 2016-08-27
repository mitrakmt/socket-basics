var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Send current users to provided socket
function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function (socketId) {
    var userInfo = clientInfo[socketId];

    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current Users: ' + users.join(', '),
    timestamp: moment().valueOf()
  });
}

// This isn't currently working
function displayLiveRooms(socket) {
  var info = clientInfo[socket.id];
  var rooms = [];

  if (typeof info === 'undefined') {
    return;
  }

  Object.keys(clientInfo).forEach(function (socketId) {
    var userInfo = clientInfo[socketId];

    if (rooms.indexOf(userInfo.room) !== -1) {
      rooms.push(userInfo.room);
      console.log(userInfo.room);
    }
  });
}

io.on('connection', function (socket) {
  console.log("User connected via socket.io");
  displayLiveRooms(socket);

  socket.on('disconnect', function () {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      io.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left.',
        timestamp: moment().valueOf()
      });
      delete clientInfo[socket.id];
    }
  });

  socket.on('joinRoom', function (request) {
    clientInfo[socket.id] = request;
    socket.join(request.room);
    socket.broadcast.to(request.room).emit('message', {
      name: 'System',
      text: request.name + ' has joined.',
      timestamp: moment().valueOf()
    })
  });

  socket.on('message', function (message) {
    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Welcome to the chat application!',
    timestamp: moment.valueOf()
  });
})

http.listen(PORT, function () {
  console.log("Server started!");
});
