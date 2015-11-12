"use strict";
    class SnoballInputField {
      beforeRegister() {
        this.is = 'snoball-input-field';
        this.properties = {
          item: {
            type: Object,
            value: {}
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
              console.log('enter pressed');
              // work out what we want to fire based on the text, and then fire it.
              this.fire('snoball-command-received', {eventType: 'snoball-chat', payload:'new chat message'});
              this.fire('snoball-command-received', {eventType: 'snoball-game-solution', payload:'10*5'});
          }
      }
    }