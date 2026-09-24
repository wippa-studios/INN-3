import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCharacter } from "../hooks/useCharacter.tsx";

const CharacterDiscoveryPage = () => {
  const { t } = useTranslation();

  const { character, isLoading, error, fetchCharacter } = useCharacter();

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!character && !isLoading && !error) {
      fetchCharacter();
    }
  }, [character, isLoading, error, fetchCharacter]);

  const handleContinue = () => {
    navigate("/student-phase");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-teal-600 text-xl animate-pulse">
        {t("character_discovery.loading")}
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-rose-500 text-xl">
        {error}
      </div>
    );
  }

  const profile = character?.profile;

  const img_url = `${profile?.id}.png`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-teal-800 mb-2">
        {t("character_discovery.title")}
      </h1>
      <p className="text-slate-600 mb-8">{t("character_discovery.subtitle")}</p>

      <div className="flex flex-wrap justify-center gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            onClick={() =>
              selectedCardIndex === null && setSelectedCardIndex(i)
            }
            className={`w-32 h-48 bg-teal-600 rounded-xl shadow-lg cursor-pointer transition-all duration-500
              ${selectedCardIndex === i ? "rotate-y-180 scale-110" : ""}
              ${selectedCardIndex !== null && selectedCardIndex !== i ? "opacity-20 scale-90 cursor-not-allowed" : ""}
            `}
            style={{
              transformStyle: "preserve-3d",
              transform:
                selectedCardIndex === i ? "rotateY(180deg)" : "rotateY(0deg)",
            }}>
            {/* Voorkant */}
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-3xl backface-hidden"
              style={{ backfaceVisibility: "hidden" }}>
              ?
            </div>

            {/* Achterkant (met echte data) */}
            <div
              className="absolute inset-0 bg-white rounded-xl flex flex-col items-center justify-between py-5 px-2 backface-hidden shadow-lg border-4 border-amber-400"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}>
              <h3 className="font-black text-teal-900 text-base text-center leading-tight">
                {profile?.nameKey ? t(profile.nameKey) : "?"}
              </h3>

              <div className="w-16 h-16 rounded-full border-2 border-teal-100 shadow-sm overflow-hidden flex-shrink-0 my-2 bg-slate-50">
                <img
                  src={img_url}
                  alt="Character"
                  className="w-full h-full object-cover"
                />
              </div>

              {profile?.age && (
                <div className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-inner border border-amber-200 flex-shrink-0">
                  {profile.age} {t("profile_labels.years", "jaar")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCardIndex !== null && (
        <button
          onClick={handleContinue}
          className="mt-12 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full animate-bounce shadow-lg">
          {t("character_discovery.continue")}{" "}
        </button>
      )}
    </div>
  );
};

export default CharacterDiscoveryPage;
