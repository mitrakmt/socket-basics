var socket = io();

socket.on('connect', function() {
  console.log("connected to Socket.io server");
});

socket.on('message', function (message) {
  jQuery('.messages').append('<p>' + message.text + '</p>')
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val()
  });

  $message.val('');
});
