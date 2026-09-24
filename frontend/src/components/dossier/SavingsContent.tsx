import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import dossierData from "../../assets/dossierData.json";
import type { InvestmentTableResponse } from "../../types/InvestmentModel";

const fmt = (value: number) =>
  `€ ${value.toLocaleString("nl-BE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SavingsContent = () => {
  const { t } = useTranslation("dossier_info");
  const savingsOptions = dossierData.savings.options;
  const [investmentData, setInvestmentData] =
    useState<InvestmentTableResponse | null>(null);

  useEffect(() => {
    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("playerId");
    if (!roomCode || !playerId) return;

    axios
      .get<InvestmentTableResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/investments`,
      )
      .then((res) => setInvestmentData(res.data))
      .catch((err) => console.error("Kon beleggingsdata niet ophalen:", err));
  }, []);

  const scrollToOverview = () => {
    document
      .getElementById("returns-overview")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const isScrollableReturnRow = (optionId: string) =>
    investmentData && (optionId === "savings" || optionId === "investment");

  return (
    <div className="p-4 text-xs overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-4">
        <img src="/sparenenbeleggen.svg" alt="" className="w-5 h-5" />
        <h2 className="font-black uppercase tracking-wide text-sm">
          {t("savings.title")}
        </h2>
      </div>

      {savingsOptions.map((option) => (
        <div key={option.id} className="mb-6">
          <div
            className="px-2 py-2 mb-0 text-xs font-black text-center uppercase tracking-wide text-white"
            style={{ backgroundColor: "#1ea798" }}>
            {t(option.nameKey)}
          </div>

          <table className="w-full border-collapse border-t-2 border-white">
            <tbody>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white w-1/3"
                  style={{ backgroundColor: "#1ea798" }}>
                  {t("savings.headers.amount")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#D8F1EF" }}>
                  {t(option.amountKey)}
                </td>
              </tr>
              <tr className="border-b-2 border-white">
                <td
                  className="p-2 font-bold border-r-2 border-white"
                  style={{ backgroundColor: "#1ea798" }}>
                  {t("savings.headers.return")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#D8F1EF" }}>
                  {isScrollableReturnRow(option.id) ? (
                    <button
                      onClick={scrollToOverview}
                      className="underline text-left w-full hover:opacity-70 transition-opacity">
                      {t(option.returnKey)} ↓
                    </button>
                  ) : (
                    t(option.returnKey)
                  )}
                </td>
              </tr>
              <tr>
                <td
                  className="p-2 font-bold border-r-2 border-white"
                  style={{ backgroundColor: "#1ea798" }}>
                  {t("savings.headers.info")}
                </td>
                <td className="p-2" style={{ backgroundColor: "#D8F1EF" }}>
                  {t(option.infoKey)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      <div
        className="p-3 rounded text-xs mt-2"
        style={{ backgroundColor: "#E8E0F0" }}>
        <p>
          ➜{" "}
          <a
            href="https://www.wikifin.be"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold">
            {t("savings.more_info")}
          </a>
        </p>
      </div>

      {investmentData && (
        <section id="returns-overview" className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <img src="/sparenenbeleggen.svg" alt="" className="w-5 h-5" />
            <h2 className="font-black uppercase tracking-wide text-sm">
              {t("savings.returns_overview.title")}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="border-collapse text-[10px] w-full">
              <thead>
                <tr>
                  {[
                    "principal",
                    "inflation",
                    "savings",
                    "conservative",
                    "neutral",
                    "dynamic",
                  ].map((key) => (
                    <th
                      key={key}
                      className="p-2 text-white font-bold text-center border-r-2 border-b-2 border-white whitespace-nowrap"
                      style={{ backgroundColor: "#1ea798" }}>
                      {t(`savings.returns_overview.headers.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investmentData.table.map((row) => (
                  <tr key={row.principal}>
                    <td
                      className="p-2 font-bold text-right border-r-2 border-b border-white whitespace-nowrap"
                      style={{ backgroundColor: "#1ea798", color: "white" }}>
                      € {row.principal.toLocaleString("nl-BE")}
                    </td>
                    <td
                      className="p-2 text-right border-r-2 border-b border-white whitespace-nowrap"
                      style={{ backgroundColor: "#fde8e8" }}>
                      {fmt(row.inflationImpact)}
                    </td>
                    <td
                      className="p-2 text-right border-r-2 border-b border-white whitespace-nowrap"
                      style={{ backgroundColor: "#D8F1EF" }}>
                      {fmt(row.savingsReturn)}
                    </td>
                    <td
                      className="p-2 text-right border-r-2 border-b border-white whitespace-nowrap"
                      style={{ backgroundColor: "#D8F1EF" }}>
                      {fmt(row.returns["conservative"])}
                    </td>
                    <td
                      className="p-2 text-right border-r-2 border-b border-white whitespace-nowrap font-bold"
                      style={{ backgroundColor: "#c0e8e4" }}>
                      {fmt(row.returns["neutral"])}
                    </td>
                    <td
                      className="p-2 text-right border-b border-white whitespace-nowrap"
                      style={{ backgroundColor: "#D8F1EF" }}>
                      {fmt(row.returns["dynamic"])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-[10px] text-slate-400 italic">
            * {t("savings.returns_overview.footnote")}
          </p>
        </section>
      )}
    </div>
  );
};

export default SavingsContent;
