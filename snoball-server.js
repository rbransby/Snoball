"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SnoballGame = require('./SnoballGame');
var logger = require('winston');

var snoballGame = {};
var gameInProgress = false;

var playerSolutions = [];
var players = [];

app.use('/', express.static(__dirname));

http.listen(3000, function(){
  logger.info('listening on *:3000');
});

// when a user connects, grab the socket and add the event listeners
io.on('connection', function(socket){
  
  socket.emit('snoball-connected', 
    {gameInProgress: gameInProgress,
     snoballGame: snoballGame,
     players: players });
     
  logger.info('a user connected');
  socket.on('disconnect', () => {    
    if (socket.playerName !== undefined)
    {
      players.splice(players.indexOf(socket.playerName),1);      
      socket.broadcast.emit('snoball-player-left', socket.playerName);
      logger.info(`${socket.playerName} disconnected`);  
      if (players.length == 0 && gameInProgress)
      {
        logger.info('all players left, resetting')
        gameInProgress = false;
        playerSolutions = [];
        players = [];
      }
      else if (gameInProgress) {
        checkIfGameComplete(io);
      }
    }
    else
    {
      logger.info('user disconnected');
    }
    
  });
  
  // when a chat message is received, check to see if the user has 'joined' and then re-publish to everyone
  socket.on('snoball-chat', (msg) => {
    logger.info(`chat message received: ${msg}`);
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
    // check for duplicates, if there is one fire: "Player name taken, please choose another."
    if (players.indexOf(playerName) > -1)
    {
      socket.emit('snoball-error', "Player name taken, please choose another.");
    }
    else
    {
      socket.playerName = playerName;
      players.push(playerName);
      logger.info(`player joined: ${playerName}`);
      io.emit('snoball-player-joined', playerName);  
    }    
  });
  
  // request the new game, supplying parameters
  socket.on('snoball-game-request',function(request) {
      if (!gameInProgress && socket.playerName !== undefined)
      {
          logger.info('snoball game requested');
          snoballGame = new SnoballGame(request.bigs, request.smalls);
          snoballGame.StartedByPlayer = socket.playerName;
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
      try {
        updatePlayerSolution(socket.playerName, solution);
        logger.info(`Solution received and accepted: ${solution}`);
        io.emit('snoball-solution-received', {playerName: socket.playerName});        
      }
      catch (Error)
      {
        logger.info(`Player already had a solution.`);
        socket.emit('snoball-error', 'Solution already submitted and locked in.');
      }        
      checkIfGameComplete(io);
    }
    else
    {
      socket.emit('snoball-error', 'Can\'t submit a solution while a game is not in progress, or you are not playing');
    }
  });
  
  function updatePlayerSolution(playerName, solution)
  {
    let playerSolutionIndex = playerSolutions.findIndex((element) => element.playerName == playerName);
    if (playerSolutionIndex > -1)
    {
      throw Error("Player has a solution.");      
    }
    else 
    {
      playerSolutions.push({playerName: playerName, solution: solution});
    } 
  }
  
  function checkIfGameComplete(io) {
    if (players.length == playerSolutions.length)
    {
      // we're all done, lets calculate the results
      let results = snoballGame.completeGame(playerSolutions);
      logger.info(results);
      io.emit('snoball-game-complete',results);
      gameInProgress = false;
      playerSolutions = [];
    }
  };
  
  // reset server
  socket.on('snoball-reset',() => {
    gameInProgress = false;

    playerSolutions = [];
    players = [];
  });
});
