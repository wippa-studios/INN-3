import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CharacterProfileCard from "../components/CharacterProfileCard";
import StudentPhaseCard from "../components/StudentPhaseCard";
import JobWheelOverlay from "../components/JobWheelOverlay";
import { useCharacter } from "../hooks/useCharacter";
import type { StudentPhaseSubmitRequest } from "../types/Requests";
import { useTranslation } from "react-i18next";

const StudentPhasePage = () => {
  const { isLoading, error, character, fetchCharacter } = useCharacter();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showWheel, setShowWheel] = useState(false);
  const [phasePayload, setPhasePayload] = useState<StudentPhaseSubmitRequest>();

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-teal-600">
        {t("general.loading")}
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-rose-500">{error}</div>;
  if (!character)
    return <div className="p-10 text-center">{t("general.no_role")}</div>;

  const targetJobIndex = character.career.jobs.findIndex(
    (job) => job.titleKey === character.chosenJob?.titleKey,
  );

  const safeJobIndex = targetJobIndex >= 0 ? targetJobIndex : 0;

  const handlePhaseComplete = (payload: StudentPhaseSubmitRequest) => {
    setPhasePayload(payload);
    setShowWheel(true);
  };

  const handleJobAssigned = async () => {
    setShowWheel(false);

    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("playerId");

    if (!roomCode || !playerId) {
      console.error("Kan data niet opslaan: RoomCode of PlayerId ontbreekt.");
      return;
    }

    const requestBody = {
      selections: phasePayload?.selections,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/student-phase`,
        requestBody,
      );

      console.log("✅ Succesvol opgeslagen in de backend!");

      await fetchCharacter();

      navigate("/game");
    } catch (err) {
      console.error("Fout bij het opslaan van de studentenfase:", err);
      alert(t("general.save_error"));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 relative min-h-screen">
      <CharacterProfileCard hideChosenJob={true} />

      <StudentPhaseCard onNext={handlePhaseComplete} />

      <JobWheelOverlay
        isOpen={showWheel}
        jobs={character.career.jobs}
        predeterminedJobIndex={safeJobIndex}
        onJobAssigned={handleJobAssigned}
      />
    </div>
  );
};

export default StudentPhasePage;
