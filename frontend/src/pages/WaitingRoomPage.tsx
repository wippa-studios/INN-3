import { useEffect } from "react"; // <-- useEffect toegevoegd
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSignalR } from "../hooks/useSignalR";
import { useNavigationBlocker } from "../hooks/useNavigationBlocker";
import NavigationBlockedModal from "../components/NavigationBlockedModal";

const WaitingRoomPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const connection = useSignalR();

  const { isBlocked, dismiss } = useNavigationBlocker();

  const { roomCode } = useParams<{ roomCode: string }>();
  const playerId = localStorage.getItem("playerId");

  // --- NIEUW: Luisteren naar het startschot van de docent ---
  useEffect(() => {
    if (!connection) return;

    connection.on("GameStarted", (startFase: string) => {
      console.log(
        "De docent heeft het spel gestart! Even 0.5s wachten op de database...",
      );

      const targetRoute = startFase ? `/${startFase}` : "/character-discovery";

      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 500);
    });

    connection.on("RoomClosed", () => {
      localStorage.removeItem("playerId");
      localStorage.removeItem("roomCode");
      localStorage.removeItem("nickName");
      localStorage.removeItem("tableNumber");
      navigate("/home", { replace: true });
    });

    return () => {
      connection.off("GameStarted");
      connection.off("RoomClosed");
    };
  }, [connection, navigate]);
  // ----------------------------------------------------------

  const handleLeave = async () => {
    if (connection && roomCode && playerId) {
      try {
        await connection.invoke("LeaveTable", {
          roomCode: roomCode,
          playerId: playerId,
        });

        localStorage.removeItem("playerId");
        localStorage.removeItem("roomCode");
        navigate("/home");
      } catch (error) {
        console.error("Error while leaving:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-xl border-2 border-teal-50 p-8 sm:p-10 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner border-4 border-teal-100">
          ⏳
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-2">
          {t("waiting_room.title", "Wachtruimte")}
        </h1>

        <p className="text-slate-500 font-medium mb-4">
          {t("waiting_room.message", "Je bent succesvol aangemeld voor kamer:")}
        </p>

        <div className="bg-teal-500 text-white text-4xl font-black py-3 px-10 rounded-2xl shadow-md mb-10 tracking-widest">
          {roomCode}
        </div>

        <div className="flex items-center gap-3 text-teal-600 font-bold animate-pulse mb-10 bg-teal-50 py-3 px-6 rounded-full">
          <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
          {t(
            "waiting_room.waiting_for_start",
            "Wachten tot de docent start...",
          )}
          <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
        </div>

        <button
          onClick={handleLeave}
          className="w-full bg-rose-100 hover:bg-rose-500 text-rose-600 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg uppercase tracking-wide border-2 border-rose-200 hover:border-rose-500">
          {t("waiting_room.leave_button", "Tafel verlaten")}
        </button>
      </div>

      <NavigationBlockedModal open={isBlocked} onDismiss={dismiss} />
    </div>
  );
};

export default WaitingRoomPage;
