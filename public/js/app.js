var socket = io();

socket.on('connect', function() {
  console.log("connected to Socket.io server");
});

socket.on('message', function (message) {
  console.log('New message:');
  console.log(message.text);
});
