"use strict";
class SnoballEventDisplay {
  beforeRegister() {
    this.is = 'snoball-event-display';
    this.properties = {
      item: {
        type: Object,
        value: {}
      }
    };
  }
  created() { }
  ready() {

  }
  attached() { }
  detached() { }
  attributeChanged() { }

  calculateSecondaryDisplay(item) {
    if (item != null) {
      // if it's a chat message, just display the payload text
      if (item.eventType == 'snoball-chat') {
        return item.payload;
      }
      else if (item.eventType == 'snoball-new-game') {		      
        return `Numbers: ${item.payload.Numbers} Target: ${item.payload.Target}`;
      }
      else if (item.eventType == 'snoball-player-joined') {        
        return item.payload;
      }
      else if (item.eventType == 'snoball-solution-received') {        
        return item.payload;
      }
      else if (item.eventType == 'snoball-game-complete') {
        return item.payload;
      }
      else if (item.eventType == 'snoball-error') {
        return item.payload;
      }
      else if (item.eventType == 'snoball-connected') {
        return item.payload;
      }
      else if (item.eventType == 'snoball-player-left') {
        return item.payload;
      }
    }
  }

}