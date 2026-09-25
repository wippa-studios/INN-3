import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { useTranslation } from "react-i18next";
import type { Partner } from "../types/CharacterModel";
import Confetti from "react-confetti";

interface PartnerWheelOverlayProps {
  isOpen: boolean;
  partners: Partner[];
  predeterminedPartnerIndex: number;
  onPartnerAssigned: () => void;
}

const PartnerWheelOverlay = ({
  isOpen,
  partners,
  predeterminedPartnerIndex,
  onPartnerAssigned,
}: PartnerWheelOverlayProps) => {
  const { t } = useTranslation();

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    `€ ${amount.toLocaleString("nl-BE")}`;

  //we maken van currencyss een image zodat we ze netjes onder elkaar kunnen tonen in de wheel slices, 
  // aangezien die geen multiline text ondersteunen. 
  // We gebruiken hiervoor een inline SVG die we omzetten naar een data URI.
  
 const createMultilineTextURI = (wage: string, support: string) => {
   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="80">
    <text x="10" y="30" font-size="20">💶</text>
    <text x="40" y="30" font-family="sans-serif" font-size="18" font-weight="bold" fill="#000">${wage}</text>
    
    <text x="10" y="65" font-size="20">🤝</text>
    <text x="40" y="65" font-family="sans-serif" font-size="18" fill="#555">${support}</text>
  </svg>`;

   return `data:image/svg+xml,${encodeURIComponent(svg)}`;
 };

  const data = partners.map((partner) => ({
    image: {
      uri: createMultilineTextURI(
        formatCurrency(partner.wage),
        formatCurrency(partner.savings),
      ),
      offsetX: -50, // Duwt de tekst vanuit het midden naar de buitenrand.
      offsetY: 0, 
      landscape: true,
      sizeMultiplier: 0.8, 
    },
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      setPrizeIndex(predeterminedPartnerIndex);
      setMustSpin(true);
    }
  };

  const winningPartner = partners[predeterminedPartnerIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 flex flex-col items-center justify-center backdrop-blur-md p-4 transition-opacity duration-500">
      {!showResult ? (
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center max-w-lg w-full text-center border-4 border-teal-600 relative overflow-hidden">
          <h2 className="text-3xl font-black text-teal-800 mb-2">
            {t("partner_wheel.possible_partners")}
          </h2>
          <p className="text-slate-600 mb-6 font-medium">
            {t("partner_wheel.discover_partner")}
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
              fontSize={12}
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
            disabled={mustSpin}
          >
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
              {t("partner_wheel.congrats")}
            </h2>

            <div className="w-full overflow-hidden rounded-lg shadow-sm border border-slate-100 mb-8 overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-white font-black text-center">
                    <th className="bg-[#e07a5f] p-3 uppercase tracking-wider border-r border-white">
                      {t("profile_labels.partner_wage", "Wage")}
                    </th>
                    <th className="bg-[#2a9d8f] p-3 uppercase tracking-wider border-r border-white">
                      {t("profile_labels.partner_support", "Savings")}
                    </th>
                    <th className="bg-amber-50"></th>{" "}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-50 text-center text-slate-700">
                    <td className="p-4 border-r border-white">
                      {formatCurrency(winningPartner.wage)}
                    </td>
                    <td className="p-4 border-r border-white font-black text-black">
                      {formatCurrency(winningPartner.savings)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 uppercase tracking-wider"
              onClick={() => {
                setShowResult(false);
                onPartnerAssigned();
              }}
            >
              {t("job_wheel.accept")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerWheelOverlay;
