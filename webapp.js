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
    snoballPlayerJoined: '',
    snoballNewGame: '/images/snoball-new-game.jpg',
    snoballSolutionReceived: '',
    snoballConnected: '/images/snoball-connected.jpg',
    snoballPlayerleft:'',
    snoballError: '/images/snoball-error.jpg',
    snoballGamecomplete:'/images/snoball-game-complete.jpg'
  };

  
})(document);