(function(document) {
  'use strict';
  var socket = io();
  var app = document.querySelector('#webapp');
  app.addEventListener('dom-change', function() {	      
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.eventType} payload:${eventArgs.payload}`);      
      //socket.emit('snoball-game-solution', eventArgs.detail.message);
    });
  });
})(document);