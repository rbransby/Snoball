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
        this.items = this.populateWithTestData();        
      }
      attached() {}
      detached() {}
      attributeChanged() {}
      populateWithTestData()
      {
        return [
          { eventType : 'snoball-chat', payload : 'test chat message'},
          { eventType : 'snoball-new-game', payload : {Numbers : [1,2,3,4,5,6], Target: 758}},          
        ];
      }
    }