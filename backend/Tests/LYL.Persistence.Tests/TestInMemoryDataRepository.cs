using System.Text.Json;
namespace LYL.Persistence.Tests;

public class TestInMemoryDataRepository
{
    private readonly InMemoryDataRepository _repo;

    public TestInMemoryDataRepository()
    {
        _repo = new InMemoryDataRepository();
        
        var jsonText = File.ReadAllText(@""); //TODO: Indien test, haal gegevens op!!!! 
        using var document = JsonDocument.Parse(jsonText);
        var jsonData = new Dictionary<string, JsonDocument>
        {
            { "dossierdata.json", document }
        };
        _repo.FillInMemoryData(jsonData);

    }

    [Fact]
    public void GivenExistingRentCost_WhenGettingHouseId_ThenReturnsCorrectHouseId()
    {
        var result = _repo.GetHouseId(250);

        Assert.Equal("stay_home", result);
    }

    [Fact]
    public void GivenNonExistingRentCost_WhenGettingHouseId_ThenReturnsEmptyString()
    {
        var result = _repo.GetHouseId(15000);

        Assert.Equal("", result);
    }

    [Fact]
    public void GivenExistingBuyCost_WhenGettingHouseId_ThenReturnsCorrectHouseId()
    {
        var result = _repo.GetHouseId(1400);

        Assert.Equal("buy_house_country", result);
    }

    [Fact]
    public void GivenExistingTransportPurchaseCost_WhenGettingMonthlyCarCost_ThenReturnsCorrectMonthlyCost()
    {
        var result = _repo.GetMonthlyCarCost(210);

        Assert.Equal(175, result.monthlyCost);
        Assert.False(result.isSport);
    }

    [Fact]
    public void GivenExistingSportCarPurchaseCost_WhenGettingMonthlyCarCost_ThenReturnsCorrectMonthlyCostAndTrue()
    {
        var result = _repo.GetMonthlyCarCost(420);

       Assert.Equal(200, result.monthlyCost);
        Assert.True(result.isSport);
    }

    [Fact]
    public void GivenNonExistingTransportPurchaseCost_WhenMonthlyCarCost_ThenReturnsDefault()
    {
        var result = _repo.GetMonthlyCarCost(1500);

        Assert.Equal(default, result);
    }
    [Fact]
    public void GivenCorrectAccidentInsuranceCost_WhenCheckingCost_ThenReturnsTrue()
    {
        var result = _repo.CheckAccidentInsurance(7);

        Assert.True(result);
    }

    [Fact]
    public void GivenWrongAccidentInsuranceCost_WhenCheckingCost_ThenReturnsFalse()
    {
        var result = _repo.CheckAccidentInsurance(100);

        Assert.False(result);
    }

    [Fact]
    public void WhenGettingSocialHousingCondition_ThenReturnsCorrectConditions()
    {
        (decimal child, decimal maxIncome) = _repo.GetSocialHousingCondition();

        Assert.Equal(200, child);
        Assert.Equal(1600, maxIncome);
    }

    [Theory]
    [InlineData("rent_shared_5y", 1.5)]
    [InlineData("rent_shared", 2.5)]
    [InlineData("rent_apt_city", 10)]
    [InlineData("rent_house_country", 20.0)]
    [InlineData("buy_apt_city", 10.0)]
    [InlineData("buy_house_country", 55.0)]
    [InlineData("stay_home", 0)]
    public void GivenCorrectFireInsuranceCostAndHouseId_WhenCheckingCost_ThenReturnsTrue(string house_id, decimal cost)
    {
        var result = _repo.CheckFireInsurance(cost, house_id);

        Assert.True(result);
    }

    [Fact]
    public void GivenWrongFireInsuranceCost_WhenCheckingCost_ThenReturnsFalse()
    {
        var result = _repo.CheckFireInsurance(100, "rent_shared");

        Assert.False(result);
    }

    [Fact]
    public void GivenCorrectFamilyInsuranceCost_WhenCheckingCost_ThenReturnsTrue()
    {
        var result = _repo.CheckFamilyInsurance(10);

        Assert.True(result);
    }

    [Fact]
    public void GivenWrongFamilyInsuranceCost_WhenCheckingCost_ThenReturnsFalse()
    {
        var result = _repo.CheckFamilyInsurance(100);

        Assert.False(result);
    }

    [Fact]
    public void WhenGettingHospitalizationInsurance_ThenReturnsCorrectCosts()
    {
        (decimal adult, decimal child) = _repo.GetHospitalisationInsurance();

        Assert.Equal(5, child);
        Assert.Equal(10, adult);
    }

    [Theory]
    [InlineData(25, false)]
    [InlineData(125, true)]
    public void GivenCorrectCarInsuranceCost_WhenCheckingCost_ThenReturnsTrue(decimal cost, bool isSport)
    {
        var result = _repo.CheckTransportInsurance(cost, isSport);

        Assert.True(result);
    }

    [Theory]
    [InlineData(100, false)]
    [InlineData(100, true)]
    public void GivenWrongCarInsuranceCost_WhenCheckingCost_ThenReturnsFalse(decimal cost, bool isSport)
    {
        var result = _repo.CheckTransportInsurance(cost, isSport);

        Assert.False(result);
    }

    [Theory]
    [InlineData("rent_shared", 750)]
    [InlineData("buy_apt_city", 900)]
    public void GivenCorrectLivingExpenseAndHouseId_WhenCheckingLivingExpense_ThenReturnsTrue(string id, decimal cost)
    {
        var result = _repo.CheckLivingExpense(cost, id);

        Assert.True(result);
    }

    [Theory]
    [InlineData("rent_shared", 900)]
    [InlineData("buy_apt_city", 750)]
    [InlineData("buy_apt_city", 1300)]
    [InlineData("rent_shared", 10000)]
    [InlineData("buy_apt_city", 1400)]
    public void GivenWrongLivingExpenseAndHouseId_WhenCheckingLivingExpense_ThenReturnsFalse(string id, decimal cost)
    {
        var result = _repo.CheckLivingExpense(cost, id);

        Assert.False(result);
    }

    [Theory]
    [InlineData("rent_shared", 750, 0, false)]
    [InlineData("buy_apt_city", 900, 0, false)]
    [InlineData("rent_apt_city", 1300, 0, true)]
    [InlineData("rent_apt_city", 2400, 2, true)]
    [InlineData("buy_apt_city", 2500, 3, false)]
    public void GivenCorrectLivingExpenseAndInfo_WhenCheckingLivingExpense_ThenReturnsTrue
    (string id, decimal cost, int children, bool hasPartner)
    {
        var result = _repo.CheckLivingExpense(cost, id, children, hasPartner);

        Assert.True(result);
    }

    [Theory]
    [InlineData("rent_shared", 900, 0, false)]
    [InlineData("buy_apt_city", 750, 0, false)]
    [InlineData("buy_apt_city", 1300, 0, false)]
    [InlineData("rent_shared", 10000, 0, false)]
    [InlineData("rent_apt_city", 1300, 0, false)]
    [InlineData("buy_apt_city", 2500, 3, true)]
    [InlineData("rent_shared", 750, 0, true)]
    [InlineData("buy_apt_city", 900, 1, false)]
    [InlineData("rent_apt_city", 1300, 2, true)]
    [InlineData("rent_apt_city", 2400, 1, true)]
    [InlineData("buy_apt_city", 2500, 0, false)]
    public void GivenWrongLivingExpenseAndInfo_WhenCheckingLivingExpense_ThenReturnsFalse
    (string id, decimal cost, int children, bool hasPartner)
    {
        var result = _repo.CheckLivingExpense(cost, id, children, hasPartner);

        Assert.False(result);
    }

    [Fact]
    public void GivenCorrectHouseId_WhenGettingHouseInfoBuy_ThenReturnsCorrectInfo()
    {
        var result = _repo.GetHouseInfoBuy("buy_house_country");

        Assert.Equal(5, result.maxSpace);
        Assert.True(result.needsCar);
        Assert.Equal(91000, result.startBudget);
    }

    [Theory]
    [InlineData("rent_shared")]
    [InlineData("")]
    public void GivenWrongHouseId_WhenGettingHouseInfoBuy_ThenReturnsDefault(string id)
    {
        var result = _repo.GetHouseInfoBuy(id);

        Assert.Equal(default, result);
    }

    [Fact]
    public void GivenCorrectHouseId_WhenGettingHouseInfoRent_ThenReturnsCorrectInfo()
    {
        var result = _repo.GetHouseInfoRent("rent_apt_city");

        Assert.Equal(3, result.maxSpace);
        Assert.False(result.needsCar);
    }

    [Theory]
    [InlineData("buy_house_country")]
    [InlineData("")]
    public void GivenWrongHouseId_WhenGettingHouseInfoRent_ThenReturnsDefault(string id)
    {
        var result = _repo.GetHouseInfoRent(id);

        Assert.Equal(default, result);
    }

    [Fact]
    public void GivenCorrectTransportPurchaseCost_WhenGettingCarInfo_ThenReturnsCorrectInfo()
    {
        var result = _repo.GetCarInfo(210);

        Assert.Equal(175, result.monthlyCost);
        Assert.False(result.isSport);
        Assert.Equal(5, result.seats);
    }

    [Theory]
    [InlineData(10)]
    [InlineData(0)]
    public void GivenWrongTransportPurchaseCost_WhenGettingCarInfo_ThenReturnsDefault(decimal cost)
    {
        var result = _repo.GetCarInfo(cost);

        Assert.Equal(default, result);
    }

    [Fact]
    public void GivenCorrectHouseId_WhenGettingHousePurchaseCost_ThenReturnsCorrectCost()
    {
        var result = _repo.GetHousePurchaseCost("buy_villa_country");

        Assert.Equal(28000, result);
    }

    [Fact]
    public void GivenWrongHouseId_WhenGettingHousePurchaseCost_ThenReturnsDefault()
    {
        var result = _repo.GetHousePurchaseCost("rent_shared");

        Assert.Equal(default, result);
    }
}
