var app = require('express')();
var http = require('http').Server(app);
var io = module.exports.io = require('socket.io')(http);
var crypto = module.exports.crypto = require('crypto');
require('./src/room');

require('./config/globals');

app.get('/', function(req, res){
  res.sendFile(VIEWS_PATH + '/index.html');
});

app.get('/:password', function(req, res){
  res.sendFile(VIEWS_PATH + '/chat.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
