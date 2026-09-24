import React from "react";
import CharacterProfileCard from "../components/CharacterProfileCard";
import HousingContent from "../components/dossier/HousingContent";
import LivingCostsContent from "../components/dossier/LivingCostsContent";
import InsuranceContent from "../components/dossier/InsuranceContent";
import MobilityContent from "../components/dossier/MobilityContent";
import SavingsContent from "../components/dossier/SavingsContent";
import InputSheet from "../components/InputSheet";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useCharacter } from "../hooks/useCharacter";
import StudentPhaseCard from "../components/StudentPhaseCard";
import EventCardDisplay from "../components/EventCardDisplay";
import eventList from "../assets/eventData.json";
import type { EventCard } from "../types/EventCardType";
import axios from "axios";
import { FaDice } from "react-icons/fa";
import type { SaveEventCardsRequest } from "../types/EventCardContracts";
import LivingSituationCard from "../components/LivingSituationCard";

const GamePage = () => {
  const { character } = useCharacter();
  const { t } = useTranslation(["input_sheet", "eventData"]);

  const [activeDossier, setActiveDossier] = React.useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [rightWidth, setRightWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [isStudentPhaseOpen, setIsStudentPhaseOpen] = React.useState(false);
  const [isLivingSituationOpen, setIsLivingSituationOpen] = useState(false);
  const [showEventCards, setShowEventCards] = useState(false);
  const [eventPhase, setEventPhase] = useState<
    "welcome" | "choosing" | "summary"
  >("welcome");
  const [currentSet, setCurrentSet] = useState(0);
  const [eventPacks, setEventPacks] = useState<EventCard[][]>([]);
  const [chosenCards, setChosenCards] = useState<
    { card: EventCard; conditionId: string | null }[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<EventCard | null>(null);
  const [eventCardsDone, setEventCardsDone] = useState(false);

  const createPacks = (): EventCard[][] => {
    const shuffled = [...eventList].sort(() => Math.random() - 0.5);
    return [
      shuffled.slice(0, 3) as EventCard[],
      shuffled.slice(3, 6) as EventCard[],
      shuffled.slice(6, 9) as EventCard[],
    ];
  };
  const fetchAndStartEventCards = async () => {
    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("playerId");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/getEventCards`,
      );
      const packs = Object.values(response.data) as EventCard[][];
      setEventPacks(packs);
    } catch (err) {
      console.error("Fallback naar lokale data:", err);
      setEventPacks(createPacks());
    }
    setShowEventCards(true);
    setEventPhase("welcome");
    setCurrentSet(0);
    setChosenCards([]);
  };

  const saveEventCardChoices = async () => {
    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("playerId");
    try {
      const payload: SaveEventCardsRequest = {
        choices: chosenCards.map(({ card, conditionId }) => ({
          cardId: card.id,
          conditionId: conditionId,
        })),
      };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/saveEventCardsChoices`,
        payload,
      );
    } catch (err) {
      console.error("Fout bij opslaan event card keuzes:", err);
    }
  };

  const startXRef = useRef(0);
  const startWidthRef = useRef(400);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = startXRef.current - e.clientX;
      const newWidth = startWidthRef.current + deltaX;
      if (newWidth > 200 && newWidth < 800) setRightWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Kolom 1: sidebar */}
      <div className="w-16 bg-white border-r border-slate-200 flex flex-col justify-between py-4 sticky top-0 h-screen">
        <div className="flex flex-col items-center gap-4">
          {activeDossier !== null && (
            <button
              onClick={() => setActiveDossier(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-black"
              title="Sluit categorie"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setActiveDossier("huisvesting")}
            title="Huisvesting"
            className={`hover:scale-130 transition-transform hover:opacity-80 ${activeDossier === "huisvesting" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/huisvestiging.svg" alt="" className="w-8 h-8" />
          </button>
          <button
            onClick={() => setActiveDossier("leefkosten")}
            title="Leefkosten"
            className={`hover:scale-130 transition-transform hover:opacity-80 ${activeDossier === "leefkosten" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/leefkosten.svg" alt="" className="w-8 h-8" />
          </button>
          <button
            onClick={() => setActiveDossier("mobiliteit")}
            title="Mobiliteit"
            className={`hover:scale-130 transition-transform hover:opacity-80 ${activeDossier === "mobiliteit" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/mobiliteit.svg" alt="" className="w-8 h-8" />
          </button>
          <button
            onClick={() => setActiveDossier("verzekeringen")}
            title="Verzekeringen"
            className={`hover:scale-130 transition-transform hover:opacity-80 ${activeDossier === "verzekeringen" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/verzekering.svg" alt="" className="w-8 h-8" />
          </button>
          <button
            onClick={() => setActiveDossier("sparenenbeleggen")}
            title="Sparen & Beleggen"
            className={`hover:scale-130 transition-transform hover:opacity-80 ${activeDossier === "sparenenbeleggen" ? "opacity-100" : "opacity-40"}`}
          >
            <img src="/sparenenbeleggen.svg" alt="" className="w-8 h-8" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pb-2">
          {eventCardsDone && (
            <button
              onClick={() => {
                setEventPhase("summary");
                setShowEventCards(true);
              }}
              title="Event cards bekijken"
              className="hover:scale-130 transition-transform opacity-40 hover:opacity-80"
            >
              <FaDice size={22} style={{ color: "#056b67" }} />{" "}
            </button>
          )}
          <button
            onClick={() => setIsLivingSituationOpen(true)}
            title="Leefsituatie bekijken"
            className="hover:scale-130 transition-transform opacity-40 hover:opacity-80"
          >
            <img src="/livingSituation.png" alt="" className="w-8 h-8" />
          </button>
          <button
            onClick={() => setIsStudentPhaseOpen(true)}
            title="Studentenfase bekijken"
            className="hover:scale-130 transition-transform opacity-40 hover:opacity-80"
          >
            <img src="/student.svg" alt="" className="w-8 h-8" />
          </button>
          <div
            className="relative"
            onMouseEnter={(e) =>
              ((
                e.currentTarget.querySelector("button") as HTMLElement
              ).style.transform = "scale(3)")
            }
            onMouseLeave={(e) => {
              (
                e.currentTarget.querySelector("button") as HTMLElement
              ).style.transform = "scale(1)";
            }}
          >
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-teal-500 transition-transform overflow-hidden"
              style={{
                transformOrigin: "bottom left",
                transform: isProfileOpen ? "scale(3)" : "scale(1)",
              }}
              title="Bekijk personnagefiche"
            >
              <img
                src={character ? `/${character.profile.id}.png` : "/char1.png"}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Kolom 2: dossiercontent */}
      <div className="flex-1 bg-slate-50 p-6 overflow-hidden">
        {activeDossier === null && (
          <div className="h-full flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-2 pt-8 pl-2">
              <div
                className="animate-bounce text-2xl"
                style={{ color: "#056b67" }}
              >
                ←
              </div>
              <p
                className="text-sm font-black uppercase tracking-[0.3em]"
                style={{ color: "#056b67" }}
              >
                {t("select_category")
                  .split("")
                  .map((char, i) => (
                    <span
                      key={i}
                      className="wave-letter"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
              </p>
            </div>
            <img
              src="/Logo_Vlek.svg"
              alt="Live Your Life"
              className="absolute self-center-safe w-150 opacity-50"
            />
          </div>
        )}
        {activeDossier === "huisvesting" && <HousingContent />}
        {activeDossier === "leefkosten" && <LivingCostsContent />}
        {activeDossier === "verzekeringen" && <InsuranceContent />}
        {activeDossier === "mobiliteit" && <MobilityContent />}
        {activeDossier === "sparenenbeleggen" && <SavingsContent />}
      </div>

      {/* Resizer */}
      <div
        className="w-1 bg-slate-200 hover:bg-teal-400 cursor-col-resize transition-colors"
        onMouseDown={(e) => {
          setIsDragging(true);
          startXRef.current = e.clientX;
          startWidthRef.current = rightWidth;
        }}
      />

      {/* Kolom 3: invulblad */}
      <div
        className="bg-white border-l border-slate-200 p-4 overflow-y-auto relative"
        style={{ width: `${rightWidth}px`, minWidth: "200px" }}
      >
        {rightWidth < 380 && (
          <div className="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-slate-200 to-transparent flex items-center justify-start pl-1 pointer-events-none">
            <span className="text:#056b67 text-10xl">◀</span>
          </div>
        )}
        <InputSheet onPhase2Complete={() => fetchAndStartEventCards()} />
      </div>

      {/* Profiel modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          onClick={() => setIsProfileOpen(false)}
        >
          <div className="flex items-start justify-center min-h-full py-8">
            <div
              className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                className="float-right text-slate-400 hover:text-slate-600"
              >
                x
              </button>
              <CharacterProfileCard />
            </div>
          </div>
        </div>
      )}

      {/* Studentenfase modal */}
      {isStudentPhaseOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          onClick={() => setIsStudentPhaseOpen(false)}
        >
          <div className="flex items-start justify-center min-h-full py-8">
            <div
              className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsStudentPhaseOpen(false)}
                className="float-right text-slate-400 hover:text-slate-600"
              >
                x
              </button>
              <StudentPhaseCard readOnly={true} />
            </div>
          </div>
        </div>
      )}

      {/* Livingsituation modal */}
      {isLivingSituationOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
          onClick={() => setIsLivingSituationOpen(false)}
        >
          <div className="flex items-start justify-center min-h-full py-8">
            <div
              className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLivingSituationOpen(false)}
                className="float-right text-slate-400 hover:text-slate-600"
              >
                x
              </button>
              <LivingSituationCard />
            </div>
          </div>
        </div>
      )}

      {/* Event cards modal */}
      {showEventCards && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div
            className="relative w-[60%] max-h-[85vh] opacity-100 rounded-3xl overflow-y-auto flex flex-col items-center justify-center p-8"
            style={{ backgroundColor: "#1a2f3a" }}
          >
            {" "}
            {/* WELKOMSTSCHERM */}
            {eventPhase === "welcome" && (
              <div className="flex flex-col items-center gap-8 text-center px-8">
                <div className="text-6xl">🎲</div>
                <h1 className="text-4xl font-black text-white uppercase tracking-widest">
                  Life happens...
                </h1>
                <p className="text-slate-300 text-lg max-w-md">
                  {t("event_cards.welcome_text", { ns: "eventData" })}
                </p>
                <button
                  onClick={() => setEventPhase("choosing")}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-white font-black py-4 px-12 rounded-full text-lg uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
                >
                  {t("event_cards.start", { ns: "eventData" })}
                </button>
              </div>
            )}
            {/* KIESSCHERM */}
            {eventPhase === "choosing" && eventPacks[currentSet] && (
              <div className="flex flex-col items-center gap-6 w-full px-4">
                <div className="text-center">
                  <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">
                    {currentSet + 1} / 3
                  </p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                    {t("event_cards.choose_one", { ns: "eventData" })}
                  </h2>
                </div>

                <div className="relative grid grid-cols-3 gap-6 w-full">
                  {eventPacks[currentSet].map((card) => (
                    <div
                      key={card.id}
                      onClick={() => !selectedCard && setSelectedCard(card)}
                      className={`cursor-pointer transition-all duration-300 rounded-3xl ${
                        selectedCard?.id === card.id
                          ? "invisible"
                          : selectedCard
                            ? "blur-sm opacity-40 pointer-events-none"
                            : "hover:scale-[1.01]"
                      }`}
                    >
                      <EventCardDisplay
                        card={card}
                        mode="choose"
                        onConfirm={() => {}}
                      />
                    </div>
                  ))}

                  {selectedCard && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-95">
                        <EventCardDisplay
                          card={selectedCard}
                          mode="confirm"
                          onConfirm={(cardId, conditionId) => {
                            setChosenCards((prev) => [
                              ...prev,
                              { card: selectedCard, conditionId },
                            ]);
                            setSelectedCard(null);
                            if (currentSet < 2) {
                              setCurrentSet((prev) => prev + 1);
                            } else {
                              setEventPhase("summary");
                            }
                          }}
                        />
                        <button
                          onClick={() => setSelectedCard(null)}
                          className="mt-2 w-full text-slate-300 hover:text-white text-xs text-center"
                        >
                          {t("event_cards.back", { ns: "eventData" })}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* SAMENVATTING */}
            {eventPhase === "summary" && (
              <div className="flex flex-col items-center gap-6 w-full px-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                  {t("event_cards.your_cards", { ns: "eventData" })}
                </h2>
                <div className="grid grid-cols-3 gap-6 w-full">
                  {chosenCards.map(({ card, conditionId }) => (
                    <EventCardDisplay
                      key={card.id}
                      card={card}
                      mode="readonly"
                      readOnlyConditionId={conditionId}
                    />
                  ))}
                </div>
                <button
                  onClick={async () => {
                    await saveEventCardChoices();
                    setShowEventCards(false);
                    setEventCardsDone(true);
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-black py-3 px-10 rounded-full uppercase tracking-widest transition-transform hover:scale-105"
                >
                  {t("event_cards.back_to_sheet", { ns: "eventData" })}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
