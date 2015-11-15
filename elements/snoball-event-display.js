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
		      // payload: the snoballgame object
        return `Numbers: ${item.payload.Numbers} Target: ${item.payload.Target}`;
      }
      else if (item.eventType == 'snoball-player-joined') {
        //payload: 'playername'
        return item.payload;
      }
      else if (item.eventType == 'snoball-solution-received') {
        //payload: {playerName: 'playerName'}
        return item.payload;
      }
      else if (item.eventType == 'snoball-game-complete') {
        //payload: {solutions: [{playerName: 'playerName', solution: 'solution', score: 00}], 
        // winningPlayerName: 'playerName}
      }
    }
  }

}