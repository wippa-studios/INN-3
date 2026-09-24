// Huisvesting huren
export interface RentOption {
  name: string;
  monthly: string;
  space: string;
  mobility: string;
}

// Huisvesting kopen
export interface BuyOption {
  name: string;
  price: string;
  max_loan: string;
  one_time: string;
  start_budget: string;
  monthly_loan: string;
  space: string;
  mobility: string;
}

// Leefkosten
export interface LivingCostOption {
  name: string;
  no_children: string;
  one_child: string;
  two_children: string;
  three_children: string;
}

// Mobiliteit transport rij
export interface TransportRow {
  label: string;
  bike: string;
  small_car: string;
  family_car: string;
  sports_car: string;
}

// Autoverzekering optie
export interface CarInsuranceOption {
  name: string;
  description: string;
  coverage: string[];
  franchise: string;
  cost_small_family: string;
  cost_sports: string;
}

// Verzekering optie
export interface InsuranceOption {
  name: string;
  cost: string;
  franchise: string;
  info: string;
  coverage: string[];
}

// Sparen optie
export interface SavingsOption {
  name: string;
  amount: string;
  return: string;
  info: string;
}