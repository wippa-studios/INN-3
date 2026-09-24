import React, { useEffect, useState, type ReactNode } from "react";
import {
  HubConnection,
  HubConnectionState,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export const SignalRContext = React.createContext<HubConnection | null>(null);

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const [connection] = useState<HubConnection>(() => {
    return new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/gamehub`, {
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  });

  useEffect(() => {
    if (connection && connection.state === HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          console.log("SignalR connected!");
          const savedPlayerId = localStorage.getItem("playerId");
          const savedRoomCode = localStorage.getItem("roomCode");
          if (savedPlayerId && savedRoomCode) {
            connection
              .invoke("ReconnectPlayer", savedPlayerId, savedRoomCode)
              .catch((err) => console.error("Reconnect failed:", err));
          }
        })
        .catch((e) => console.error("Connection failed: ", e));
    }
    return () => {};
  }, [connection]);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};
