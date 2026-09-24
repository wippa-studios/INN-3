import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { useTranslation } from "react-i18next";
import type { Job } from "../types/CharacterModel";
import Confetti from "react-confetti";

interface JobWheelOverlayProps {
  isOpen: boolean;
  jobs: Job[];
  predeterminedJobIndex: number;
  onJobAssigned: () => void;
}

const JobWheelOverlay = ({
  isOpen,
  jobs,
  predeterminedJobIndex,
  onJobAssigned,
}: JobWheelOverlayProps) => {
  const { t } = useTranslation();

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const data = jobs.map((job) => ({
    option: t(job.titleKey),
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      setPrizeIndex(predeterminedJobIndex);
      setMustSpin(true);
    }
  };

  const formatCurrency = (amount: number) =>
    `€ ${amount.toLocaleString("nl-BE")}`;

  const winningJob = jobs[predeterminedJobIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 flex flex-col items-center justify-center backdrop-blur-md p-4 transition-opacity duration-500">
      {!showResult ? (
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center max-w-lg w-full text-center border-4 border-teal-600 relative overflow-hidden">
          <h2 className="text-3xl font-black text-teal-800 mb-2">
            {t("profile_labels.possible_jobs", "Jouw Toekomst")}
          </h2>
          <p className="text-slate-600 mb-6 font-medium">
            {t("job_wheel.discover_job")}
          </p>

          <div className="mb-8 pointer-events-none drop-shadow-2xl">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeIndex}
              data={data}
              spinDuration={0.3}
              backgroundColors={["#f9bc2f", "#f08666", "#11b0a5"]}
              textColors={["#000000"]}
              outerBorderColor="#ffffff"
              outerBorderWidth={5}
              innerBorderColor="#ffffff"
              innerBorderWidth={3}
              radiusLineColor="#ffffff"
              radiusLineWidth={2}
              perpendicularText={true}
              fontSize={14}
              textDistance={55}
              onStopSpinning={() => {
                setMustSpin(false);
                setTimeout(() => setShowResult(true), 400);
              }}
            />
          </div>

          <button
            className={`font-black py-4 px-12 rounded-full tracking-widest text-lg transition-all duration-150 ${
              mustSpin
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400 text-white shadow-[0_6px_0_0_#b45309] hover:shadow-[0_2px_0_0_#b45309] hover:translate-y-[4px] cursor-pointer"
            }`}
            onClick={handleSpinClick}
            disabled={mustSpin}>
            {mustSpin ? t("job_wheel.spinning") : t("job_wheel.spin")}
          </button>
        </div>
      ) : (
        <>
          <Confetti
            recycle={false}
            numberOfPieces={500}
            initialVelocityY={20}
            gravity={1}
          />
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col items-center max-w-5xl w-full text-center border-4 border-amber-400 animate-bounce-slight overflow-x-auto">
            <h2 className="text-xl font-black text-teal-900 uppercase tracking-widest mb-8">
              {t("job_wheel.congrats")}{" "}
            </h2>

            <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-100 mb-8 overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-white font-black text-center">
                    <th className="bg-amber-50 border-r border-white"></th>
                    <th
                      colSpan={2}
                      className="bg-[#e07a5f] p-3 uppercase tracking-wider border-r border-white">
                      {t("profile_labels.phase_1", "Eerste Werkfase")}
                    </th>
                    <th
                      colSpan={2}
                      className="bg-[#2a9d8f] p-3 uppercase tracking-wider border-r border-white">
                      {t("profile_labels.phase_2", "Tweede Werkfase")}
                    </th>
                    <th className="bg-amber-50"></th>{" "}
                  </tr>
                  <tr className="text-teal-900 text-xs font-bold uppercase tracking-wider text-center">
                    <th className="bg-[#fcebb6] p-3 border-r border-white text-left w-1/4">
                      {"Job"}
                    </th>
                    <th className="bg-[#f4a261] bg-opacity-30 p-3 border-r border-white">
                      {t(
                        "profile_labels.brut_start",
                        "Bruto Maandloon Starter",
                      )}
                    </th>
                    <th className="bg-[#f4a261] bg-opacity-30 p-3 border-r border-white">
                      {t("profile_labels.net_start", "Netto Maandloon Starter")}
                    </th>
                    <th className="bg-teal-100 p-3 border-r border-white">
                      {t(
                        "profile_labels.avg_brut",
                        "Gemiddeld Bruto Maandloon",
                      )}
                    </th>
                    <th className="bg-teal-100 p-3 border-r border-white">
                      {t("profile_labels.avg_net", "Gemiddeld Netto Maandloon")}
                    </th>
                    <th className="bg-[#e9c46a] p-3 text-teal-900">
                      {t("profile_labels.pension", "Netto Pensioen-uitkering")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-50 text-center text-slate-700">
                    <td className="p-4 border-r border-white text-left font-bold text-teal-900">
                      {t(winningJob.titleKey)}
                    </td>
                    <td className="p-4 border-r border-white">
                      {formatCurrency(winningJob.startBrut)}
                    </td>
                    <td className="p-4 border-r border-white font-black text-black">
                      {formatCurrency(winningJob.startNet)}
                    </td>
                    <td className="p-4 border-r border-white">
                      {formatCurrency(winningJob.avgBrut)}
                    </td>
                    <td className="p-4 border-r border-white font-black text-black">
                      {formatCurrency(winningJob.avgNet)}
                    </td>
                    <td className="p-4 border-l border-white bg-amber-50 font-medium">
                      {formatCurrency(winningJob.pension)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 uppercase tracking-wider"
              onClick={() => {
                setShowResult(false);
                onJobAssigned();
              }}>
              {t("job_wheel.accept")}{" "}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobWheelOverlay;
