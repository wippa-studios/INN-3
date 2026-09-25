import { useState } from "react";
import EventCardDisplay from "../components/EventCardDisplay";
import eventList from "../assets/eventData.json";
import type { EventCard } from "../types/EventCardType";

//test-pakjes met telkens 3 kaarten
const testPacks = [
  ["second_car", "divorce", "car_accident_parked"],
  ["car_accident_hail", "car_accident_traffic_jam", "inheritance"],
  ["house_on_fire", "storm_damage_trampoline", "storm_damage_roof"],
  ["dismissal", "promotion", "new_job"],
  ["illness_work", "financial_support", "holiday"],
  ["leaking_roof", "housing_costs_2", "hospital_treatment"],
  ["housing_costs_1", "illness_dice", "depression"],
];

const EventPage = () => {
  // Welk pakje zijn we momenteel aan het testen? (0, 1, 2 of 3)
  const [packIndex, setPackIndex] = useState(0);

  // Haal de 3 ID's op van het huidige pakje
  const cardIdsToDisplay = testPacks[packIndex];

  // State to hold the final selection
  const [confirmedSelection, setConfirmedSelection] = useState<{
    cardId: string;
    conditionId: string | null;
  } | null>(null);

  // Zoek de kaarten op in de JSON-lijst
  const cardsToRender = cardIdsToDisplay
    .map((id) => eventList.find((card) => card.id === id))
    .filter(Boolean) as EventCard[];

  const handleCardConfirmed = (cardId: string, conditionId: string | null) => {
    setConfirmedSelection({ cardId, conditionId });

    console.log("===== SENDING TO BACKEND =====");
    console.log("Player chose Card ID:", cardId);
    console.log("With Condition/Key:", conditionId);
    console.log("=================================");
  };

  // Handig knopje om naar het volgende pakje te gaan om te testen
  const handleNextPack = () => {
    setConfirmedSelection(null); // Reset de gemaakte keuze
    setPackIndex((prev) => (prev + 1) % testPacks.length); // Ga naar volgend pakje (en begin terug bij 0 na de laatste)
  };

  // Zoek de bevestigde kaart op (als er een is gekozen)
  const confirmedCard = confirmedSelection
    ? eventList.find((c) => c.id === confirmedSelection.cardId)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-center text-slate-700 mb-4 uppercase tracking-wide">
          {confirmedSelection
            ? "Jouw Keuze"
            : `Event Cards (Test Pakje ${packIndex + 1})`}
        </h1>

        {/* TEST KNOPPEN */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={handleNextPack}
            className="px-6 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold uppercase rounded shadow-sm transition-colors"
          >
            Laad volgend pakje 
          </button>
          {confirmedSelection && (
            <button
              onClick={() => setConfirmedSelection(null)}
              className="px-6 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold uppercase rounded shadow-sm transition-colors"
            >
              Reset Keuze ❌
            </button>
          )}
        </div>

        {/* Als de speler gekozen heeft: Toon 1 read-only kaart */}
        {confirmedSelection && confirmedCard ? (
          <div className="flex flex-col items-center animate-fade-in">
            <EventCardDisplay
              card={confirmedCard as EventCard}
              readOnlyConditionId={confirmedSelection.conditionId}
            />
          </div>
        ) : (
          /* Anders: Toon het grid met de 3 kaarten om uit te kiezen */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-5">
            {cardsToRender.map((card) => (
              <EventCardDisplay
                key={card.id}
                card={card}
                onConfirm={handleCardConfirmed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;
