"use strict";
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SnoballGame = require('./SnoballGame');

var snoballGame;
var gameInProgress = false;

var playerSolutions = [];
var players = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// when a user connects, grab the socket and add the event listeners
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', () => {    
    if (socket.playerName !== undefined)
    {
      players.splice(players.indexOf(socket.playerName),1);
      console.log(`${socket.playerName} disconnected`);  
    }
    else
    {
      console.log('user disconnected');
    }
    
  });
  
  // when a chat message is received, check to see if the user has 'joined' and then re-publish to everyone
  socket.on('snoball-chat', (msg) => {
    console.log(`chat message received: ${msg}`);
    if (socket.playerName !== undefined)
    {
      socket.emit('snoball-chat', {playerName: socket.playerName, message: msg});
    } 
  });
  
  // a new player wants to join, record it
  socket.on('snoball-join-game', (playerName) => {
    socket.playerName = playerName;
    socket.emit('snoball-player-joined', playerName);
  });
  
  // request the new game, supplying parameters
  socket.on('snoball-game-request',function(request) {
      if (!gameInProgress && socket.playerName !== undefined)
      {
          snoballGame = new SnoballGame(request.bigs, request.smalls);
          gameInProgress = true;      
          socket.emit('snoball-new-game', snoballGame);
      }
  });
  
  socket.on('snoball-game-solution', function(solution) {
    if (gameInProgress && socket.playerName !== undefined)
    {
      console.log(`Solution received: ${solution}`);
      playerSolutions.push({playerName: socket.playerName, solution: solution});
      socket.emit('snoball-solution-received', {playerName: socket.playerName});
      gameInProgress = false;
    }
  });
});
