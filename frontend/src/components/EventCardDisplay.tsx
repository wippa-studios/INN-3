import { useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import type { EventCard, EventCardOption } from "../types/EventCardType";

interface EventCardProps {
  card: EventCard;
  mode?: "choose" | "confirm" | "readonly";
  readOnlyConditionId?: string | null;
  onConfirm?: (cardId: string, conditionId: string | null) => void;
}

const isDiceCard = (card: EventCard) => card.type === "DiceRoll";

const EventCardDisplay: React.FC<EventCardProps> = ({
  card,
  mode = "choose",
  readOnlyConditionId,
  onConfirm,
}) => {
  const { t } = useTranslation("eventData");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [rolledOption, setRolledOption] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("nl-BE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(val));

  const renderImpact = (option: EventCardOption) => {
    if (option.multiplier === "family_members" && option.amount)
      return t(option.valueKey, { val: formatCurrency(option.amount) });
    if (option.amount && option.amount !== 0) {
      const formatted = formatCurrency(option.amount);
      return option.amount > 0 ? `+ ${formatted}` : `- ${formatted}`;
    }
    return t(option.valueKey);
  };

  const handleRoll = () => {
    setIsRolling(true);
    let counter = 0;
    const total = 15;
    const interval = setInterval(() => {
      const random =
        card.options[Math.floor(Math.random() * card.options.length)];
      setSelectedOption(random.conditionId);
      counter++;
      if (counter >= total) {
        clearInterval(interval);
        const final =
          card.options[Math.floor(Math.random() * card.options.length)];
        setRolledOption(final.conditionId);
        setSelectedOption(final.conditionId);
        setIsRolling(false);
      }
    }, 100);
  };

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col shadow-xl border-2 border-slate-100 cursor-default rounded-3xl">
      {/* TOP */}
      <div className="flex items-center p-5 bg-white">
        <div className="w-14 h-14 mr-4 shrink-0 flex items-center justify-center opacity-60">
          <img
            src={
              card.imageName ? `/${card.imageName}` : "/EventPlaceholder.svg"
            }
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <h2 className="text-lg font-black text-slate-800 uppercase leading-tight tracking-wide">
          {t(card.titleKey)}
        </h2>
      </div>

      {/* MIDDEN */}
      <div className="bg-[#F9BC2F] p-4 text-center flex items-center justify-center min-h-16">
        <p className="text-sm text-slate-900 font-medium leading-relaxed">
          {t(card.descriptionKey)}
        </p>
      </div>

      {/* OPTIES */}
      <div className="p-4 bg-white flex-1 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          {card.options.map((opt, i) => {
            const isActive =
              mode === "readonly"
                ? opt.conditionId === readOnlyConditionId
                : opt.conditionId === selectedOption ||
                  opt.conditionId === rolledOption;

            return (
              <div
                key={i}
                className={`flex text-xs min-h-10 transition-all rounded overflow-hidden
                  ${isActive ? "ring-2 ring-teal-500" : ""}
${mode === "readonly" && !isActive && isDiceCard(card) ? "opacity-30" : ""}
                `}>
                <div
                  className="w-1/2 p-2 flex items-center justify-center text-center font-bold text-slate-800 border-r-2 border-white"
                  style={{ backgroundColor: "#F9BC2F" }}>
                  {t(opt.labelKey)}
                </div>
                <div
                  className="w-1/2 p-2 flex items-center justify-center text-center font-medium text-slate-800"
                  style={{ backgroundColor: "#FEF9E7" }}>
                  {renderImpact(opt)}
                </div>
              </div>
            );
          })}
        </div>

        {/* CONFIRM ACTIES */}
        {mode === "confirm" && (
          <div className="mt-2 flex flex-col items-center gap-2">
            {isDiceCard(card) ? (
              <>
                {!rolledOption ? (
                  <button
                    onClick={handleRoll}
                    disabled={isRolling}
                    className="bg-amber-500 hover:bg-amber-400 text-white font-black py-2 px-8 rounded-full text-xs uppercase tracking-widest transition-all hover:scale-105">
                    {isRolling ? "🎲 🎲 🎲" : "🎲 " + t("event_cards.roll")}
                  </button>
                ) : (
                  <button
                    onClick={() => onConfirm?.(card.id, rolledOption)}
                    className="bg-teal-500 hover:bg-teal-400 text-white font-black py-2 px-8 rounded-full text-xs uppercase tracking-widest transition-all hover:scale-105">
                    {t("event_cards.confirm")}
                  </button>
                )}
              </>
            ) : (
              // CircleCount, InsuranceCheck, Fixed — gewoon confirm, geen selectie nodig
              <button
                onClick={() => onConfirm?.(card.id, null)}
                className="bg-teal-500 hover:bg-teal-400 text-white font-black py-2 px-8 rounded-full text-xs uppercase tracking-widest transition-all hover:scale-105">
                {t("event_cards.confirm")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCardDisplay;
