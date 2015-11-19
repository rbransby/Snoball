(function(document) {
  'use strict';
  var socket = io();
  
  var app = document.querySelector('#webapp');  
  
  var snoballEvents = [
    'snoball-chat',
    'snoball-player-joined',
    'snoball-new-game',
    'snoball-solution-received',
    'snoball-connected',
    'snoball-player-left',
    'snoball-error',
    'snoball-game-complete'
  ]
  
  for (let event of snoballEvents)
  {
    socket.on(event, (payload) => {
      let snoballEventCollection = document.querySelector('#snoballEventCollection');
      snoballEventCollection.addEvent({eventType: event, payload: payload});
    });
  }
  
  app.addEventListener('dom-change', function() {	     
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.detail.eventType} payload:${eventArgs.detail.payload}`);      
      socket.emit(eventArgs.detail.eventType, eventArgs.detail.payload);
    });
  });
})(document);