using System;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.Interfaces;


namespace LYL.Domain.Model.States;

public class SecondWorkphaseState(Dossier dossier, IMemoryAccessService service) : DossierState(dossier, service)
{
    public override bool CheckBalanceMonth(DossierData data)
    {
        bool resultCheck = true;
        int adults = 1;
        if (Dossier.LivingSituation.Partner.Wage > 0) adults = 2;
        int children = Dossier.LivingSituation.Children;

        //Salary
        resultCheck &= Dossier.Character.ChosenJob?.AvgNet == data.NetSalary;

        //Salary partner
        resultCheck &= Dossier.LivingSituation.Partner.Wage == data.NetSalaryPartner.GetValueOrDefault();

        //Housing: price exists: int (monthly loan/monthly) => string (house_id), string (buy/rent)
        string? house_id = service.GetHouseId(data.HousingCost);
        if (house_id == "rent_social") 
        {
            decimal totalSalary = data.NetSalary + data.NetSalaryPartner.GetValueOrDefault();
            resultCheck &= CheckSocialHousingCondition(totalSalary, children);
        }
        //Housing buy: int (maxSpace), bool (needsCar), int (startBudget)
        //=> check living situation and budget
        //Housing rent: house_id => int (maxSpace), bool (needsCar)
        //=> check living situation

        bool needsCar = false; //kan merge conflict veroorzaken vanaf hier dit accepteren! Als er extra's aan toegevoegd zijn. Beide accepteren!!
        if (house_id.StartsWith("buy"))
        {
            var result = service.GetHouseInfoBuy(house_id);
            resultCheck &= result.maxSpace >= adults + children;
            if (result.needsCar) resultCheck &= data.TransportMonthlyCost > 100;
            needsCar = result.needsCar;
            resultCheck &= result.startBudget <= Dossier.firstWorkphaseDossier.Total1 + Dossier.LivingSituation.Partner.Savings;
            //TODO: buy conditions (up to 40% of salary may be used to repay the loan)
        } else if (!string.IsNullOrEmpty(house_id))
        {
            var result = service.GetHouseInfoRent(house_id);
            resultCheck &= result.maxSpace >= adults + children;
            needsCar = result.needsCar;
            if (result.needsCar) resultCheck &= data.TransportMonthlyCost > 100;
            //TODO 100 is hardcoded for no reason, needs to come from database, but 100 is high enough inflation won't have impact anytime soon
        }
        else return false;
        

        //Other living expenses: price is correct: int price, string house_id, int children, bool hasPartner => bool
        resultCheck &= service.CheckLivingExpense(data.OtherLivingCost, house_id, 
                children, adults > 1);
        
        //Transport: monthly purchase amount: int price => int (check equal to monthly cost), int seats
        //=> check living situation
        (decimal monthlyCarCost, bool isSport, int seats) = service.GetCarInfo(data.TransportPurchaseCost, adults + children);
        resultCheck &= monthlyCarCost != default;
        if (seats == 1) monthlyCarCost *= (adults + children);
        resultCheck &= monthlyCarCost == data.TransportMonthlyCost;
        if (needsCar) resultCheck &= seats >= adults + children;
        

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
        //Hosp insurance: getting price pp:  => int adultPrice, int CHildPrice
        //=> check living situation => calculate cost => compare
        if (data.HospitalisationInsuranceCost != null && data.HospitalisationInsuranceCost != 0m)
        {
            var insurance = service.GetHospitalisationInsurance();
            var result = insurance.adult * adults + insurance.child * children ; 
            resultCheck &= data.HospitalisationInsuranceCost == result ;
        }
        //Accident insurance: look at living sit. => calculate pp => price is correct: int => bool
        if (data.AccidentInsuranceCost != null && data.AccidentInsuranceCost != 0m)
        {
            var price = data.AccidentInsuranceCost / (adults + children);
            resultCheck &= service.CheckAccidentInsurance(data.AccidentInsuranceCost);
        }

        return resultCheck;
    }

    public override bool CheckTotalMonthly(DossierData data, Player player)
    {
        var resultCheck = CheckBalanceMonth(data);
        if (resultCheck) // alle gegevens in order?
        {
            //uitrekenen balance
            var balance = data.NetSalary 
                        + data.NetSalaryPartner.GetValueOrDefault()
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
                if (player.DossierState is SecondWorkphaseState) //opslaan van data
                {
                    Dossier.secondWorkphaseDossier = data; 
                    isChecked = true;
                    //TODO: opslaan insurances
                }
                else throw new Exception("Invalid state");
                
                return true;
            }
        }
        return false;
    }

    private bool CheckSocialHousingCondition(decimal netSalary, int children)
    {
        //Net monthly salary - (number of children x {{childDeduction}}) < {{maxIncome}}
        (decimal childDeduction, decimal maxIncome) = service.GetSocialHousingCondition();
        return netSalary - (children * childDeduction) < maxIncome;
    }

    public override bool CheckCalculationPhase(DossierData data, Player player, IInvestmentCalculator calculator)
    {
        bool resultCheck = true;
        resultCheck &= CheckTotalMonthly(data, player);
        Console.WriteLine("begin test");
        Console.WriteLine(resultCheck);

        //Total career phase 1
        resultCheck &= data.Total1Carry == Dossier.firstWorkphaseDossier.Total1;
        Console.WriteLine(resultCheck);

        //Support (parents) partner
        resultCheck &= data.PartnerSavings.GetValueOrDefault() == Dossier.LivingSituation.Partner.Savings;
        Console.WriteLine(resultCheck);

        //Total 2: startbudget career phase 2 (^total above)
        resultCheck &= data.Total2 == data.Total1Carry + data.PartnerSavings.GetValueOrDefault();
        Console.WriteLine(resultCheck);

        //One-time purchase cost
        string? house_id = service.GetHouseId(data.HousingCost);
        if (house_id.StartsWith("buy"))
        {
            decimal purchaseCost = service.GetHousePurchaseCost(house_id);
            resultCheck &= data.HousingPurchaseCost == purchaseCost;
        }
        else resultCheck &= data.HousingPurchaseCost.GetValueOrDefault() == 0;
        Console.WriteLine(resultCheck);

        //Subtotal 3 / factor phase 2 = total 3
        resultCheck &= data.Total3 == (data.Total2
                                       - data.HousingPurchaseCost.GetValueOrDefault())/2;
        //TODO: factor?
        Console.WriteLine(resultCheck);
    
        isChecked &= resultCheck;
        if (player.DossierState is SecondWorkphaseState)
                {
                    Dossier.secondWorkphaseDossier = data;
                }
                else throw new Exception("Invalid state");

        try
        {
            var testresult = CheckEventCardsInputAndTotal4(data, player);
            resultCheck &= testresult;
            Console.WriteLine("cards: " + testresult);
        }
        catch {
            Console.WriteLine("foutje");
        }
        
        //checks laatste velden onderste tabel
        resultCheck &= CheckSavingsAccountCalc(data, player);
        resultCheck &= CheckInvestmentCalc(data, player, calculator);
        resultCheck &= CheckTotal5Calc(data, player);
        
        return resultCheck;
    }

    private bool CheckTotal5Calc(DossierData data, Player player)
    {
        //geen andere checks nodig: als een van deze hiervoor al fout was zal de algemenem bool false blijven!
        var total5 = data.Total4 + data.ReturnSavings + data.ReturnInvestment - data.InflationImpact;
        return total5 == data.Total5;
    }

    private bool CheckSavingsAccountCalc(DossierData data, Player player)
    {
        
        double interestRate = 0.01; //todo flexibel binnenhalen
        double years = 20;
        if (data.SavingsAccount == null) return false;
        double principal = (double)data.SavingsAccount;
    
       
        double totalAmount = principal * Math.Pow(1 + interestRate, years);
        double profit = totalAmount - principal;
        
        double marge = 0.05; 
        if (data.ReturnSavings == null) return false;
        var correct = Math.Abs(profit - (double)data.ReturnSavings) <= marge;
    
        return correct;
    }

    private bool CheckInvestmentCalc(DossierData data, Player player, IInvestmentCalculator calculator)
    {
        //TODO testen
        var check = true;
        int years = 20;
        decimal rate = 0.06m; //todo flexibel binnenhalen
        decimal inflation = 0.02m;
        decimal marge = 0.05m; 
        
        if (data.Investment == null) return false;
        var returnment = calculator.CalculateReturn((decimal)data.Investment, rate, years );
        check &= Math.Abs((decimal)(returnment - data.ReturnInvestment)) <= marge;
        
        if (data.Total3 == null) return false;
        var inflationImpact = calculator.CalculateInflationImpact((decimal)data.Total3, inflation,  years );
        
        
        if (data.InflationImpact == null) return false;
        var inflImpactRobust = data.InflationImpact < 0 ? data.InflationImpact * -1 : data.InflationImpact; //check if user added - we have to correct this or it will always say false
        check &= Math.Abs((decimal)(inflationImpact * (-1) - inflImpactRobust)) <= marge;
        
        return check;
    }

    public override void NextPhase(Player player)
    {
        //TODO er is geen volgende fase: zou bij uitbreiding de stap naar de samenvatting kunnen zijn of einde game melding!
        throw new NotImplementedException();
    }
    
    
    public override bool CheckEventCardsInputAndTotal4(DossierData data, Player player)
    {
        //TODO testen!!!
        
        bool result = true;
        decimal? totalImpactEventCards = 0;
        
        var eventcardsChoices = player.Dossier.ChoosenEventCards.Choices;
        if (eventcardsChoices.Count == 0) throw new Exception("No eventcards choosen or saved");
        
        var allEventcards = service.GetAllEventCards();
        //TODO elke apart eventcard overlopen

        for (int i = 0; i < eventcardsChoices.Count; i++)
        {
            var id = eventcardsChoices[i].CardId;
            decimal? dataDecimal = i switch
            {
                0 => data.Event1Impact,
                1 => data.Event2Impact,
                2 => data.Event3Impact,
                _ => null 
            };

            if (id == "second_car")
            {
                var card = allEventcards.Find(x => x.Id == "second_car");
                if (card == null) throw new Exception("Card not found");
                result &= card.Options[0].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "divorce")
            {
                var card = allEventcards.Find(x => x.Id == "divorce");
                if (card == null) throw new Exception("Card not found");

                result &= player.Dossier.secondWorkphaseDossier.NetSalaryPartner ==
                          ((dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal);
               totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "car_accident_parked")
            {
                var card = allEventcards.Find(x => x.Id == "car_accident_parked");
                if (card == null) throw new Exception("Card not found");
                
                var choosenInsuranceDecimal = player.Dossier.secondWorkphaseDossier.TransportInsuranceCost;

                //TODO getinsurances methods waardoor deze flexibel worden ingeladen
                //check which insurance player has (normal || sportscar)
                if (choosenInsuranceDecimal is 25 or 50 )
                {
                    //special check in case user writes negative or positive in frontend
                     result &= card.Options[0].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                     totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else if (choosenInsuranceDecimal is 55 or 125)
                {
                    result &= card.Options[1].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else if (choosenInsuranceDecimal is 70 or 350)
                {
                    //has franchise, no costs
                    result &= dataDecimal is 0 or null;
                }
                //No car, no insurance (previously checked if they hava car that they need an insurance)
                //TODO is it okay to keep the logic like this?

            }

            if (id == "car_accident_hail")
            {
                var card = allEventcards.Find(x => x.Id == "car_accident_hail");
                if (card == null) throw new Exception("Card not found");

                var choosenCondition = eventcardsChoices[i].ConditionId;
                var option = card.Options.Find(x => x.ConditionId == choosenCondition);

                var choosenInsuranceDecimal = player.Dossier.secondWorkphaseDossier.TransportInsuranceCost;
                
                //TODO getinsurances methods waardoor deze flexibel worden ingeladen
                //check which insurance player has (normal || sportscar)
                if (choosenInsuranceDecimal is 25 or 50 )
                {
                    result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else if (choosenInsuranceDecimal is 55 or 125)
                {
                    //has franchise, no costs
                    result &= dataDecimal is 0 or null;
                }
                else if (choosenInsuranceDecimal is 70 or 350)
                {
                    //has franchise, no costs
                    result &= dataDecimal is 0 or null;
                }
            }

            if (id == "car_accident_traffic_jam")
            {
                var card = allEventcards.Find(x => x.Id == "car_accident_traffic_jam");
                if (card == null) throw new Exception("Card not found");
                
                var choosenInsuranceDecimal = player.Dossier.secondWorkphaseDossier.TransportInsuranceCost;
                var options = card.Options;
                
                //TODO getinsurances methods waardoor deze flexibel worden ingeladen
                //check which insurance player has (normal || sportscar)
                if (choosenInsuranceDecimal is 25 or 50 )
                {
                    result &= options[0].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else if (choosenInsuranceDecimal is 55 or 125)
                {
                    result &= options[1].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else if (choosenInsuranceDecimal is 70 or 350)
                {
                    //has franchise, no costs
                    result &= dataDecimal is 0 or null;
                } 
                else if (player.Dossier.secondWorkphaseDossier.AccidentInsuranceCost == 7)
                {
                    //TODO does this make sense, what do they mean when they have an accidentinsurance? What costs are covered?
                    //does not make sense tha accident insurance covers everything but we keep it like this for now
                    result &=dataDecimal is 0 or null;
                }
                //if 0 there is no car and also no car insurance, so no car accident is possible
                //TODO is this logic okay or do they want it different?
                
            }

            if (id == "inheritance")
            {
                var card = allEventcards.Find(x => x.Id == "inheritance");
                if (card == null) throw new Exception("Card not found");

                var choosenCondition = eventcardsChoices[i].ConditionId;
                var option = card.Options.Find(x => x.ConditionId == choosenCondition);
                result &= option.Amount == dataDecimal;
                totalImpactEventCards += dataDecimal;
            }

            if (id == "house_on_fire")
            {
                var card = allEventcards.Find(x => x.Id == "house_on_fire");
                if (card == null) throw new Exception("Card not found");

                //no specific check needed just if they have one.
                //This method gets called after the check so we're sure that everything is filled in correctly
                if (player.Dossier.secondWorkphaseDossier.FireInsuranceCost > 0)
                {
                    result &= dataDecimal is 0 or null;
                }
                else
                {
                    var option = card.Options.Find(x => x.ConditionId == "NO");
                    result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
            }

            if (id == "storm_damage_trampoline")
            {
                var card = allEventcards.Find(x => x.Id == "storm_damage_trampoline");
                if (card == null) throw new Exception("Card not found");
                
                if (player.Dossier.secondWorkphaseDossier.FamilyInsuranceCost > 0)
                {
                    result &= dataDecimal is 0 or null;
                }
                else
                {
                    var option = card.Options.Find(x => x.ConditionId == "NO");
                    result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                
            }

            if (id == "storm_damage_roof")
            {
                var card = allEventcards.Find(x => x.Id == "storm_damage_roof");
                if (card == null) throw new Exception("Card not found");
                
                if (player.Dossier.secondWorkphaseDossier.FireInsuranceCost > 0)
                {
                    result &= dataDecimal is 0 or null;
                }
                else
                {
                    var option = card.Options.Find(x => x.ConditionId == "NO");
                    result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
            }

            if (id == "dismissal")
            {
                var card = allEventcards.Find(x => x.Id == "dismissal");
                if (card == null) throw new Exception("Card not found");
                var test = card.Options[1].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                
                var option = Dossier.Character.StudentPhase.Options.FirstOrDefault(x => x.Id == "education");
                if (option != default)
                {
                    var filled = option.FilledSlots;
                    if (filled == 0) result &= card.Options[0].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    if (filled == 1) result &= card.Options[1].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    if (filled == 2) result &= card.Options[2].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    if (filled == 3) result &= card.Options[3].Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                }
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "promotion")
            {
                var card = allEventcards.Find(x => x.Id == "promotion");
                if (card == null) throw new Exception("Card not found");
                
                var option = Dossier.Character.StudentPhase.Options.FirstOrDefault(x => x.Id == "education");
                if (option != default)
                {
                    var filled = option.FilledSlots;
                    if (filled == 0) result &= dataDecimal is 0 or null;
                    if (filled == 1) 
                    {
                        result &= card.Options[1].Amount == dataDecimal; 
                        totalImpactEventCards += dataDecimal;
                        
                    }

                    if (filled == 2)
                    {
                        result &= card.Options[2].Amount ==  dataDecimal; 
                        totalImpactEventCards += dataDecimal;
                    }

                    if (filled == 3)
                    {
                        result &= card.Options[3].Amount == dataDecimal; 
                        totalImpactEventCards += dataDecimal;
                    }
                }
            }

            if (id == "new_job")
            {
                var card = allEventcards.Find(x => x.Id == "new_job");
                
                var choosenCondition = eventcardsChoices[i].ConditionId;
                var option = card.Options.Find(x => x.ConditionId == choosenCondition);
                result &= option.Amount == dataDecimal;
                totalImpactEventCards += dataDecimal;
                
            }

            if (id == "illness_work")
            {
                //momenteel is deze uit de mogelijkheden + uit de db
                
                //TODO toevoegen logica in json files
                //TODO aanpassen model meet boolean
                //TODO toevoegen aan dbfile
                //TODO optie terug in gamesessionservice steken
                //TODO logica schrijven hier
                
            }

            if (id == "financial_support")
            {
                var card = allEventcards.Find(x => x.Id == "financial_support");
                if (card == null) throw new Exception("Card not found");

                string conditionId = eventcardsChoices[i].ConditionId;
                var option = card.Options.Find(x => x.ConditionId == conditionId);
                result &= option.Amount == dataDecimal;
                totalImpactEventCards += dataDecimal;

            }

            if (id == "holiday")
            {
                var card = allEventcards.Find(x => x.Id == "holiday");
                if (card == null) throw new Exception("Card not found");

                string conditionId = eventcardsChoices[i].ConditionId;
                var option = card.Options.Find(x => x.ConditionId == conditionId);
                int amountOfpp = 1;
                if (player.Dossier.secondWorkphaseDossier.NetSalaryPartner > 0) amountOfpp += 1; //TODO beter checken na update sarah partner
                if (player.Dossier.LivingSituation.Children > 0) amountOfpp += player.Dossier.LivingSituation.Children; 
                //TODO nog aanpassen aan logica sarah
                result &= (option.Amount * amountOfpp)  == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "leaking_roof")
            {
                var card = allEventcards.Find(x => x.Id == "leaking_roof");
                if (card == null) throw new Exception("Card not found");

                var rentsHouse = true;
                string? house_id = service.GetHouseId(data.HousingCost);
                
                if (house_id.StartsWith("buy")) rentsHouse = false;
                
                if (!rentsHouse) 
                {
                    result &= (card.Options.Find(x => x.ConditionId == "owner")).Amount ==  ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
                else
                {
                    result &= dataDecimal is 0 or null;
                }
            }

            if (id == "illness_dice")
            {
                var card = allEventcards.Find(x => x.Id == "illness_dice");
                if (card == null) throw new Exception("Card not found");
                
                var option = card.Options.Find(x => x.ConditionId == eventcardsChoices[i].ConditionId);
                result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "hospital_treatment")
            {
                var card = allEventcards.Find(x => x.Id == "hospital_treatment");
                if (card == null) throw new Exception("Card not found");

                if (player.Dossier.secondWorkphaseDossier.HospitalisationInsuranceCost > 0)
                {
                    result &=  dataDecimal is 0 or null;
                }
                else //no insurance
                {
                    result &= (card.Options.Find(x => x.ConditionId == "NO")).Amount ==  ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                    totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
                }
            }

            if (id == "housing_costs_1")
            {
                var card = allEventcards.Find(x => x.Id == "housing_costs_1");
                if (card == null) throw new Exception("Card not found");
                
                var option = card.Options.Find(x => x.ConditionId == eventcardsChoices[i].ConditionId);
                result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "housing_costs_2")
            {
                var card = allEventcards.Find(x => x.Id == "housing_costs_2");
                if (card == null) throw new Exception("Card not found");
                
                var option = card.Options.Find(x => x.ConditionId == eventcardsChoices[i].ConditionId);
                result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }

            if (id == "depression")
            {
                var card = allEventcards.Find(x => x.Id == "depression");
                if (card == null) throw new Exception("Card not found");
                
                var option = card.Options.Find(x => x.ConditionId == eventcardsChoices[i].ConditionId);
                result &= option.Amount == ((dataDecimal > 0) ? dataDecimal * (-1) : dataDecimal);
                totalImpactEventCards -= (dataDecimal < 0) ? dataDecimal * (-1) : dataDecimal;
            }
        }
        
        //TOTAL 3 + ((netsalary * 240)/2) - eventcards
        var total4 = data.Total3 + ((data.RemainingBudget * 240)) + totalImpactEventCards;
        result &= total4 == data.Total4;
        
        return result;
    }
}
