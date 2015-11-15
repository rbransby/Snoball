(function(document) {
  'use strict';
  var socket = io();
  
  socket.on('snoball-chat', (msg) => {
    
  });
  
  socket.on('snoball-player-joined', (playerName) => {
    
  });
  
  socket.on('snoball-new-game', (snoballGame) => {
    
  });
  
  //solution = {playerName : 'playerName'}
  socket.on('snoball-solution-received', (solution) => {
    
  });
  
  var app = document.querySelector('#webapp');
  app.addEventListener('dom-change', function() {	 
    console.log('dom change fired');     
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.detail.eventType} payload:${eventArgs.detail.payload}`);      
      socket.emit(eventArgs.detail.eventType, eventArgs.detail.payload);
    });
  });
})(document);