/////////Variables and Functions//////////

var dc = {
  socket: null,
  nick: null,
  writing: [],
  messages: $('#messages'),
  form: $('#form-message'),
  input: $('#m'),
  _log: 'log',
  log: $('#log'),
  scrollTop: function() {
    var height = dc.messages.height();
    $('body').scrollTop(height);
  },
  writingLog: function() {
    var id = dc._log + '-item';
    var writingUnique = dc.writing.getUnique();
    var writingUniqueLength = writingUnique.length;
    if(writingUniqueLength > 0) {
      var estaPlural = (writingUniqueLength == 1) ? 'está' : 'estão';
      var whoWriting = writingUnique.toString();
      var lastComma = whoWriting.lastIndexOf(',');
      whoWriting = whoWriting.slice(0, lastComma) + whoWriting.slice(lastComma).replace(',', ' e ');
      whoWriting = whoWriting.replace(new RegExp(','), ', ');
      dc.log.html('<li id="' + id + '">' + whoWriting + ' ' + estaPlural + ' digitando...</li>');
      $('#' + id).delay(10000).fadeOut(function() {
        $(this).remove();
      });
    } else {
      $('#' + id).remove();
    }
  },
  writingRemoveItem: function(nick) {
    dc.writing.removeItem(nick);
    dc.writingLog();
  }
}

/////////jQuery//////////

$(function() {

  $(window).resize(function() {
    dc.scrollTop();
  });

  dc.form.submit(function() {
    var inputValue = dc.input.val();
    if (inputValue !== '') {
      var msgObj = {
        nick: dc.nick,
        message: inputValue
      }
      dc.socket.emit('chat message', msgObj);
      dc.input.val('');
    }
    return false;
  });

  dc.input.on('keyup', function() {
    if ($(this).val().length > 0) {
      dc.socket.emit('chat writing', dc.nick);
    } else {
      dc.writingRemoveItem(dc.nick);
      dc.socket.emit('chat writing remove', dc.nick);
    }
  });

});

/////////Socket.IO//////////

(function () {

  var onChatMessage = function(msgObj) {
    var msg = '<b>' + msgObj.nick + ':</b> ' + msgObj.message;
    dc.messages.append($('<li>').html(msg));
    dc.scrollTop();
    dc.writingRemoveItem(msgObj.nick);
  };

  var onChatNick = function(nick) {
    nick = localStorage.getItem('nick') || nick;
    localStorage.setItem('nick', nick);
    dc.nick = nick;
  };

  var onChatWriting = function(nick) {
    dc.writing.push(nick);
    dc.writingLog();
  };

  var onChatWritingRemove = function(nick) {
    dc.writingRemoveItem(nick);
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
    dc.socket.on('chat writing remove', onChatWritingRemove);
  };

  connectToSocketIo();

})();