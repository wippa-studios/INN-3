export interface CharacterProfile {
  id: string;
  nameKey: string;
  age: number;
  educationKey: string;
  interestKey: string;
  infoKey: string;
  experienceKey: string;
  parentalSupportKey: string;
  experienceInMonths: number;
}

export interface StudentCategory {
  id: string;
  titleKey: string;
  descriptionKey: string;
  preFilledSlots: number;
  maxSlots: number;
}

export interface StudentPhaseData {
  categories: StudentCategory[];
}

export interface Job {
  titleKey: string;
  startNet: number;
  startBrut: number;
  avgBrut: number;
  avgNet: number;
  pension: number;
  hasBenefits: boolean;
}

export interface CareerInfo {
  perksKey: string;
  jobs: Job[];
}

export interface Partner {
  id: string;
  wageKey: string;
  wage: number;
  savingsKey: string;
  savings: number;
}

export interface LivingSituation {
  children: number;
  partner: Partner;
  allPartners: Partner[];
  isShown: boolean;
}

//HEAD INTERFACE
export interface CharacterResponse {
  profile: CharacterProfile;
  allocatablePoints: number;
  studentPhase: StudentPhaseData;
  career: CareerInfo;
  chosenJob: Job;
  livingSituation: LivingSituation;
}
