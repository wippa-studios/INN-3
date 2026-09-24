// src/types/inputsheet.ts

export interface TopTableValues {
  net_salary_phase1: string;
  net_salary_phase2: string;
  partner_salary_phase1: string;
  partner_salary_phase2: string;
  monthly_rent_phase1: string;
  monthly_rent_phase2: string;
  living_costs_phase1: string;
  living_costs_phase2: string;
  purchase_monthly_phase1: string;
  purchase_monthly_phase2: string;
  monthly_cost_phase1: string;
  monthly_cost_phase2: string;
  car_insurance_phase1: string;
  car_insurance_phase2: string;
  fire_insurance_phase1: string;
  fire_insurance_phase2: string;
  family_insurance_phase1: string;
  family_insurance_phase2: string;
  hospital_insurance_phase1: string;
  hospital_insurance_phase2: string;
  accident_insurance_phase1: string;
  accident_insurance_phase2: string;
  remaining_budget_phase1: string
  remaining_budget_phase2: string
}

export interface CalcTableValues {
  // fase 1 Berekeningen
  calc_p1_remaining: string;
  calc_p1_student: string;
  calc_p1_parental: string;
  calc_p1_housing: string;
  calc_p1_factor: string;
  calc_p1_total1: string;

  // fase 2 Berekeningen
  calc_p2_total1_carry: string;
  calc_p2_partner_savings: string;
  calc_p2_total2: string;
  calc_p2_housing: string;
  calc_p2_total3: string;
  calc_p2_checking: string;
  calc_p2_savings: string;
  calc_p2_investment: string;
  calc_p2_total3_age50: string;
  calc_p2_remaining: string;
  calc_p2_event1: string;
  calc_p2_event2: string;
  calc_p2_event3: string;
  calc_p2_total4: string;
  calc_p2_return_savings: string;
  calc_p2_return_investment: string;
  calc_p2_inflation: string;
  calc_p2_total5: string;
}

export interface BudgetFormValues extends TopTableValues, CalcTableValues {}

export type FlowStep = "PHASE1_INPUT" | "PHASE1_CALC" | "PHASE2_INPUT" | "PHASE2_CALC" | "DONE";