import type { CharacterResponse } from "./CharacterModel";

export interface Player {
  playerId: string;
  nickName: string;
  tableNumber: number;
  isOffline?: boolean;
  currentPhase?: string;
  assignedCharacter?: CharacterResponse;
}