using Quobject.SocketIoClientDotNet.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SnoballConsoleClient
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Must supply a URL to connect to as the first and only parameter.");
                return;
            }

            string urlArgument = args[0];

            Uri uri;
            bool result = Uri.TryCreate(urlArgument, UriKind.Absolute, out uri)
                && uri.Scheme == Uri.UriSchemeHttp;

            if (!result)
            {
                Console.WriteLine("Must be a valid HTTP URL e.g. \"http://blah.com:8080\"");
            }

            string command = "";
            var socket = IO.Socket(args[0]);
            socket.On(Socket.EVENT_CONNECT, () =>
            {
                string[] events = new string[]
                {
                    "snoball-player-joined",
                    "snoball-player-left",
                    "snoball-chat"
                };
                foreach (string e in events)
                {
                    socket.On(e, (payload) =>
                    {
                        SnoballEvent snoballEvent = new SnoballEvent(e, payload);
                        Console.SetCursorPosition(0, Console.CursorTop);
                        Console.WriteLine(snoballEvent.ToString());
                        Console.Write(command);

                    });

                }
                Console.WriteLine("Welcome to Snoball. /J [username] to join.");
                command = "> ";
                Console.Write(command);
            });            

            while (true)
            {                
                ConsoleKeyInfo key = Console.ReadKey();
                if (key.Key != ConsoleKey.Enter)
                {
                    if (key.Key == ConsoleKey.Backspace)
                    {
                        if (command != "> ")
                        {
                            command = command.Remove(command.Length - 1, 1);
                            Console.SetCursorPosition(0, Console.CursorTop);
                            Console.Write("                                                                                    ");
                            Console.SetCursorPosition(0, Console.CursorTop);
                            Console.Write(command);
                        }
                    }
                    else
                    {
                        command += key.KeyChar;
                    }                    
                }
                else
                {
                    if (command.StartsWith("> /j") || command.StartsWith("> /J"))
                    {
                        // join game
                        command = command.Replace("> /j", "");
                        command = command.Replace("> /J", "");
                        socket.Emit("snoball-join-game", command.Trim());
                        
                    }
                    else
                    {
                        // chat
                        command = command.Trim();
                        command = command.Replace("> ", "");
                        socket.Emit("snoball-chat", command);
                    }
                    command = "> ";
                }                
            }
        }

        
    }
}
