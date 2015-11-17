"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SnoballGame = require('./SnoballGame');

var snoballGame;
var gameInProgress = false;

var playerSolutions = [];
var players = [];

app.use('/', express.static(__dirname));

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
      if (players.length == 0 && gameInProgress)
      {
        console.log('all players left, resetting')
        gameInProgress = false;
        playerSolutions = [];
        players = [];
      }
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
      io.emit('snoball-chat', {playerName: socket.playerName, message: msg});
    } 
    else
    {
        socket.emit('snoball-error', 'Chat not allowed unless you have joined the game.');
    }
  });
  
  // a new player wants to join, record it
  socket.on('snoball-join-game', (playerName) => {
    socket.playerName = playerName;
    io.emit('snoball-player-joined', playerName);
  });
  
  // request the new game, supplying parameters
  socket.on('snoball-game-request',function(request) {
      if (!gameInProgress && socket.playerName !== undefined)
      {
          console.log('snoball game requested');
          snoballGame = new SnoballGame(request.bigs, request.smalls);
          gameInProgress = true;      
          io.emit('snoball-new-game', snoballGame);
      }
      else
      {
          socket.emit('snoball-error', 'Can\'t request a game while one is in progress, or you are not playing');
      }
  });
  
  // player submits solution
  socket.on('snoball-game-solution', function(solution) {
    if (gameInProgress && socket.playerName !== undefined)
    {
        console.log(`Solution received: ${solution}`);
        playerSolutions.push({playerName: socket.playerName, solution: solution});
        io.emit('snoball-solution-received', {playerName: socket.playerName});
        checkIfGameComplete();
    }
    else
    {
        socket.emit('snoball-error', 'Can\'t submit a solution while a game is not in progress, or you are not playing');
    }
  });
  
  function checkIfGameComplete() {
    
  };
  
  // reset server
  socket.on('snoball-reset',() => {
    gameInProgress = false;

    playerSolutions = [];
    players = [];
  });
});
