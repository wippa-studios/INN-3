import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/StudentPhaseCard.css";
import type { CategoryData, SavedPhaseData } from "../types/phaseTypes";
import CategoryItem from "./CategoryItem";
import { useCharacter } from "../hooks/useCharacter";

interface StudentPhaseCardProps {
  onNext?: (savedData: SavedPhaseData) => void;
  readOnly?: boolean;
}

const StudentPhaseCard = ({ onNext, readOnly = false }) => {
  const { t } = useTranslation();

  const { character } = useCharacter();

  const [userSelections, setUserSelections] = useState<{
    [key: string]: number;
  }>({
    volunteering: 0,
    social: 0,
    family: 0,
    education: 0,
    job_spend: 0,
    job_save: 0,
    health: 0,
  });

  if (!character) return null;

  const data = character.studentPhase;
  const characterName = t(character.profile.nameKey);

  const maxAllocatablePoints = character.allocatablePoints;

  const totalUserPointsUsed = Object.values(userSelections).reduce(
    (sum, val) => sum + val,
    0,
  );

  const isSelectionComplete = totalUserPointsUsed === maxAllocatablePoints;

  const toggleSelection = (
    categoryId: string,
    index: number,
    isPreFilled: boolean,
    preFilledSlots: number,
  ) => {
    if (isPreFilled) return;

    setUserSelections((prev) => {
      const currentExtraPoints = prev[categoryId];
      const indexToClickForAdd = preFilledSlots + currentExtraPoints;
      const indexToClickForRemove = preFilledSlots + currentExtraPoints - 1;

      if (index === indexToClickForRemove) {
        return { ...prev, [categoryId]: currentExtraPoints - 1 };
      } else if (index === indexToClickForAdd) {
        if (totalUserPointsUsed >= maxAllocatablePoints) {
          alert(
            t("studentPhase.alert_max_choices", { max: maxAllocatablePoints }),
          );
          return prev;
        }
        return { ...prev, [categoryId]: currentExtraPoints + 1 };
      }

      return prev;
    });
  };

  const handleSave = () => {
    const finalSelections: { [key: string]: number } = {};

    data.categories.forEach((cat: CategoryData) => {
      finalSelections[cat.id] = cat.preFilledSlots + userSelections[cat.id];
    });

    const payload = {
      characterId: character.profile.id,
      phase: "studentPhase",
      selections: finalSelections,
    };

    console.log(
      "Klaar om naar backend te sturen:",
      JSON.stringify(payload, null, 2),
    );

    if (onNext) {
      onNext(payload);
    } else {
      alert(t("general.dev_saved"));
    }
  };

  const categories = data.categories as CategoryData[];

  return (
    <div className="card-container">
      <div className="top-header">{t("studentPhase.title")}</div>
      <div className="personage-title">
        {t("studentPhase.character_label")}: {characterName}
      </div>

      <div className="grid-container">
        <div className="intro-block">
          {readOnly ? (
            <p
              className="font-black uppercase tracking-widest text-base text-center w-full flex items-center justify-center h-full"
              style={{ color: "#6a8f4a" }}>
              {t("studentPhase.readonly_instructions")}
            </p>
          ) : (
            t("studentPhase.instructions")
          )}
        </div>
        {categories.map((cat: CategoryData) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            userSelectionCount={userSelections[cat.id]}
            onToggle={toggleSelection}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* ONDERSTE DEEL: Actie Footer */}
      {/* Marges verkleind en border-white gebruikt zodat hij matcht met je grid-lijnen */}
      {!readOnly && (
        <div className="mt-4 pt-6 pb-2 flex flex-col items-center justify-center border-t-2 border-white w-full">
          {!isSelectionComplete && (
            <p className="text-slate-600 font-medium italic mb-4">
              {t("studentPhase.choices_remaining", {
                count: maxAllocatablePoints - totalUserPointsUsed,
              })}
            </p>
          )}
          <button
            className={`font-bold py-3 px-12 rounded-full tracking-wider transition-all duration-300 ${
              isSelectionComplete
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:-translate-y-0.5 cursor-pointer"
                : "bg-slate-200/70 text-slate-400 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={!isSelectionComplete}>
            {t("studentPhase.next_button", "VOLGENDE")}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentPhaseCard;
