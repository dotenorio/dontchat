/////////Variables//////////

var dc = {
  socket: null,
  nick: null,
  messages: $('#messages'),
  form: $('form'),
  input: $('#m'),
  _log: 'log',
  log: $('#log'),
  scrollTop: function() {
    var height = dc.messages.height();
    $('body').scrollTop(height);
  }
}

/////////jQuery//////////

$(function() {

  $(window).resize(function() {
    dc.scrollTop();
  });

  dc.form.submit(function() {
    var messageObj = {
      nick: dc.nick,
      message: dc.input.val()
    }
    dc.socket.emit('chat message', messageObj);
    dc.input.val('');
    return false;
  });

  dc.input.on('keyup', function() {
    if ($(this).val().length > 0) {
      dc.socket.emit('chat writing', dc.nick);
    } else {
      $('#' + dc._log + '-' + dc.nick).remove();  
    }
  });

});

/////////Socket.IO//////////

(function () {

  var onChatMessage = function(msgObj) {
    var msg = '<b>' + msgObj.nick + ':</b> ' + msgObj.message;
    dc.messages.append($('<li>').html(msg));
    dc.scrollTop();
    $('#' + dc._log + '-' + msgObj.nick).remove();
  };

  var onChatNick = function(nick){
    localStorage.setItem('nick', nick);
    dc.nick = nick;
  };

  var onChatWriting = function(nick){
    var id = dc._log + '-' + nick;
    if ( $('#' + id).size() === 0 ) {
      dc.log.append('<li id="' + id + '">' + dc.nick + ' está digitando...</li>');
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
    dc.socket = io();
    dc.socket.emit('chat enter room', emitChatEnterRoom);
    dc.socket.on('chat message', onChatMessage);
    dc.socket.on('chat nick', onChatNick);
    dc.socket.on('chat writing', onChatWriting);
  };

  connectToSocketIo();

})();