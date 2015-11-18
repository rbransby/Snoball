"use strict";

var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Snoball Server @integ', () => {
  
  var client1;
  var client2;
  
  beforeEach(() => {
    client1 = io.connect(socketURL, options);
    client2 = io.connect(socketURL, options);
  });
  
  afterEach(() => {
    client1.disconnect();
    client2.disconnect();
  });
  
  // Given a game is not in progress, When a guest requests to join, then it should be accepted and broadcast
  it('should announce when a new player joins, given a game not in progress', (done) => {
    
    let numberOfSuccesses = 0;
    
    // pass when two clients receive the snoball-player-joined event
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer');
    });

    client1.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      numberOfSuccesses++;
      checkForSuccessCondition();      
    });
    
    client2.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      numberOfSuccesses++;
      checkForSuccessCondition();
    })
  });
  
  // Given a game is not in progress, When a GUEST requests a new game, Then it should be ignored and return an error to the caller.
  it('should not broadcast anything and return an error when a GUEST requests a new game', (done) => {    
    let numberOfSuccesses = 0;

    client1.on('connect', function (data) {
      client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
    });

    client1.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      throw Error('Should not have generated a player joined event');
    });
    
    client2.on('snoball-player-joined', (name) => {
      throw Error('Should not have generated a player joined event');  
      done();  
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      throw Error('Should not have generated a game');
      done();
    });
    
    client2.on('snoball-new-game', (snoballGame) => {
      throw Error('Should not have generated a game');
      done();
    });
    
    client1.on('snoball-error', (message) => {
      message.should.be.a.String;
      setTimeout(() => {done();},1000);      
    });
  });
  
  // Given a game is not in progress, When a player requests a new game, Then a new game should be broadcast and game status changed to in progress
  it('should return a new game to all users when a new game is requested and a game is not in progress', (done) => {    
    let numberOfSuccesses = 0;
    
    // pass when two clients receive the snoball-new-game event
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer');
    });

    client1.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
    });
    
    client2.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');      
    })
    
    client1.on('snoball-new-game', (snoballGame) => {
      snoballGame.Bigs.should.equal(2);
      snoballGame.Smalls.should.equal(4);
      snoballGame.Numbers.should.be.an.Array;
      snoballGame.Target.should.be.a.Number;
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
    
    client2.on('snoball-new-game', (snoballGame) => {
      snoballGame.Bigs.should.equal(2);
      snoballGame.Smalls.should.equal(4);
      snoballGame.Numbers.should.be.an.Array;
      snoballGame.Target.should.be.a.Number;
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
  });
  
  // Given a game is not in progress, When a player submits a solution, Then it should be ignored.
  it('should not broadcast anything given a player has submitted a solution and a game isnt in progress', (done) => {

    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer');
    });

    client1.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      client1.emit('snoball-game-solution', "10*10");
    });
    
    client1.on('snoball-solution-received', (solution) => {
      throw Error("Solution should not have been accepted");
    });

    client1.on('snoball-new-game', (snoballGame) => {
      throw Error('Should not have generated a game');
      done();
    });
    
    client2.on('snoball-new-game', (snoballGame) => {
      throw Error('Should not have generated a game');
      done();
    });
    
    client1.on('snoball-error', (message) => {
      message.should.be.a.String;
      setTimeout(() => {done();},1000);      
    });
  });
  
  // Given a game is in progress, When player submits a solution, Then it should be accepted by the server and all players notified
  it('should notify players when a solution has been submitted, given a game is in progress', (done) => {
    let numberOfSuccesses = 0;
    
    // pass when two clients receive the snoball-new-game event
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer');
    });

    client1.on('snoball-player-joined', (name) => {      
      client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      client1.emit('snoball-game-solution', "10*10");
    });
    
    client1.on('snoball-solution-received', (solution) => {
      solution.playerName.should.equal('TestPlayer');
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
    
    client2.on('snoball-solution-received', (solution) => {
      solution.playerName.should.equal('TestPlayer');
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
  });
  
  // Given a game is in progress, When player submits a solution and it is the last one, Then it should be accepted by the server and all players notified of game closure and result
  it('should return the result of the game when all players have submitted a solution', (done) => {
    let numberOfSuccesses = 0;
    
    // pass when two clients receive the snoball-new-game event
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });
    
    client2.on('connect', function (data) {
      client2.emit('snoball-join-game', 'TestPlayer2');
    });

    client1.on('snoball-player-joined', (name) => {  
      if (name == 'TestPlayer1')
      {    
        client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
      }
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      client1.emit('snoball-game-solution', "10*10");
    });
    
    client2.on('snoball-new-game', (snoballGame) => {
      client2.emit('snoball-game-solution', "10*5");
    });
    
    client1.on('snoball-game-complete', (results) => {    
      results.should.be.an.Array;      
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
    
    client2.on('snoball-game-complete', (results) => {
      results.should.be.an.Array;          
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
    
    client1.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
  });
  
  // Given a game in progress, if a player leaves mid-game and they were the last one with a solution outstanding, complete game
  it('should return the result of the game when a player leaves and they were the last one', (done) => {
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });
    
    client2.on('connect', function (data) {
      client2.emit('snoball-join-game', 'TestPlayer2');
    });

    client1.on('snoball-player-joined', (name) => {  
      if (name == 'TestPlayer1')
      {    
        client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
      }
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      client1.emit('snoball-game-solution', "10*10");
    });        
    
    client1.on('snoball-solution-received', (solution) => {    
      client2.disconnect();
    });
    
    client1.on('snoball-game-complete', (results) => {
      results.should.be.an.Array;
      results[0].playerName.should.equal('TestPlayer1');            
      done();      
    });
    
    client1.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
    
    client2.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
  });
  
  // Given a game is in progress, When player requests a new game, Then it should be ignored.
  it('should return an error and broadcast nothing when a player requests a game, given on is already in progress', (done) => {
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });
    
    client2.on('connect', function (data) {
      client2.emit('snoball-join-game', 'TestPlayer2');
    });

    client1.on('snoball-player-joined', (name) => {  
      if (name == 'TestPlayer1')
      {    
        client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
      }
    });
    
    client1.on('snoball-new-game',(snoballGame) => {
      client2.emit('snoball-game-request', {bigs: 2, smalls: 4});
    });        
    
    client1.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
    
    client2.on('snoball-error', (message) => {
      if (message == 'Can\'t request a game while one is in progress, or you are not playing')
      {
        done();
      }
      else
      {
        throw Error(`This error should not have happened:${message}`);
      }
    });
  });
  
  // Given a game is in progress, When a guest requests to join, then it should be accepted and broadcast
  it('should allow a new player to join given a game is already in progress', (done) => {
    let numberOfSuccesses = 0;
    
    // pass when two clients receive the player joined event from client 2
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });        

    client1.on('snoball-player-joined', (name) => {  
      if (name == 'TestPlayer1')
      {    
        client1.emit('snoball-game-request', {bigs: 2, smalls: 4});
      }
      else if (name == 'TestPlayer2')
      {
        numberOfSuccesses++;
        checkForSuccessCondition();
      }
    });
    
    client2.on('snoball-player-joined', (name) => {
      if (name == 'TestPlayer2')
      {
        numberOfSuccesses++;
        checkForSuccessCondition();
      }
    });
    
    client1.on('snoball-new-game',(snoballGame) => {      
      client2.emit('snoball-join-game', 'TestPlayer2');
    });
  });
  
  // Given a game is in progress, When a guest submits a solution or requests a game or chats, then it should be ignored.
  it('should return an error if a guest tries to submit a solution, request a game, or chat given a game is in progress', (done) => {
    let cantChatErrorReceived = false;
    let cantSubmitSolutionErrorReceived = false;
    let cantRequestGameErrorReceived = false;    
    
    // pass when all 3 errors received
    let checkForSuccessCondition = function()
    {
      if (cantChatErrorReceived && cantSubmitSolutionErrorReceived && cantRequestGameErrorReceived)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });        

    client1.on('snoball-player-joined', (name) => {   
      client1.emit('snoball-game-request', {bigs: 2, smalls: 4});            
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      client2.emit('snoball-chat','test chat message');
      client2.emit('snoball-game-solution', "10*10");
      client2.emit('snoball-game-request', {bigs:2, smalls:4});
    });
    
    client1.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
    
    client2.on('snoball-error', (message) => {
      if (message == 'Chat not allowed unless you have joined the game.')
      {
        cantChatErrorReceived = true;
        checkForSuccessCondition();
      }
      else if (message == 'Can\'t submit a solution while a game is not in progress, or you are not playing')
      {
        cantSubmitSolutionErrorReceived = true;
        checkForSuccessCondition();
      }
      else if (message == 'Can\'t request a game while one is in progress, or you are not playing')
      {
        cantRequestGameErrorReceived = true;
        checkForSuccessCondition();
      }
      else
      {
        throw Error(`This error should not have happened:${message}`);
      }
    });
  });
  
  // Players should be able to chat regardless of game state
  it('should broadcast chat messages to all users, given a valid player', (done) => {
    // pass when chat received by both clients
    let numberOfSuccesses = 0;
    let playersJoined = 0;
    let checkForSuccessCondition = function()
    {
      if (numberOfSuccesses == 2)
      {
        done();
      }
    }
    
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer1');
    });
    
    client2.on('connect', function (data) {
      client2.emit('snoball-join-game', 'TestPlayer2');
    });
    
    client1.on('snoball-player-joined', (player) => {
      playersJoined++;
      if (playersJoined == 2)
      {
        client1.emit('snoball-chat', "test message");
      }
    });
    
    client1.on('snoball-chat', (message) => {
      message.playerName.should.be.a.String;
      message.message.should.be.a.String;
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
    
    client2.on('snoball-chat', (message) => {
      message.playerName.should.be.a.String;
      message.message.should.be.a.String;
      numberOfSuccesses++;
      checkForSuccessCondition();
    });
  });
  
  //Given a game is in progress, when all players disconnect, then the server should clear the game and return to fresh state.
  it('should return to a not-in-progress fresh state all players leave', (done) => {
    // can test this by spinning up a game, trying to fire a solution to the server, checking 
    // for success, then disconnecting all clients, then reconnect and try to solve again
    var haveDisconnected = false;    
    client1.on('connect', function (data) {      
      client1.emit('snoball-join-game', 'TestPlayer1');
    });    
    
    client1.on('snoball-player-joined',(name) => {
      if (haveDisconnected)
      {
        client1.emit('snoball-game-solution',"10*10");
      }
      else
      {
        client1.emit('snoball-game-request', {bigs:2, smalls:4});
      }
    });
    
    client1.on('snoball-new-game', (game) => {
      client1.emit('snoball-game-solution', "10*10");
    });
    
    client1.on('snoball-solution-received', (solution) => {
      client1.disconnect();
      haveDisconnected = true;
      client1.connect();
    });
    
    client1.on('snoball-error', (message) => {
      if (!haveDisconnected)
      {
        throw Error("received an error that we shouldnt have, before the disconnect");
      }
      else if (message == 'Can\'t submit a solution while a game is not in progress, or you are not playing')
      {
        done();
      }
    })
  });
  
  //Given a player is already joined, when a second player joins with the same name, then the player shall receive an error
  it('should return an error if a player tries to join with a name already in use', (done) => {
    client1.on('connect', function (data) {      
      client1.emit('snoball-join-game', 'TestPlayer');
    });
    
    client2.on('snoball-player-joined', (playerName) => {
      client2.emit('snoball-join-game', 'TestPlayer');
    });
    
    client2.on('snoball-error', (message) => {
      if (message == "Player name taken, please choose another.")
      {
        done();        
      }
      else
      {
        throw Error(`This error should not have happened:${message}`);
      }
    });
    
    client1.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
  });
  
  //Given a player has submitted a solution, when they attempt to submit another solution, then they should get an error
  it('should return an error if a player tries to submit more than 1 solution', (done) => 
  {
    // track how many times solution received count fires, it should only be 1
    let solutionReceivedCount = 0;
    client1.on('connect', function (data) {      
      client1.emit('snoball-join-game', 'TestPlayer1');
    });
    
    client2.on('connect', function (data) {      
      client2.emit('snoball-join-game', 'TestPlayer2');
    });
    
    client1.on('snoball-player-joined', (playerName) => {
      if (playerName == 'TestPlayer1')
      {
        client1.emit('snoball-game-request', {bigs:2, smalls:4});
      }
    });
    
    client1.on('snoball-new-game', (snoballGame) => {
      client1.emit('snoball-game-solution', '10*10');
    });
    
    client1.on('snoball-solution-received', (solution) => {
      solutionReceivedCount++;
      if (solutionReceivedCount == 1)
      {
        client1.emit('snoball-game-solution', '20*20');  
      }
      else
      {
        throw Error("Second solution appears to have been accepted");
      }
      
    });
    
    client1.on('snoball-error', (message) => {
      if (message == "Solution already submitted and locked in.")
      {
        done();
      }
      else
      {
        throw Error(`This error should not have happened:${message}`);
        done();
      }
    });
    
    client2.on('snoball-error', (message) => {
      throw Error(`This error should not have happened:${message}`);
    });
    
    
  });
});