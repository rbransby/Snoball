(function(document) {
  'use strict';

  
  var app = document.querySelector('#webapp');   
        
  app.addEventListener('dom-change', function() {	 
    for (let event of snoballEvents)
    {
      socket.on(event, (payload) => {
        let snoballEventCollection = document.querySelector('#snoballEventCollection');
        snoballEventCollection.addEvent({eventType: event, payload: payload});
      });
    }
        
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.detail.eventType} payload:${eventArgs.detail.payload}`);      
      socket.emit(eventArgs.detail.eventType, eventArgs.detail.payload);
    });
    
    app.snoballEventImages = snoballEventImages;
    
  }); 
  
  var socket = io();
  
  var snoballEvents = [
    'snoball-chat',
    'snoball-player-joined',
    'snoball-new-game',
    'snoball-solution-received',
    'snoball-connected',
    'snoball-player-left',
    'snoball-error',
    'snoball-game-complete'
  ];
  
  var snoballEventImages = {
    snoballChat: '',
    snoballPlayerJoined: '/images/snoball-player-joined.png',
    snoballNewGame: '/images/snoball-new-game.png',
    snoballSolutionReceived: '/images/snoball-solution-received.png',
    snoballConnected: '/images/snoball-connected.png',
    snoballPlayerleft:'/images/snoball-player-left.png',
    snoballError: '/images/snoball-error.png',
    snoballGamecomplete:'/images/snoball-game-complete.png'
  };

  
})(document);