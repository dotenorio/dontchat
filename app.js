var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = module.exports.io = require('socket.io')(http);
var crypto = module.exports.crypto = require('crypto');
var jade = require('jade');

require('./config/globals');
require('./src/room');

app.use(express.static(VIEWS_PATH + '/assets'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render(VIEWS_PATH + '/index');
});

app.get('/:password', function(req, res){
  res.render(VIEWS_PATH + '/chat');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
