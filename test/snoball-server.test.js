var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('Snoball Server @integ', () => {
  it('should announce when a player joins', (done) => {
    var client1 = io.connect(socketURL, options);
    client1.on('connect', function (data) {
      client1.emit('snoball-join-game', 'TestPlayer');
    });

    client1.on('snoball-player-joined', (name) => {
      name.should.equal('TestPlayer');
      done();
    });
  });
});