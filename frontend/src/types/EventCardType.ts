

export type EventCardType = 
  | "Fixed" 
  | "InsuranceCheck" 
  | "DiceRoll" 
  | "CircleCount" 
  | "Choice";

export interface EventCardOption {
  conditionId: string;
  labelKey: string;
  valueKey: string;
  amount?: number | null;        // Optioneel
  usesFranchise?: boolean;       // Optioneel
  multiplier?: string;           // Optioneel
}

export interface EventCard {
  id: string;
  titleKey: string;
  descriptionKey: string;
  type: EventCardType;
  relatedSkill?: string;         // Optioneel
  requiredInsurance?: string;    // Optioneel
  options: EventCardOption[];
  imageName?: string;  
}