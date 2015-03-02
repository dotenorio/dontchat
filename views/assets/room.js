var loc = window.location;
var protocol = loc.protocol;
var host = loc.host;
var locReplace = protocol + '//' + host + '/';
var room = loc.toString().replace(locReplace, '');

var socket = io();

function scrollTop() {
  var height = $("#messages").height();
  $('body').scrollTop(height);
}

$( window ).resize(function() {
  scrollTop();
});

$('form').submit(function(){
  var messageObj = {
    nick: localStorage.getItem('nick'),
    message: $("#m").val()
  }
  socket.emit('chat message', messageObj);
  $('#m').val('');
  return false;
});

$('#m').on('keyup', function(){
  nick = localStorage.getItem('nick');
  if ($(this).val().length > 0) {
    socket.emit('chat writing', nick);
  } else {
    $('#log-' + nick).remove();  
  }
});

socket.emit('chat enter room', room);

socket.on('chat message', function(msgObj){
  var msg = '<b>' + msgObj.nick + ':</b> ' + msgObj.message;
  $('#messages').append($('<li>').html(msg));
  scrollTop();
  $('#log-' + msgObj.nick).remove();
});

socket.on('chat nick', function(nick){
  localStorage.setItem('nick', nick);
});

socket.on('chat writing', function(nick){
  var id = 'log-' + nick;
  if ( $("#" + id).size() === 0 ) {
    $('#log').append('<li id="' + id + '">' + nick + ' está digitando...</li>');
    $("#" + id).delay(10000).fadeOut(function(){
      $(this).remove();
    });
  }
});