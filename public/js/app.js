var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
    }
    return undefined;
}

$('.room-title').text(room);

socket.on('connect', function () {
  var $rooms = $('.rooms');
  var $room = $('<li class="list-group-item"></li>')
  rooms.forEach(function(room) {
    $room.append('<p>' + room + '</p>')
  })

  socket.emit('joinRoom', {
    name: name,
    room: room
  })
});

socket.on('message', function (message) {
  var momentTimestamp = moment.utc(message.timestamp);
  var $messages = $('.messages');
  var $message = $('<li class="list-group-item"></li>')

  $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
  $message.append('<p>' + message.text + '</p>');
  $messages.append($message);
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    name: name,
    text: $message.val()
  });

  $message.val('');
});
