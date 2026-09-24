import React, { useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import type { CharacterResponse } from "../types/CharacterModel";
import { CharacterContext } from "./CharacterContext";

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<CharacterResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = async (retryCount = 0) => {
    if (retryCount === 0) setIsLoading(true);
    setError(null);

    const roomCode = localStorage.getItem("roomCode");
    const playerId = localStorage.getItem("playerId");

    if (!roomCode || !playerId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get<CharacterResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/game/${roomCode}/player/${playerId}/character`,
      );
      setCharacter(response.data);
      setIsLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404 && retryCount < 10) {
          console.warn(
            `Database is nog aan het laden (poging ${retryCount + 1}/10). 1 seconde wachten...`,
          );
          setTimeout(() => fetchCharacter(retryCount + 1), 5000);
          return;
        }
      }

      console.error("Fout bij ophalen van character context:", err);
      setError("Kon je rol niet ophalen.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  return (
    <CharacterContext.Provider
      value={{ character, isLoading, error, fetchCharacter }}
    >
      {children}
    </CharacterContext.Provider>
  );
};
