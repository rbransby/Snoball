"use strict";
    class SnoballEventCollection {
      beforeRegister() {
        this.is = 'snoball-event-collection';
        this.properties = {
          items: {
            type: Array,
            value: []
          }
        };
      }
      created() {}
      ready() {
        this.$.displayArea.addEventListener('dom-change', this.onItemAdded);     
      }
      attached() {}
      detached() {}
      attributeChanged() {}
      
      addEvent(event) {
        this.push('items', event);                
      }
      
      onItemAdded() {
        let lastChild = this.querySelector('snoball-event-display:last-of-type');
        if (lastChild != undefined)
        {
            lastChild.scrollIntoView();        
        }
      };
            
    }