using LYL.Domain.Model.Interfaces;
using LYL.Domain.Model.JsonModel;
using LYL.Domain.Model.JsonModel.Event;
using LYL.Domain.Services.Interfaces;
using LYL.Persistence.Interfaces;

namespace LYL.Domain.Services;

public class InMemoryAccessService : IMemoryAccessService
{
    private IInMemoryDataRepository _repo;
    private IInvestmentCalculator _returnInvestCalc;
    public InMemoryAccessService(IInMemoryDataRepository repo)
    {
        _repo = repo;
    }

    public bool CheckAccidentInsurance(decimal? insuranceCost)
    {
        if (insuranceCost == null)
        {
            return false;
        }
        else
        {
            return _repo.CheckAccidentInsurance((decimal)insuranceCost);
        }
        
    }

    public bool CheckFamilyInsurance(decimal? insuranceCost)
    {
        if (insuranceCost == null)
        {
            return false;
        }
        else
        {
            return _repo.CheckFamilyInsurance((decimal)insuranceCost);
        }
    }

    public bool CheckFireInsuranceCost(decimal? insuranceCost, string house_id)
    {
        if (insuranceCost == null)
        {
            return false;
        }
        else
        {
            return _repo.CheckFireInsurance((decimal)insuranceCost, house_id);
        }
    }

    public (decimal adult, decimal child) GetHospitalisationInsurance()
    {
            return _repo.GetHospitalisationInsurance();
    }

    public bool CheckLivingExpense(decimal otherLivingCost, string house_id)
    {
        return _repo.CheckLivingExpense(otherLivingCost, house_id);
    }

    public string GetHouseId(decimal housingCost)
    {
        return _repo.GetHouseId(housingCost);
    }

    public (decimal monthlyCost, bool isSport) GetMonthlyCarCost(decimal transportPurchaseCost)
    {
        return _repo.GetMonthlyCarCost(transportPurchaseCost);
    }

    public bool CheckTransportInsurance(decimal? insuranceCost, bool isSport)
    {
        if (insuranceCost == null)
        {
            return false;
        }
        else
        {
            return _repo.CheckTransportInsurance((decimal)insuranceCost, isSport);
        }
    }

    public (decimal childDeduction, decimal maxIncome) GetSocialHousingCondition()
    {
        return _repo.GetSocialHousingCondition();
    }

    public bool CheckLivingExpense(decimal otherLivingCost, string house_id, int children, bool hasPartner)
    {
        return _repo.CheckLivingExpense(otherLivingCost, house_id, children, hasPartner);
    }

    public (int maxSpace, bool needsCar, decimal startBudget) GetHouseInfoBuy(string house_id)
    {
        return _repo.GetHouseInfoBuy(house_id);
    }

    public (int maxSpace, bool needsCar) GetHouseInfoRent(string house_id)
    {
        return _repo.GetHouseInfoRent(house_id);
    }

    public (decimal monthlyCost, bool isSport, int seats) GetCarInfo(decimal transportPurchaseCost, int people)
    {
        return _repo.GetCarInfo(transportPurchaseCost, people);
    }

    public decimal GetHousePurchaseCost(string house_id)
    {
        return _repo.GetHousePurchaseCost(house_id);
    }

    public InvestmentData GetInvestmentData()
    {
        return _repo.GetInvestmentData();
    }

    public List<EventCard> GetAllEventCards()
    {
    return _repo.GetAllEventCards();
    }

}
