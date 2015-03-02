var messages = $('#messages');
var form = $('form');
var input = $('#m');
var log = $('#log');
var scrollTop = function() {
  var height = messages.height();
  $('body').scrollTop(height);
}

$(function() {

  $(window).resize(function() {
    scrollTop();
  });

  form.submit(function() {
    var messageObj = {
      nick: localStorage.getItem('nick'),
      message: input.val()
    }
    socket.emit('chat message', messageObj);
    input.val('');
    return false;
  });

  input.on('keyup', function() {
    nick = localStorage.getItem('nick');
    if ($(this).val().length > 0) {
      socket.emit('chat writing', nick);
    } else {
      $('#log-' + nick).remove();  
    }
  });

});

///////////////////////////

var socket = null;

(function () {

  var onChatMessage = function(msgObj) {
    var msg = '<b>' + msgObj.nick + ':</b> ' + msgObj.message;
    messages.append($('<li>').html(msg));
    scrollTop();
    $('#log-' + msgObj.nick).remove();
  };

  var onChatNick = function(nick){
    localStorage.setItem('nick', nick);
  };

  var onChatWriting = function(nick){
    var id = 'log-' + nick;
    if ( $('#' + id).size() === 0 ) {
      log.append('<li id="' + id + '">' + nick + ' está digitando...</li>');
      $('#' + id).delay(10000).fadeOut(function() {
        $(this).remove();
      });
    }
  };

  var emitChatEnterRoom = function() {
    var loc = window.location;
    var protocol = loc.protocol;
    var host = loc.host;
    var locReplace = protocol + '//' + host + '/';
    var room = loc.toString().replace(locReplace, '');
    return room;
  }

  var connectToSocketIo = function () {
    socket = io();
    socket.emit('chat enter room', emitChatEnterRoom);
    socket.on('chat message', onChatMessage);
    socket.on('chat nick', onChatNick);
    socket.on('chat writing', onChatWriting);
  };

  connectToSocketIo();

})();