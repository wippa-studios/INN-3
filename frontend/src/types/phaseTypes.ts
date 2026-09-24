
export interface CategoryData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  maxSlots: number;
  preFilledSlots: number;
  slotValues?: number[];
}

export interface SavedPhaseData {
  characterId: string;
  phase: string;
  selections: {
    [key: string]: number;
  };
}

export interface JobData {
  titleKey: string; // We gebruiken een vertaalsleutel voor de jobtitel
  perksKey?: string; 
  start: { brut: number; net: number };
  avg: { brut: number; net: number };
  pension: number;
}

export interface CharacterProfileData {
  profile: {
    id: string;
    nameKey: string;
    age: number;
    educationKey: string;
    interestsKey: string;
    infoKey: string;
    experienceKey: string; // Bv. "7 jaar = 84 maanden"
  };
  career: {
    parentalSupport: number | string | null;
    generalPerksKey?: string;
    jobs: JobData[];
  };
}
  
 

