var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = module.exports.io = require('socket.io')(http);
var crypto = module.exports.crypto = require('crypto');
var jade = require('jade');
var bodyParser = require('body-parser');
var fs = require('fs');

require('./config/globals');
require('./src/room');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(VIEWS_PATH + '/assets'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render(VIEWS_PATH + '/index');
});

app.get('/:password', function(req, res){
  res.render(VIEWS_PATH + '/chat');
});

app.post('/feedback', function(req, res){
  var feedback = req.body.feedback;
  var feedback2save = ''
     + (new Date).toString().split(' ').slice(0, -2).join(' ')
     + ' '
     + JSON.stringify(feedback.toString())
     + '\r\n';
  fs.appendFile("feedback.log", feedback2save, function(err) {
    if(err) res.send('Oops! Your feedback has NOT been received. Please send it to dotenorio@gmail.com');
    res.send('Thanks for your feedback :)');
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
