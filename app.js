"use strict";
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SnoballGame = require('./SnoballGame');

var snoballGame;
var gameInProgress = false;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', () => console.log('user disconnected') );
  socket.on('snoball-chat', (msg) => console.log(`chat message received: ${msg}`) );
  
  socket.on('snoball-game-request',function(request) {
      if (!gameInProgress)
      {
          snoballGame = new SnoballGame(request.bigs, request.smalls);
          gameInProgress = true;      
          socket.emit('snoball-new-game', snoballGame);
      }
  });
  
  socket.on('snoball-game-solution', function(solution) {
      console.log(`Solution received: ${solution}`);
      gameInProgress = false;
  });
});
