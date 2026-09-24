using System.Text.Json;
using LYL.Domain.Model;
using LYL.Domain.Model.JsonModel;
using LYL.Domain.Model.JsonModel.Event;

namespace LYL.Persistence.Interfaces;

public interface IInMemoryDataRepository
{
    bool CheckAccidentInsurance(decimal transportInsuranceCost);
    bool CheckFamilyInsurance(decimal insuranceCost);
    bool CheckFireInsurance(decimal insuranceCost, string house_id);
    (decimal adult, decimal child) GetHospitalisationInsurance();
    bool CheckTransportInsurance(decimal insuranceCost, bool isSport);
    void FillInMemoryData(Dictionary<string, JsonDocument> schoneData);
    string GetHouseId(decimal monthlyCost);
    (decimal monthlyCost, bool isSport) GetMonthlyCarCost(decimal transportPurchaseCost);
    (decimal childDeduction, decimal maxIncome) GetSocialHousingCondition();
    bool CheckLivingExpense(decimal otherLivingCost, string house_id);
    List<Character> getCharacters();
    List<Partner> GetPartners();
    bool CheckLivingExpense(decimal otherLivingCost, string house_id, int children, bool hasPartner);
    (int maxSpace, bool needsCar, decimal startBudget) GetHouseInfoBuy(string house_id);
    (int maxSpace, bool needsCar) GetHouseInfoRent(string house_id);
    (decimal monthlyCost, bool isSport, int seats) GetCarInfo(decimal transportPurchaseCost, int people);
    decimal GetHousePurchaseCost(string house_id);
    List<EventCard> GetAllEventCards();
    InvestmentData GetInvestmentData();
}
