using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnoballConsoleClient
{
    public class SnoballEvent
    {        
        public string EventType { get; set; }
        public dynamic Payload { get; set; }

        public SnoballEvent(string eventType, dynamic payload)
        {            
            EventType = eventType;
            Payload = payload;
        }

        public override string ToString()
        {
            if (EventType == "snoball-chat")
            {
                return string.Format("{0}: {1}", Payload.playerName, Payload.message);
            }
            else if (EventType == "snoball-new-game")
            {
                return string.Format("{0}:{1}", EventType, EventType);
            }
            else if (EventType == "snoball-player-joined")
            {
                return string.Format("{0}:{1}", "Player Joined", Payload);
            }
            else if (EventType == "snoball-solution-received")
            {
                return string.Format("{0}:{1}", EventType, EventType);
            }
            else if (EventType == "snoball-game-complete")
            {
                return string.Format("{0}:{1}", EventType, EventType);
            }
            else if (EventType == "snoball-error")
            {
                return string.Format("{0}:{1}", EventType, EventType);
            }
            else if (EventType == "snoball-connected")
            {
                return string.Format("{0}:{1}", EventType, EventType);
            }
            else if (EventType == "snoball-player-left")
            {
                return string.Format("{0}:{1}", "Player Left", Payload);
            }

            return "ERROR";
        }
    }
}
