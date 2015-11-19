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
        //this.items = this.populateWithTestData();        
      }
      attached() {}
      detached() {}
      attributeChanged() {}
      
      addEvent(event) {
        this.push('items', event);
      }
    }