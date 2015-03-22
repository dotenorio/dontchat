var io = module.parent.exports.io;
var crypto = module.parent.exports.crypto;
var sanitizeHtml = module.parent.exports.sanitizeHtml;

io.on('connection', function(socket) {
  var nick = crypto.createHash('sha1').update(Date()).digest('hex');
  socket.emit('chat nick', nick);
  socket.on('chat enter room', function(password) {
    socket.join(password);
    socket.on('chat message', function(msgObj) {
      msgObj.message = sanitizeHtml(msgObj.message, {
        allowedTags: [],
        allowedAttributes: []
      });
      if (msgObj.message === '')
        msgObj.message = '<b class="text-danger">EU ESTOU TENTANDO BURLAR O SISTEMA...</b>';
      io.to(password).emit('chat message', msgObj);
    });
    socket.on('chat writing', function(nick) {
      socket.broadcast.to(password).emit('chat writing', nick);
      // io.to(password).emit('chat writing', nick); //for dev
    });
    socket.on('chat writing remove', function(nick) {
      socket.broadcast.to(password).emit('chat writing remove', nick);
    });
  });
});