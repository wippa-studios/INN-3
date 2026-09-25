import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { useTranslation } from "react-i18next";
import Confetti from "react-confetti";

interface ChildrenWheelOverlayProps {
  isOpen: boolean;
  predeterminedChildrenIndex: number;
  onChildrenAssigned: () => void;
}

const ChildrenWheelOverlay = ({
  isOpen,
  predeterminedChildrenIndex,
  onChildrenAssigned,
}: ChildrenWheelOverlayProps) => {
  const { t } = useTranslation();

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const childrenOptions = [0, 1, 2, 3];

  // Dynamische functie die het juiste aantal icoontjes genereert
 const createChildrenIconURI = (count: number) => {
   const displayString = count === 0 ? "0" : Array(count).fill("👶").join("");

   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60">
      <text x="60" y="38" font-size="24" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="#000">${displayString}</text>
    </svg>`;

   return `data:image/svg+xml,${encodeURIComponent(svg)}`;
 };

  // We mappen over de opties en bouwen de data-array voor het wiel
  const data = childrenOptions.map((count) => ({
    image: {
      uri: createChildrenIconURI(count),
      offsetX: 60, // Duwt de icoontjes naar de buitenrand
      offsetY: 0,
      landscape: true,
      sizeMultiplier: 0.60,
    },
  }));

  const handleSpinClick = () => {
    if (!mustSpin) {
      setPrizeIndex(predeterminedChildrenIndex);
      setMustSpin(true);
    }
  };

  const winningChildren = childrenOptions[predeterminedChildrenIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 flex flex-col items-center justify-center backdrop-blur-md p-4 transition-opacity duration-500">
      {!showResult ? (
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center max-w-lg w-full text-center border-4 border-teal-600 relative overflow-hidden">
          <h2 className="text-3xl font-black text-teal-800 mb-2">
            {t("children_wheel.possible_children", "Jouw Toekomst")}
          </h2>
          <p className="text-slate-600 mb-6 font-medium">
            {t("children_wheel.discover_children")}
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
              fontSize={18}
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
              {t("children_wheel.congrats")}
            </h2>

            <div className="w-full flex flex-col justify-center items-center rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-inner py-12 mb-8">
              {winningChildren === 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-7xl font-black text-slate-400 mb-4">
                    0
                  </span>
                  <p className="text-xl font-bold text-slate-600">
                    {t(
                      "children_wheel.no_children",
                      "Geen kinderen (voorlopig!)",
                    )}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex gap-4 text-7xl mb-4">
                    {Array(winningChildren)
                      .fill("👶")
                      .map((emoji, index) => (
                        <span
                          key={index}
                          className="drop-shadow-md animate-bounce-slight"
                        >
                          {emoji}
                        </span>
                      ))}
                  </div>
                  <p className="text-xl font-bold text-teal-800">
                    {t(
                      "children_wheel.you_got_children",
                      `Je krijgt ${winningChildren} ${winningChildren === 1 ? "kind" : "kinderen"}!`,
                    )}
                  </p>
                </div>
              )}
            </div>

            <button
              className="bg-teal-600 hover:bg-teal-700 text-white font-black py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 uppercase tracking-wider"
              onClick={() => {
                setShowResult(false);
                onChildrenAssigned();
              }}
            >
              {t("job_wheel.accept")}{" "}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChildrenWheelOverlay;
