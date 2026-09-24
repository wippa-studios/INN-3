using System;
using System.Globalization;
using System.Threading.Tasks.Dataflow;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.Interfaces;

namespace LYL.Domain.Model.States;

public class FirstWorkphaseState(Dossier dossier, IMemoryAccessService service) : DossierState(dossier, service)
{
    //private DossierData data = dossier.firstWorkphaseDossier;

    public override bool CheckBalanceMonth(DossierData data)
    {
        bool resultCheck = true;

        //Salary => kijken naar character
        resultCheck &= Dossier.Character.ChosenJob?.StartNet == data.NetSalary;

        //Housing (rent): price exists: int => house_id (house_id opslaan in string)
        string? house_id = service.GetHouseId(data.HousingCost);
        resultCheck &= !string.IsNullOrWhiteSpace(house_id);

        //Get social housing condition if necessary
        if (house_id == "rent_social") resultCheck &= CheckSocialHousingCondition();

        //Other living expenses: price is correct: int, house_id => bool
        resultCheck &= service.CheckLivingExpense(data.OtherLivingCost, house_id);


        //Transport: monthly purchase amount: int => int (check equal to monthly cost)
        (decimal monthlyCarCost, bool isSport) = service.GetMonthlyCarCost(data.TransportPurchaseCost);
        resultCheck &= monthlyCarCost == data.TransportMonthlyCost;

        //Alle volgende velden kijken indien ingevuld

        //Transport insurance: price exists: int => bool
        if (data.TransportInsuranceCost != null && data.TransportInsuranceCost != 0m)
        {
            resultCheck &= service.CheckTransportInsurance(data.TransportInsuranceCost, isSport);
        }

        //Fire Insurance: price is correct: int, house_id => bool
        if (data.FireInsuranceCost != null && data.FireInsuranceCost != 0m)
        {
            resultCheck &= service.CheckFireInsuranceCost(data.FireInsuranceCost, house_id);
        }

        //Family insurance: price is correct: int => bool
        if (data.FamilyInsuranceCost != null && data.FamilyInsuranceCost != 0m)
        {
            resultCheck &= service.CheckFamilyInsurance(data.FamilyInsuranceCost);
        }

        //Hosp insurance: price 1 adult is correct: int => bool
        if (data.HospitalisationInsuranceCost != null && data.HospitalisationInsuranceCost != 0m)
        {
            var result = service.GetHospitalisationInsurance();
            resultCheck &= data.HospitalisationInsuranceCost == result.adult ;
        }

        //Accident insurance: price is correct: int => bool
        if (data.AccidentInsuranceCost != null && data.AccidentInsuranceCost != 0m)
        {
            resultCheck &= service.CheckAccidentInsurance(data.AccidentInsuranceCost);
        }


        return resultCheck;
    }

    private bool CheckSocialHousingCondition()
    {
        //Net monthly salary - (number of children x {{childDeduction}}) < {{maxIncome}}
        (decimal childDeduction, decimal maxIncome) = service.GetSocialHousingCondition();
        return Dossier.Character.ChosenJob?.StartNet < maxIncome;
    }

    public override bool CheckTotalMonthly(DossierData data, Player player)
    {
        var resultCheck = CheckBalanceMonth(data);
        if (resultCheck) // alle gegevens in order?
        {
            //uitrekenen balance
            var balance = data.NetSalary
                          - data.HousingCost
                          - data.OtherLivingCost
                          - data.TransportMonthlyCost
                          - data.TransportPurchaseCost
                          - data.TransportInsuranceCost.GetValueOrDefault()
                          - data.FireInsuranceCost.GetValueOrDefault()
                          - data.FamilyInsuranceCost.GetValueOrDefault()
                          - data.HospitalisationInsuranceCost.GetValueOrDefault()
                          - data.AccidentInsuranceCost.GetValueOrDefault();

            if (balance == data.RemainingBudget)
            {
                if (player.DossierState is FirstWorkphaseState) //opslaan van data
                {
                    Dossier.firstWorkphaseDossier = data;
                    isChecked = true;
                }
                else throw new Exception("Invalid state");

                return true;
            } //TODO dit testen!
        }

        return false;
    }

    public override bool CheckCalculationPhase(DossierData data, Player player,  IInvestmentCalculator calculator)
    {
        bool resultCheck = true;

        //Remaining budget calculation
        resultCheck &= CheckTotalMonthly(data, player);
        resultCheck &= data.CalcRemainingBudgetWholePhase1 ==
                       data.RemainingBudget * Dossier.Character.Profile.ExperienceInMonths;

        //Revenue student job (can be zero/null)
        var option = Dossier.Character.StudentPhase.Options.FirstOrDefault(x => x.Id == "job_save");
        if (option != default)
        {
            resultCheck &=
                data.StudentJobIncome.GetValueOrDefault() ==
                option.FilledSlots * 5000; //TODO van waar krijg ik die 5000?
        }
        else
        {
            resultCheck &= data.StudentJobIncome == 0 || data.StudentJobIncome == null;
        }


        //Financial support parents
        //TODO: Rik-problem
        resultCheck &= data.ParentalSupport.GetValueOrDefault() ==
                       ParseParentalSupport(Dossier.Character.Profile.ParentalSupportKey);


        //Factor
        resultCheck &= data.Factor == (data.CalcRemainingBudgetWholePhase1
                                       + data.StudentJobIncome.GetValueOrDefault())
            / 2;

        //Total
        resultCheck &= data.Total1 ==
                       (data.Factor
                        + data.ParentalSupport);

        isChecked &= resultCheck;
        if (player.DossierState is FirstWorkphaseState)
        {
            Dossier.firstWorkphaseDossier = data;
        }
        else throw new Exception("Invalid state");

        return resultCheck;
    }

    public override void NextPhase(Player player)
    {
        if (isChecked)
        {
            if (player.DossierState is FirstWorkphaseState)
            {
                player.DossierState = new SecondWorkphaseState(player.Dossier, service);
            }
            //TODO testen
        }
    }

    public override bool CheckEventCardsInputAndTotal4(DossierData data, Player player)
    {
        return true; // moet niet geimplementeerd worden hier!
    }

    public decimal ParseParentalSupport(string parentalSupport)
    {
        if (string.IsNullOrEmpty(parentalSupport) || parentalSupport.Trim() == "/")
        {
            return 0m;
        }

        var culture = new CultureInfo("nl-BE"); //Hardcoded, assuming the culture won't change
        return decimal.Parse(parentalSupport, NumberStyles.Currency, culture);
    }
}
