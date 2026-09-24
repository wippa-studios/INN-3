using LYL.Domain.Model.JsonModel;
using LYL.Domain.Model.JsonModel.Event;

namespace LYL.Domain.Model.Interfaces;

public interface IMemoryAccessService
{
    bool CheckAccidentInsurance(decimal? accidentInsuranceCost);
    bool CheckFamilyInsurance(decimal? familyInsuranceCost);
    bool CheckFireInsuranceCost(decimal? fireInsuranceCost, string house_id);
    (decimal adult, decimal child) GetHospitalisationInsurance();
    bool CheckLivingExpense(decimal otherLivingCost, string house_id);
    bool CheckTransportInsurance(decimal? transportInsuranceCost, bool isSport);
    string GetHouseId(decimal housingCost);
    (decimal monthlyCost, bool isSport) GetMonthlyCarCost(decimal transportPurchaseCost);
    (decimal monthlyCost, bool isSport, int seats) GetCarInfo(decimal transportPurchaseCost, int people);
    (decimal childDeduction, decimal maxIncome) GetSocialHousingCondition();
    bool CheckLivingExpense(decimal otherLivingCost, string house_id, int children, bool hasPartner);
    (int maxSpace, bool needsCar, decimal startBudget) GetHouseInfoBuy(string house_id);
    (int maxSpace, bool needsCar) GetHouseInfoRent(string house_id);
    decimal GetHousePurchaseCost(string house_id);
    List<EventCard> GetAllEventCards();
    InvestmentData GetInvestmentData();

}
