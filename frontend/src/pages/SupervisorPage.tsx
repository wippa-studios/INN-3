import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSignalR } from "../hooks/useSignalR";
import type { JoinTableResponse, LeaveTableResponse } from "../types/Reponses";
import type { Player } from "../types/Models";
import TableGrid from "../components/TableGrid";

const SupervisorPage = () => {
  const { t } = useTranslation();
  const connection = useSignalR();

  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const savedRoomCode = localStorage.getItem("supervisorRoomCode");

      if (savedRoomCode) {
        try {
          // 1. Haal ALTIJD eerst de data op via de REST API (UI herstellen)
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/game/${savedRoomCode}`,
          );
          const roomState = response.data;

          setRoomCode(roomState.roomCode);
          setIsGameStarted(roomState.isActive);
          setPlayers(roomState.players);

          if (connection) {
            if (connection.state === "Connected") {
              await connection.invoke("SubscribeToRoom", savedRoomCode);
            } else {
              setTimeout(() => {
                if (connection.state === "Connected") {
                  connection
                    .invoke("SubscribeToRoom", savedRoomCode)
                    .catch(console.error);
                }
              }, 500);
            }
          }
        } catch (error: unknown) {
          console.error("Error restoring room:", error);

          // Gebruik de veilige Axios type guard in plaats van 'any'
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            localStorage.removeItem("supervisorRoomCode");
            setRoomCode(null);
          }
        }
      }
    };

    restoreSession();
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    connection.on("PlayerJoined", (data: JoinTableResponse) => {
      setPlayers((prevPlayers) => {
        if (prevPlayers.some((p) => p.playerId === data.playerId))
          return prevPlayers;
        return [
          ...prevPlayers,
          {
            playerId: data.playerId,
            nickName: data.nickName,
            tableNumber: data.tableNumber,
            isOffline: false,
            currentPhase: data.currentPhase || "waiting",
          },
        ];
      });
    });

    connection.on(
      "PlayerPhaseUpdated",
      (data: { playerId: string; newPhase: string }) => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) =>
            p.playerId === data.playerId
              ? { ...p, currentPhase: data.newPhase }
              : p,
          ),
        );
      },
    );

    connection.on("PlayerDisconnected", (data: { playerId: string }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.playerId === data.playerId ? { ...p, isOffline: true } : p,
        ),
      );
    });

    connection.on("PlayerReconnected", (data: { playerId: string }) => {
      console.log(`Speler met ID ${data.playerId} is succesvol ge-reconnect!`);
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.playerId === data.playerId ? { ...p, isOffline: false } : p,
        ),
      );
    });

    connection.on("PlayerLeft", (data: LeaveTableResponse) => {
      setPlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.playerId !== data.playerId),
      );
    });

    return () => {
      connection.off("PlayerJoined");
      connection.off("PlayerLeft");
      connection.off("PlayerDisconnected");
      connection.off("PlayerReconnected");
      connection.off("PlayerPhaseUpdated");
    };
  }, [connection]);

  const supervisorId = "18822955-30ec-4456-96f4-f7539a297ad1";

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/create`,
        { supervisorId },
      );
      const code = response.data.roomCode;

      setRoomCode(code);
      // Sla code op voor bij browser refresh
      localStorage.setItem("supervisorRoomCode", code);

      if (connection) {
        await connection.invoke("SubscribeToRoom", code);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const handleCloseRoom = async () => {
    if (!roomCode) return;

    const confirmed = window.confirm(
      t(
        "supervisor_page.close_room_confirm",
        "Weet je zeker dat je de kamer wil sluiten? Alle spelers worden terugestuurd naar het startscherm.",
      ),
    );
    if (!confirmed) return;

    setIsClosing(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}`,
      );
      localStorage.removeItem("supervisorRoomCode");
      setRoomCode(null);
      setPlayers([]);
      setIsGameStarted(false);
    } catch (error) {
      console.error("Fout bij het sluiten van de kamer:", error);
    } finally {
      setIsClosing(false);
    }
  };

  const handleStartGame = async () => {
    if (!roomCode) return;

    setIsStarting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/start`,
      );
      console.log("Startsignaal succesvol naar de klas gestuurd!");
      setIsGameStarted(true);
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) => ({ ...p, currentPhase: "student-phase" })),
      );
    } catch (error) {
      console.error("Fout bij het starten van de kamer:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border-2 border-teal-50 p-8 mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-teal-800 mb-8 tracking-tight">
          LIV<span className="text-amber-500">€</span> YOUR LIF
          <span className="text-amber-500">€</span>
          <span className="block text-2xl text-teal-600 mt-2 font-bold uppercase tracking-widest">
            {t("supervisor_page.title", "Dashboard")}
          </span>
        </h1>

        {!roomCode ? (
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-extrabold py-4 px-10 rounded-full shadow-lg shadow-teal-500/30 transition-transform hover:scale-105 active:scale-95 text-lg uppercase tracking-wider"
            onClick={handleCreateRoom}
          >
            {t("supervisor_page.create_room_button", "Maak een kamer aan")}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex flex-col items-center justify-center bg-teal-50 border-2 border-teal-100 rounded-3xl py-4 px-10 shadow-inner">
              <span className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-1">
                {t("supervisor_page.room_code_label", "Jouw Kamer Code")}
              </span>
              <span className="text-teal-800 font-black text-6xl tracking-widest drop-shadow-sm">
                {roomCode}
              </span>
            </div>

            {isGameStarted ? (
              <div className="bg-teal-100 text-teal-800 font-black py-4 px-10 rounded-full shadow-inner border-2 border-teal-200 text-lg uppercase tracking-wider flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                {t("supervisor_page.in_progress", "SPEL IS BEZIG")}
              </div>
            ) : (
              <button
                onClick={handleStartGame}
                disabled={isStarting || players.length === 0}
                className={`font-extrabold py-4 px-10 rounded-full shadow-lg transition-transform text-lg uppercase tracking-wider ${
                  players.length === 0 || isStarting
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105 active:scale-95 shadow-amber-500/30"
                }`}
              >
                {isStarting
                  ? t("supervisor_page.starting", "Starten...")
                  : t("supervisor_page.start_game", "Start het Spel!")}
              </button>
            )}

            {!isGameStarted && players.length === 0 && (
              <p className="text-sm text-slate-400 font-medium italic">
                {t(
                  "supervisor_page.waiting_for_players",
                  "Wacht op spelers om te kunnen starten...",
                )}
              </p>
            )}

            <button
              onClick={handleCloseRoom}
              disabled={isClosing}
              className="font-extrabold py-3 px-8 rounded-full border-2 border-rose-300 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClosing
                ? t("supervisor_page.closing", "Sluiten...")
                : t("supervisor_page.close_room_button", "Kamer sluiten")}
            </button>
          </div>
        )}
      </div>

      {roomCode && (
        <div className="max-w-[90rem] mx-auto">
          <TableGrid players={players} />
        </div>
      )}
    </div>
  );
};

export default SupervisorPage;
