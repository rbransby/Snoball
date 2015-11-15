(function(document) {
  'use strict';
  var socket = io();
  
  var app = document.querySelector('#webapp');
  var snoballEventCollection;
  
  app.snoballEvents = [
          { eventType : 'snoball-chat', payload : 'test chat message'},
          { eventType : 'snoball-new-game', payload : {Numbers : [1,2,3,4,5,6], Target: 758}},          
        ];
  
  socket.on('snoball-chat', (msg) => {
    app.push('snoballEvents',{eventType: 'snoball-chat', payload: msg});
  });
  
  socket.on('snoball-player-joined', (playerName) => {
    app.push('snoballEvents',{eventType: 'snoball-player-joined', payload: playerName});
  });
  
  socket.on('snoball-new-game', (snoballGame) => {
    app.push('snoballEvents',{eventType: 'snoball-new-game', payload: snoballGame});
  });
  
  //solution = {playerName : 'playerName'}
  socket.on('snoball-solution-received', (solution) => {
    app.push('snoballEvents',{eventType: 'snoball-solution-received', payload: solution});
  });
  
  
  app.addEventListener('dom-change', function() {	 
    console.log('dom change fired');     
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.detail.eventType} payload:${eventArgs.detail.payload}`);      
      socket.emit(eventArgs.detail.eventType, eventArgs.detail.payload);
    });
  });
})(document);