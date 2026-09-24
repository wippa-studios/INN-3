import { useContext } from "react";
import { CharacterContext } from "../contexts/CharacterContext";

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  
  if (context === undefined) {
    throw new Error("useCharacter moet binnen een CharacterProvider gebruikt worden");
  }
  
  return context;
};