"use client";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    socket.emit("message", message);
    setMessage(""); // Clear the message input after sending
  };

  useEffect(() => {
    // Update the URL to your deployed server
    const socket = io("https://chat-api-three-xi.vercel.app", {
      path: '/socket.io', // Ensure the path is correctly set
      transports: ['websocket', 'polling'], // Ensure both transports are enabled
    });

    socket.on("message", (message) => {
      setInbox((prevInbox) => [...prevInbox, message]);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
      <div>
        <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
          <div className="flex flex-col gap-2 border rounded-lg p-10">
            {inbox.map((message: string, index: number) => {
              return (
                  <div key={index} className="border rounded px-4 py-2">
                    {message}
                  </div>
              );
            })}
          </div>
          <div className="flex gap-2 align-center justify-center">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                name="message"
                className="flex-1 bg-black border rounded px-2 py-1"
            />
            <button className="w-40" onClick={handleSendMessage}>
              Send message
            </button>
          </div>
        </div>
      </div>
  );
}
