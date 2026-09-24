using System.Text.Json;
using LYL.Domain.Model;
using LYL.Domain.Model.JsonModel;
using LYL.Domain.Model.JsonModel.Event;
using LYL.Persistence.Interfaces;

namespace LYL.Persistence;

public class InMemoryDataRepository : IInMemoryDataRepository
{
    
    public List<Partner> Partners { get; private set; }
    public RootConfig      MemoryData     { get; private set; }
    public List<Character> Characters     { get; private set; }
    public InvestmentData  InvestmentData { get; private set; }
    public     List<EventCard> EventCards     { get; set; }




    public void FillInMemoryData(Dictionary<string, JsonDocument> schoneData)
    {
        foreach (var item in schoneData)
        {
            //this is the name of the file where the keys are located
            //each name is linked with a specific Class/Object
            if (item.Key.ToLower().Trim() == "dossierdata.json")
            {
                MemoryData = JsonSerializer.Deserialize<RootConfig>(item.Value);
            }

            if (item.Key.ToLower().Trim() == "characterdata.json")
            {
                Characters = JsonSerializer.Deserialize<List<Character>>(item.Value);
            }
            
            if (item.Key.ToLower().Trim() == "partner.json")
            {
                try
                {
                    Partners = item.Value.RootElement
                        .GetProperty("partners")
                        .Deserialize<List<Partner>>();
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
               
            }
            
            //TODO events inlezen

            if (item.Key.ToLower().Trim() == "investmentdata.json")
            {
                InvestmentData = JsonSerializer.Deserialize<InvestmentData>(item.Value);
            }
            if (item.Key.ToLower().Trim() == "eventdata.json")
            {
                EventCards = JsonSerializer.Deserialize<List<EventCard>>(item.Value);
            }
        }
    }

    public InvestmentData GetInvestmentData()
    {
        if (InvestmentData == null)
            throw new Exception("Investment data not found. Is investmentdata.json loaded in the database?");
        return InvestmentData;
    }

    public string GetHouseId(decimal monthlyCost)
    {
        string? house_id;
        house_id = MemoryData?.Housing?.Buy?.BuyOptions?.FirstOrDefault(h => h.MonthlyLoan == monthlyCost)?.Id;
        if (string.IsNullOrEmpty(house_id))
        {
            house_id = MemoryData?.Housing?.Rent?.HousingOptions?.FirstOrDefault(h => h.Monthly == monthlyCost)?.Id;
            if (string.IsNullOrEmpty(house_id))
            {
                return "";
            }
            return house_id;
        }
        else
        {
            return house_id;
        }
    }

    public (decimal childDeduction, decimal maxIncome) GetSocialHousingCondition()
    {
        decimal childDeduction = MemoryData.Housing.Rent.socialHousingConditions.ChildDeduction;
        decimal maxIncome = MemoryData.Housing.Rent.socialHousingConditions.MaxIncome;
        return (childDeduction, maxIncome);
    }


    public (decimal monthlyCost, bool isSport) GetMonthlyCarCost(decimal transportPurchaseCost)
    {
        var transportOption = MemoryData.Mobility.Transport.Options.FirstOrDefault(t => t.MonthlyPurchase == transportPurchaseCost);
        if (transportOption == default || transportOption == null)
        {
            return default;
        }
        return (transportOption.MonthlyCost, transportOption.Id == "sports_car");
    }

    public bool CheckAccidentInsurance(decimal insuranceCost)
    {
        decimal price = MemoryData.GeneralInsurance.Options.FirstOrDefault(i => i.Id == "accident").Costs.Values.FirstOrDefault();
        return price == insuranceCost;
    }

    public bool CheckFamilyInsurance(decimal insuranceCost)
    {
        decimal cost = MemoryData.GeneralInsurance.Options.FirstOrDefault(i => i.Id == "family").Costs.Values.FirstOrDefault();
        return cost == insuranceCost;
    }

    public bool CheckFireInsurance(decimal insuranceCost, string house_id)
    {
        // "rent_shared_5y": 1.5,
        //   "rent_shared": 2.5,
        //   "rent_apt_city": 10.0,
        //   "rent_house_country": 20.0,
        //   "buy_apt_city": 10.0,
        //   "ownerHouse": 55.0
        decimal cost;
        if (house_id == "stay_home" || house_id == "rent_social") cost = 0;
        else if (house_id == "buy_house_country" || house_id == "buy_villa_country")
        {
            cost = MemoryData.GeneralInsurance.Options.FirstOrDefault(i => i.Id == "fire").Costs.FirstOrDefault(x => x.Key == "ownerHouse").Value;
        }
        else {cost = MemoryData.GeneralInsurance.Options.FirstOrDefault(i => i.Id == "fire").Costs.FirstOrDefault(x => x.Key == house_id).Value;}
        
        return insuranceCost == cost;
    }

    public (decimal adult, decimal child) GetHospitalisationInsurance()
    {
        var option = MemoryData.GeneralInsurance.Options.FirstOrDefault(i => i.Id == "hospitalization");
        if (option != default)
        {
            return (option.Costs.FirstOrDefault(x => x.Key == "adult").Value, option.Costs.FirstOrDefault(x => x.Key == "child").Value);
        }
        return (0,0);
    }

    public bool CheckTransportInsurance(decimal insuranceCost, bool isSport)
    {
        if (isSport)
        {
            return MemoryData.Mobility.AutoInsurance.Options.FirstOrDefault(i => i.MonthlyCostSports == insuranceCost) != default;
        }
        else
        {
            return MemoryData.Mobility.AutoInsurance.Options.FirstOrDefault(i => i.MonthlyCost == insuranceCost) != default;
        }
    }

    public bool CheckLivingExpense(decimal otherLivingCost, string house_id)
    {
        var option = MemoryData.LivingCosts.LivingCostsOptions.FirstOrDefault(x => x.NoChildren == otherLivingCost);
        if (option == default) return false;
        else if (option.Id == house_id) return true;
        else if (option.Id == "other_single" && 
        (house_id != "stay_home" && house_id != "rent_shared_5y" && house_id != "rent_shared")) return true;
        else return false;
    }

    public List<Character> getCharacters()
    {
        if (Characters.Count <= 0) 
            throw new Exception("Characters not found. Are they filled in correctly by reading the database?");
        return Characters;
    }

    public List<Partner> GetPartners()
    {
        if (Partners.Count <= 0) 
            throw new Exception("Partners not found. Are they filled in correctly by reading the database?");
        return Partners;
    }

    public bool CheckLivingExpense(decimal otherLivingCost, string house_id, int children, bool hasPartner)
    {
        var option = MemoryData.LivingCosts.LivingCostsOptions.FirstOrDefault(x => x.Id == "other_partner");

        if (!hasPartner)
        {
            if (children == 0)
            {
                return CheckLivingExpense(otherLivingCost, house_id);
            }
            option = MemoryData.LivingCosts.LivingCostsOptions.FirstOrDefault(x => x.Id == "other_single");
        }

        if (option == default) return false;

        switch (children)
        {
            case 0:
                return option.NoChildren == otherLivingCost;
            case 1:
                return option.OneChild is JsonElement a &&
                    a.ValueKind == JsonValueKind.Number &&
                    a.GetDecimal() == otherLivingCost;

            case 2:
                return option.TwoChildren is JsonElement b &&
                    b.ValueKind == JsonValueKind.Number &&
                    b.GetDecimal() == otherLivingCost;
            case 3:
                return option.ThreeChildren is JsonElement c &&
                    c.ValueKind == JsonValueKind.Number &&
                    c.GetDecimal() == otherLivingCost;
            default:
                return false;
        }
    }

    public (int maxSpace, bool needsCar, decimal startBudget) GetHouseInfoBuy(string house_id)
    {
        var option = MemoryData.Housing.Buy.BuyOptions.FirstOrDefault(h => h.Id == house_id);
        if (option == default) return default;
        return (option.Space, option.NeedsCar, option.StartBudget);        
    }

    public (int maxSpace, bool needsCar) GetHouseInfoRent(string house_id)
    {
        var option = MemoryData.Housing.Rent.HousingOptions.FirstOrDefault(h => h.Id == house_id);
        if (option == default) return default;
        return (option.Space, option.NeedsCar);       
    }

    public (decimal monthlyCost, bool isSport, int seats) GetCarInfo(decimal transportPurchaseCost, int people)
    {
        var transportOption = MemoryData.Mobility.Transport.Options.FirstOrDefault(t => t.MonthlyPurchase == transportPurchaseCost);
        if (transportOption == default)
        {
            var newCost = transportPurchaseCost / people;
            transportOption = MemoryData.Mobility.Transport.Options.FirstOrDefault(t => t.MonthlyPurchase == newCost);
        }
        if (transportOption == default || transportOption == null)
        {
            return default;
        }
        return (transportOption.MonthlyCost, transportOption.Id == "sports_car", transportOption.Space);
    }

    public decimal GetHousePurchaseCost(string house_id)
    {
        var option = MemoryData.Housing.Buy.BuyOptions.FirstOrDefault(h => h.Id == house_id);
        if (option == default) return default;
        return option.OneTimeCosts;
    }
public List<EventCard> GetAllEventCards()
    {
    if (EventCards is null || EventCards.Count <= 0) 
        throw new Exception("Eventcards do not exist. Are they filled in correctly by reading the database?");
    return EventCards;
    }
}
