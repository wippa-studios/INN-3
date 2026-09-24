using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LYL.Api.Contracts.FirstWorkPhase;

public class DossierCheckRequest
{
// --- INPUTS FASE 1 & 2 ---
    [JsonPropertyName("net_salary_phase1")]
    public decimal? NetSalaryPhase1 { get; set; }

    [JsonPropertyName("net_salary_phase2")]
    public decimal? NetSalaryPhase2 { get; set; }
    

    [JsonPropertyName("partner_salary_phase2")]
    public decimal? PartnerSalaryPhase2 { get; set; }

    [JsonPropertyName("monthly_rent_phase1")]
    public decimal? MonthlyRentPhase1 { get; set; }

    [JsonPropertyName("monthly_rent_phase2")]
    public decimal? MonthlyRentPhase2 { get; set; }

    [JsonPropertyName("living_costs_phase1")]
    public decimal? LivingCostsPhase1 { get; set; }

    [JsonPropertyName("living_costs_phase2")]
    public decimal? LivingCostsPhase2 { get; set; }

    [JsonPropertyName("purchase_monthly_phase1")]
    public decimal? PurchaseMonthlyPhase1 { get; set; }

    [JsonPropertyName("purchase_monthly_phase2")]
    public decimal? PurchaseMonthlyPhase2 { get; set; }

    [JsonPropertyName("monthly_cost_phase1")]
    public decimal? MonthlyCostPhase1 { get; set; }

    [JsonPropertyName("monthly_cost_phase2")]
    public decimal? MonthlyCostPhase2 { get; set; }

    [JsonPropertyName("car_insurance_phase1")]
    public decimal? CarInsurancePhase1 { get; set; }

    [JsonPropertyName("car_insurance_phase2")]
    public decimal? CarInsurancePhase2 { get; set; }

    [JsonPropertyName("fire_insurance_phase1")]
    public decimal? FireInsurancePhase1 { get; set; }

    [JsonPropertyName("fire_insurance_phase2")]
    public decimal? FireInsurancePhase2 { get; set; }

    [JsonPropertyName("family_insurance_phase1")]
    public decimal? FamilyInsurancePhase1 { get; set; }

    [JsonPropertyName("family_insurance_phase2")]
    public decimal? FamilyInsurancePhase2 { get; set; }

    [JsonPropertyName("hospital_insurance_phase1")]
    public decimal? HospitalInsurancePhase1 { get; set; }

    [JsonPropertyName("hospital_insurance_phase2")]
    public decimal? HospitalInsurancePhase2 { get; set; }

    [JsonPropertyName("accident_insurance_phase1")]
    public decimal? AccidentInsurancePhase1 { get; set; }

    [JsonPropertyName("accident_insurance_phase2")]
    public decimal? AccidentInsurancePhase2 { get; set; }
    
    [JsonPropertyName("remaining_budget_phase1")]
    public decimal RemainingBudgetphase1monthly { get; set; }
    
    [JsonPropertyName("remaining_budget_phase2")]
    public decimal? RemainingBudgetphase2monthly { get; set; }

    // --- CALCULATIES FASE 1 ---
    [JsonPropertyName("calc_p1_remaining")]
    public decimal? CalcP1Remaining { get; set; }

    //[Required]
    //[Range(0, 15000)]
    [JsonPropertyName("calc_p1_student")] public decimal? CalcP1Student { get; set; }
    [JsonPropertyName("calc_p1_parental")] public decimal? CalcP1Parental { get; set; }
    [JsonPropertyName("calc_p1_housing")] public decimal? CalcP1Housing { get; set; }
    [JsonPropertyName("calc_p1_factor")] public decimal? CalcP1Factor { get; set; }
    [JsonPropertyName("calc_p1_total1")] public decimal? CalcP1Total1 { get; set; }

    // --- CALCULATIES FASE 2 ---
    [JsonPropertyName("calc_p2_total1_carry")]
    public decimal? CalcP2Total1Carry { get; set; }

    [JsonPropertyName("calc_p2_partner_savings")]
    public decimal? CalcP2PartnerSavings { get; set; }

    [JsonPropertyName("calc_p2_total2")] public decimal? CalcP2Total2 { get; set; }
    [JsonPropertyName("calc_p2_housing")] public decimal? CalcP2Housing { get; set; }
    [JsonPropertyName("calc_p2_total3")] public decimal? CalcP2Total3 { get; set; }
    [JsonPropertyName("calc_p2_checking")] public decimal? CalcP2Checking { get; set; }
    [JsonPropertyName("calc_p2_savings")] public decimal? CalcP2Savings { get; set; }

    [JsonPropertyName("calc_p2_investment")]
    public decimal? CalcP2Investment { get; set; }

    [JsonPropertyName("calc_p2_total3_age50")]
    public decimal? CalcP2Total3Age50 { get; set; }

    [JsonPropertyName("calc_p2_remaining")]
    public decimal? CalcP2Remaining { get; set; }

    [JsonPropertyName("calc_p2_event1")] public decimal? CalcP2Event1 { get; set; }
    [JsonPropertyName("calc_p2_event2")] public decimal? CalcP2Event2 { get; set; }
    [JsonPropertyName("calc_p2_event3")] public decimal? CalcP2Event3 { get; set; }
    [JsonPropertyName("calc_p2_total4")] public decimal? CalcP2Total4 { get; set; }

    [JsonPropertyName("calc_p2_return_savings")]
    public decimal? CalcP2ReturnSavings { get; set; }

    [JsonPropertyName("calc_p2_return_investment")]
    public decimal? CalcP2ReturnInvestment { get; set; }

    [JsonPropertyName("calc_p2_inflation")]
    public decimal? CalcP2Inflation { get; set; }

    [JsonPropertyName("calc_p2_total5")] public decimal? CalcP2Total5 { get; set; }
}
