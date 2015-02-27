var io = module.parent.exports.io;
var crypto = module.parent.exports.crypto;

io.on('connection', function(socket) {
  var nick = crypto.createHash('sha1').update(Date()).digest('hex');
  socket.emit('chat nick', nick);
  socket.on('chat enter room', function(password) {
    socket.join(password);
    socket.on('chat message', function(msg) {
      io.to(password).emit('chat message', msg);
    });
    socket.on('chat writing', function(nick) {
      socket.broadcast.to(password).emit('chat writing', nick);
      // io.to(password).emit('chat writing', nick);
    });
  });
});