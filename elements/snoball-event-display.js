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
  
  calculatePrimaryDisplay(item)
  {
    if (item != null) {      
      if (item.eventType == 'snoball-chat') {
        return `${item.payload.playerName}:`;
      }
      else if (item.eventType == 'snoball-new-game') {	
        let informalGameDescription = this.calculateInformalGameDescription(item.payload);	      
        return informalGameDescription;
      }
      else if (item.eventType == 'snoball-player-joined') {        
        return `Welcome our new contestant:`;
      }
      else if (item.eventType == 'snoball-solution-received') {        
        return 'Solution received:';
      }
      else if (item.eventType == 'snoball-game-complete') {
        return 'Times up!';
      }
      else if (item.eventType == 'snoball-error') {
        return 'Whoops!';
      }
      else if (item.eventType == 'snoball-connected') {
        return 'Connected!'     
      }
      else if (item.eventType == 'snoball-player-left') {
        return 'Don\'t forget your Macquarie Dictionary:';
      }
    }
  }
  
  calculateInformalGameDescription(snoballGame)
  {
    if (snoballGame.Bigs == 2 && snoballGame.Smalls == 4)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have the family mix! (2 large, 4 small)`
    }
    
    if (snoballGame.Bigs == 1 && snoballGame.Smalls == 5)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have the classroom mix! (1 large, 5 small)`
    }
    
    if (snoballGame.Bigs == 3 && snoballGame.Smalls == 3)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have 3 large and 3 small`;
    }
    
    if (snoballGame.Bigs == 4 && snoballGame.Smalls == 2)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have 4 large and 2 small`;
    }
    
    if (snoballGame.Bigs == 5 && snoballGame.Smalls == 1)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have 5 large and 1 small`;
    }
    
    if (snoballGame.Bigs == 6 && snoballGame.Smalls == 0)
    {
      return `${snoballGame.StartedByPlayer}: I\`ll have 6 large and no smalls`;
    }
    
    if (snoballGame.Bigs == 0 && snoballGame.Smalls == 6)
    {
      return `${snoballGame.StartedByPlayer} has unleashed the ratpack! (6 small)`;
    }
  }
  
  _calculateResultText(playerResults) {
    let resultText = '';
    for (let playerResult of playerResults)
    {
      resultText += `${playerResult.playerName}: ${playerResult.solution.solution} (${playerResult.solution.score}) ${playerResult.solution.explanation}\n`;
    }
    return resultText;
  }

  calculateSecondaryDisplay(item) {
    if (item != null) {
      // if it's a chat message, just display the payload text
      if (item.eventType == 'snoball-chat') {
        return item.payload.message;
      }
      else if (item.eventType == 'snoball-new-game') {		      
        return `Numbers: ${item.payload.Numbers} Target: ${item.payload.Target}`;
      }
      else if (item.eventType == 'snoball-player-joined') {        
        return item.payload;
      }
      else if (item.eventType == 'snoball-solution-received') {        
        return item.payload.playerName;
      }
      else if (item.eventType == 'snoball-game-complete') {
        return this._calculateResultText(item.payload);
      }
      else if (item.eventType == 'snoball-error') {
        return item.payload;
      }
      else if (item.eventType == 'snoball-connected') {
        let playersString = item.payload.players.length == 0 ? "None" : item.payload.players.toString();
        let gameInProgressString = "";
        if (item.gameInProgress)
        {
          gameInProgressString = `A game is in progress. Numbers: ${item.payload.snoballGame.Numbers} Target: ${item.payload.snoballGame.Target}
          Players: ${playersString}`;
          return gameInProgressString;
        }
        else
        {
          return `No game in progress. Players: ${playersString}`;  
        }        
      }
      else if (item.eventType == 'snoball-player-left') {
        return item.payload;
      }
    }
  }

}