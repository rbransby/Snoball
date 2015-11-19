"use strict";
    class SnoballInputField {
      beforeRegister() {
        this.is = 'snoball-input-field';
        this.properties = {
          inputText: {
            type: String,
            value: ''
          }
        };
      }
      created() {}
      ready() {
              
      }
      attached() {}
      detached() {}
      attributeChanged() {}
      
      checkIfEnterPressed(e) {
          if (e.keyCode == 13) {    
              let input = this.inputText;
              let event = {};
              // new game request
              if (input.startsWith("N:")) {
                  input = input.replace("N:", "");
                  var values = input.split(",");
                  event = {eventType: 'snoball-game-request', payload: { bigs: +values[0], smalls: +values[1] } };                  
              }
              else if (input.startsWith("S:")) {
                  input = input.replace("S:", "");
                  event = {eventType: 'snoball-game-solution', payload: input};
              }
              else if (input.startsWith("J:")) {
                  input = input.replace("J:", "");
                  event = {eventType: 'snoball-join-game', payload: input};
              }
              else {
                  event = {eventType: 'snoball-chat', payload: input};
              }                        
              this.fire('snoball-command-received', event);
              this.inputText = '';
          }
      }
    }