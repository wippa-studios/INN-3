using System;
using LYL.Domain.Model.JsonModel.Event;

namespace LYL.Domain.Model.Dossiers;

public class DossierData
{
    //Salary
    public decimal NetSalary {get; set;}
    public decimal? NetSalaryPartner {get; set;}
    //Housing
    public decimal HousingCost {get; set;}
    //Other living expenses
    public decimal OtherLivingCost {get; set;}
    //Transport
    public decimal TransportPurchaseCost {get; set;}
    public decimal TransportMonthlyCost {get; set;}
    public decimal? TransportInsuranceCost {get; set;}
    //Insurances
    public decimal? FireInsuranceCost {get; set;}
    public decimal? FamilyInsuranceCost {get; set;}
    public decimal? HospitalisationInsuranceCost {get; set;}
    public decimal? AccidentInsuranceCost {get; set;}
    public decimal? RemainingBudget { get; set; } 
    
    //onderste tabel FE
    
    // shared berekeningsvelden
    // komen in beide fasen voor
    public decimal? CalcRemainingBudgetWholePhase1 { get; set; } // FE: calc_p1_remaining / 
    public decimal? CalcRemainingBudgetWholePhase2 { get; set; } //calc_p2_remaining
    public decimal? HousingPurchaseCost { get; set; } // FE: calc_p1_housing / calc_p2_housing

    // Fase 1
    public decimal? StudentJobIncome { get; set; } // FE: calc_p1_student
    public decimal? ParentalSupport { get; set; } // FE: calc_p1_parental
    public decimal? Factor { get; set; } // FE: calc_p1_factor
    public decimal? Total1 { get; set; } // FE: calc_p1_total1 

    // Fase 2
    public decimal? Total1Carry { get; set; } // FE: calc_p2_total1_carry 
    public decimal? PartnerSavings { get; set; } // FE: calc_p2_partner_savings
    public decimal? Total2 { get; set; } // FE: calc_p2_total2
    public decimal? Total3 { get; set; } // FE: calc_p2_total3 
    
    // verdeling vermogen fase 2
    public decimal? CheckingAccount { get; set; } // FE: calc_p2_checking
    public decimal? SavingsAccount { get; set; } // FE: calc_p2_savings
    public decimal? Investment { get; set; } // FE: calc_p2_investment
    
    // gebeurtenissen en prognose fase 2
    public decimal? Total3Age50 { get; set; } // FE: calc_p2_total3_age50
    public decimal? Event1Impact { get; set; } // FE: calc_p2_event1
    public decimal? Event2Impact { get; set; } // FE: calc_p2_event2
    public decimal? Event3Impact { get; set; } // FE: calc_p2_event3
    public decimal? Total4 { get; set; } // FE: calc_p2_total4
    
    // rendement en inflatie fase 2
    public decimal? ReturnSavings { get; set; } // FE: calc_p2_return_savings
    public decimal? ReturnInvestment { get; set; } // FE: calc_p2_return_investment
    public decimal? InflationImpact { get; set; } // FE: calc_p2_inflation
    public decimal? Total5 { get; set; } // FE: calc_p2_total5
    
    
}
