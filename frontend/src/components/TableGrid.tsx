import React from "react";
import { useTranslation } from "react-i18next";
import type { Player } from "../types/Models";

const PlayerListItem: React.FC<{ player: Player }> = ({ player }) => {
  const { t } = useTranslation();

  // Helper functie om de fase visueel aantrekkelijk te maken
  const getPhaseDisplay = (phase?: string) => {
    if (player.isOffline)
      return {
        icon: "🔌",
        label: t("phases.offline", "Offline"),
        color: "text-rose-500 bg-rose-100",
      };

    switch (phase?.toLowerCase()) {
      case "waiting":
        return {
          icon: "⏳",
          label: t("phases.waiting", "Wachtruimte"),
          color: "text-amber-600 bg-amber-100",
        };
      case "student-phase":
        return {
          icon: "🎓",
          label: t("phases.student", "Studentenfase"),
          color: "text-blue-600 bg-blue-100",
        };
      case "first-work-phase":
        return {
          icon: "💼",
          label: t("phases.first_work", "Eerste Werkfase"),
          color: "text-indigo-600 bg-indigo-100",
        };
      case "second-work-phase":
        return {
          icon: "🏢",
          label: t("phases.second_work", "Tweede Werkfase"),
          color: "text-purple-600 bg-purple-100",
        };
      default:
        return {
          icon: "🎮",
          label: t("phases.playing", "In Game"),
          color: "text-teal-600 bg-teal-100",
        };
    }
  };

  const phaseInfo = getPhaseDisplay(player.currentPhase);

  return (
    <li
      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
        player.isOffline
          ? "bg-rose-50 border-rose-200 text-rose-500 opacity-90"
          : "bg-white border-teal-100 text-slate-700 shadow-sm hover:border-teal-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Icoon avatar veranderd naar fase-icoon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full text-xl ${phaseInfo.color.split(" ")[1]}`}
        >
          {phaseInfo.icon}
        </div>

        {/* Naam en Fase onder elkaar gezet */}
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-wide ${player.isOffline ? "line-through opacity-75" : ""}`}
          >
            {player.nickName}
          </span>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${phaseInfo.color.split(" ")[0]}`}
          >
            {phaseInfo.label}
          </span>
        </div>
      </div>

      {/* Online/Offline indicator bolletje */}
      <span className="flex h-3 w-3 relative mr-1">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${player.isOffline ? "bg-rose-400" : "hidden"}`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${player.isOffline ? "bg-rose-500" : "bg-teal-400"}`}
        ></span>
      </span>
    </li>
  );
};

const TableCard: React.FC<{ tableNum: number; players: Player[] }> = ({
  tableNum,
  players,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden flex flex-col">
      <div className="bg-teal-600 text-white font-extrabold text-center py-4 text-xl tracking-widest uppercase shadow-inner">
        {t("supervisor_page.table", "Tafel")} {tableNum}
      </div>

      <div className="p-5 flex-grow bg-slate-50 min-h-[180px]">
        {players.length === 0 ? (
          <div className="text-teal-600/50 font-medium italic text-center mt-8">
            {t("supervisor_page.waiting", "Wachten op spelers...")}
          </div>
        ) : (
          <ul className="space-y-3">
            {players.map((player) => (
              <PlayerListItem key={player.playerId} player={player} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

interface TableGridProps {
  players: Player[];
}

const TableGrid: React.FC<TableGridProps> = ({ players }) => {
  const maxTable = Math.max(4, ...players.map((p) => p.tableNumber));
  const tables = Array.from({ length: maxTable }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {tables.map((tableNum) => (
        <TableCard
          key={tableNum}
          tableNum={tableNum}
          players={players.filter((p) => p.tableNumber === tableNum)}
        />
      ))}
    </div>
  );
};

export default TableGrid;
