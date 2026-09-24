import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CharacterProvider } from "../contexts/CharacterProvider";
import { useSignalR } from "../hooks/useSignalR";
import { useNavigationBlocker } from "../hooks/useNavigationBlocker";
import NavigationBlockedModal from "../components/NavigationBlockedModal";

export default function PlayerGameLayout() {
  const connection = useSignalR();
  const navigate = useNavigate();
  const { isBlocked, dismiss } = useNavigationBlocker();

  useEffect(() => {
    if (!connection) return;

    connection.on("RoomClosed", () => {
      localStorage.removeItem("playerId");
      localStorage.removeItem("roomCode");
      localStorage.removeItem("nickName");
      localStorage.removeItem("tableNumber");
      navigate("/home", { replace: true });
    });

    return () => {
      connection.off("RoomClosed");
    };
  }, [connection, navigate]);

  return (
    <CharacterProvider>
      <Outlet />
      <NavigationBlockedModal open={isBlocked} onDismiss={dismiss} />
    </CharacterProvider>
  );
}
