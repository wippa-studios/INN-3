import { createContext } from "react";
import type { CharacterResponse } from "../types/CharacterModel";

export interface CharacterContextType {
  character: CharacterResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchCharacter: () => Promise<void>;
}

export const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined,
);
