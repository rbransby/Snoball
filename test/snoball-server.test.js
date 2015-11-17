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
  it.skip('should notify players when a solution has been submitted, given a game is in progress', (done) => {
    
  });
  
  // Given a game is in progress, When player submits a solution and it is the last one, Then it should be accepted by the server and all players notified of game closure and result
  it.skip('should return the result of the game when all players have submitted a solution', (done) => {
    
  });
  
  // Given a game is in progress, When player requests a new game, Then it should be ignored.
  it.skip('should return an error and broadcast nothing when a player requests a game, given on is already in progress', (done) => {
    
  });
  
  // Given a game is in progress, When a guest requests to join, then it should be accepted and broadcast
  it.skip('should allow a new player to join given a game is already in progress', (done) => {
    
  });
  
  // Given a game is in progress, When a guest submits a solution or requests a game or chats, then it should be ignored.
  it.skip('should return an error if a guest tries to submit a solution, request a game, or chat given a game is in progress', (done) => {
    
  });
  
  // Players should be able to chat regardless of game state
  it.skip('should broadcast chat messages to all users, given a valid player', (done) => {
    
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
});