(function(document) {
  'use strict';
  var socket = io();
  var app = document.querySelector('#webapp');
  app.addEventListener('dom-change', function() {	 
    console.log('dom change fired');     
    document.querySelector('#snoballInput').addEventListener('snoball-command-received', (eventArgs) => {
      console.log(`snoball event raised type:${eventArgs.detail.eventType} payload:${eventArgs.detail.payload}`);      
      socket.emit(eventArgs.detail.eventType, eventArgs.detail.payload);
    });
  });
})(document);