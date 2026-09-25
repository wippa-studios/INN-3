import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSignalR } from "../hooks/useSignalR";
import { useNavigate } from "react-router-dom";
import type { JoinTableRequest } from "../types/Requests";
import type { JoinTableResponse } from "../types/Reponses";
import InputField from "../components/InputField";

const HomePlayerPage = () => {
  console.log("does the deployment script actually work?");
  const { t } = useTranslation();
  const [roomCode, setRoomCode] = useState<string | null>(() =>
    localStorage.getItem("roomCode"),
  );
  const [nickName, setNickname] = useState<string>(
    () => localStorage.getItem("nickName") || "",
  );
  const [tableNumber, setTableNumber] = useState<number>(() => {
    const savedTable = localStorage.getItem("tableNumber");
    return savedTable ? parseInt(savedTable, 10) : 1;
  });

  const [activeSession, setActiveSession] = useState<{
    room: string;
    id: string;
  } | null>(() => {
    const savedRoom = localStorage.getItem("roomCode");
    const savedPlayerId = localStorage.getItem("playerId");
    return savedRoom && savedPlayerId
      ? { room: savedRoom, id: savedPlayerId }
      : null;
  });

  const connection = useSignalR();
  const navigate = useNavigate();

  const joinGame = async (isRejoining: boolean = false) => {
    if (!connection) return;

    const requestData: JoinTableRequest = isRejoining
      ? {
          roomCode: activeSession?.room || "",
          tableNumber: parseInt(localStorage.getItem("tableNumber") || "1", 10),
          nickName: localStorage.getItem("nickName") || "",
        }
      : {
          roomCode: roomCode || "",
          tableNumber: tableNumber,
          nickName: nickName,
        };

    try {
      const response: JoinTableResponse = await connection.invoke(
        "JoinTable",
        requestData,
      );

      if (!response) {
        alert("Room is non existent.");
        return;
      }

      localStorage.setItem("playerId", response.playerId);
      localStorage.setItem("roomCode", requestData.roomCode);
      localStorage.setItem("nickName", requestData.nickName);
      localStorage.setItem("tableNumber", requestData.tableNumber.toString());

      if (response.isGameAlreadyStarted) {
        navigate(`/${response.currentPhase}`, { replace: true });
      } else {
        navigate(`/waitingroom/${requestData.roomCode}`, { replace: true });
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleLeaveExistingGame = async () => {
    if (connection && activeSession) {
      try {
        await connection.invoke("LeaveTable", {
          roomCode: activeSession.room,
          playerId: activeSession.id,
        });
      } catch (error) {
        console.error("Kon tafel niet verlaten:", error);
      }
    }

    localStorage.removeItem("playerId");
    localStorage.removeItem("roomCode");
    localStorage.removeItem("nickName");
    localStorage.removeItem("tableNumber");
    setActiveSession(null);
    setRoomCode("");
    setNickname("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-xl border-2 border-teal-50 p-8 sm:p-10 text-center">
        <h1 className="text-4xl font-black text-teal-800 mb-2 tracking-tight">
          LIV<span className="text-amber-500">€</span> YOUR LIF
          <span className="text-amber-500">€</span>
        </h1>

        {activeSession ? (
          <div className="space-y-5 mt-6">
            <p className="text-teal-600 font-bold mb-4">
              {t("home_player_page.active_session")}{" "}
              <span className="text-xl bg-teal-100 px-3 py-1 rounded">
                {activeSession.room}
              </span>
            </p>

            <button
              onClick={() => joinGame(true)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-wider">
              {t("home_player_page.continue_game")}
            </button>

            <button
              onClick={handleLeaveExistingGame}
              className="w-full bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg uppercase tracking-wide border-2 border-rose-200 hover:border-rose-500">
              {t("home_player_page.leave_table")}{" "}
            </button>
          </div>
        ) : (
          <>
            <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-10 mt-2">
              {t("home_player_page.title", "Join een Spel")}
            </p>

            <div className="space-y-5">
              <InputField
                type="text"
                placeholder={t("home_player_page.room_code", "Kamer Code")}
                value={roomCode ?? ""}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />

              <InputField
                type="text"
                placeholder={t("home_player_page.nickname", "Jouw Naam")}
                value={nickName}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={15}
              />

              <InputField
                type="number"
                placeholder={t("home_player_page.table_number", "Tafel Nummer")}
                value={tableNumber || ""}
                onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                min={1}
                max={10}
              />

              <button
                onClick={() => joinGame(false)}
                className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.02] active:scale-95 text-xl uppercase tracking-wider">
                {t("home_player_page.join_game", "Start")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePlayerPage;
