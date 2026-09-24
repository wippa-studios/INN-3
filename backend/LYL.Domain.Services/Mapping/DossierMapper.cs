using System.Net.Cache;
using LYL.Api.Contracts.EventCards;
using LYL.Api.Contracts.FirstWorkPhase;
using LYL.Domain.Model;
using LYL.Domain.Model.Dossiers;

namespace LYL.Domain.Services.Mapping;

public static class DossierMapper
{
    public static DossierData AsModelPhase1(this DossierCheckRequest request)
    {
        return new DossierData()
        {
            NetSalary = request.NetSalaryPhase1.GetValueOrDefault(),
            HousingCost = request.MonthlyRentPhase1.GetValueOrDefault(),
            OtherLivingCost = request.LivingCostsPhase1.GetValueOrDefault(),
            TransportPurchaseCost = request.PurchaseMonthlyPhase1.GetValueOrDefault(),
            TransportMonthlyCost = request.MonthlyCostPhase1.GetValueOrDefault(),
            TransportInsuranceCost = request.CarInsurancePhase1,
            FireInsuranceCost = request.FireInsurancePhase1,
            FamilyInsuranceCost = request.FamilyInsurancePhase1,
            HospitalisationInsuranceCost = request.HospitalInsurancePhase1,
            AccidentInsuranceCost = request.AccidentInsurancePhase1,
            RemainingBudget = request.RemainingBudgetphase1monthly,
            
            //onderste tabel
            
            CalcRemainingBudgetWholePhase1 =  request.CalcP1Remaining,
            HousingPurchaseCost = request.CalcP1Housing,
            StudentJobIncome = request.CalcP1Student,
            ParentalSupport = request.CalcP1Parental,
            Factor = request.CalcP1Factor,
            Total1 =  request.CalcP1Total1
        };
    }
    
    public static DossierData AsModelPhase2(this DossierCheckRequest request)
    {
        return new DossierData()
        {
            //bovenste tabel
            NetSalary = request.NetSalaryPhase2.GetValueOrDefault(),
            NetSalaryPartner = request.PartnerSalaryPhase2,
            HousingCost = request.MonthlyRentPhase2.GetValueOrDefault(),
            HousingPurchaseCost = request.CalcP2Housing,
            OtherLivingCost = request.LivingCostsPhase2.GetValueOrDefault(),
            TransportPurchaseCost = request.PurchaseMonthlyPhase2.GetValueOrDefault(),
            TransportMonthlyCost = request.MonthlyCostPhase2.GetValueOrDefault(),
            TransportInsuranceCost = request.CarInsurancePhase2,
            FireInsuranceCost = request.FireInsurancePhase2,
            FamilyInsuranceCost = request.FamilyInsurancePhase2,
            HospitalisationInsuranceCost = request.HospitalInsurancePhase2,
            AccidentInsuranceCost = request.AccidentInsurancePhase2,
            RemainingBudget = request.RemainingBudgetphase2monthly,
            PartnerSavings = request.CalcP2PartnerSavings,
            Total1Carry = request.CalcP2Total1Carry,
            CalcRemainingBudgetWholePhase2 = request.CalcP2Remaining,

            //onderste tabel
            //vermogen
            Total2 = request.CalcP2Total2,
            Total3 = request.CalcP2Total3,
            CheckingAccount = request.CalcP2Checking,
            SavingsAccount = request.CalcP2Savings,
            Investment = request.CalcP2Investment,

            //events
            Total3Age50 = request.CalcP2Total3Age50,
            Event1Impact = request.CalcP2Event1,
            Event2Impact = request.CalcP2Event2,
            Event3Impact = request.CalcP2Event3,

            Total4 = request.CalcP2Total4,

            //rendement
            ReturnSavings = request.CalcP2ReturnSavings,
            ReturnInvestment = request.CalcP2ReturnInvestment,
            InflationImpact = request.CalcP2Inflation,
            Total5 = request.CalcP2Total5
        };
    }

    public static SavedEventCards AsModel(this EventCardSaveRequestContract request)
    {
        return new SavedEventCards()
        {
            Choices = request.Choices.Select(x => x.AsModel()).ToList()
        };
    }

    public static EventCardChoices AsModel(this EventCardChoiceRequestContract request)
    {
        return new EventCardChoices()
        {
            CardId = request.CardId,
            ConditionId = request.ConditionId,
        };
    }
}