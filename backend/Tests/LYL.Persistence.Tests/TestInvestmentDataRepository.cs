using System.Text.Json;
using LYL.Domain.Model.JsonModel;

namespace LYL.Persistence.Tests;

public class TestInvestmentDataRepository
{
    private readonly InMemoryDataRepository _repo;

    private const string SampleJson = """
    {
      "config": {
        "timeHorizonYears": 20,
        "inflationRate": 0.02,
        "savingsRate": 0.01
      },
      "profiles": [
        { "id": "conservative", "nameKey": "investments.profiles.conservative.name", "rate": 0.05, "marketModifiers": { "bull": 0.15, "bear": -0.15 } },
        { "id": "neutral",      "nameKey": "investments.profiles.neutral.name",      "rate": 0.06, "marketModifiers": { "bull": 0.20, "bear": -0.20 } },
        { "id": "dynamic",      "nameKey": "investments.profiles.dynamic.name",      "rate": 0.07, "marketModifiers": { "bull": 0.25, "bear": -0.25 } }
      ],
      "principalAmounts": [1000, 2000, 5000, 10000, 50000, 100000, 150000]
    }
    """;

    public TestInvestmentDataRepository()
    {
        _repo = new InMemoryDataRepository();
        using var document = JsonDocument.Parse(SampleJson);
        _repo.FillInMemoryData(new Dictionary<string, JsonDocument>
        {
            { "investmentdata.json", document }
        });
    }

    [Fact]
    public void GivenValidJson_WhenFilled_ThenConfigIsLoaded()
    {
        var data = _repo.GetInvestmentData();

        Assert.Equal(20, data.Config.TimeHorizonYears);
        Assert.Equal(0.02m, data.Config.InflationRate);
        Assert.Equal(0.01m, data.Config.SavingsRate);
    }

    [Fact]
    public void GivenValidJson_WhenFilled_ThenThreeProfilesAreLoaded()
    {
        var data = _repo.GetInvestmentData();

        Assert.Equal(3, data.Profiles.Count);
    }

    [Theory]
    [InlineData("conservative", 0.05)]
    [InlineData("neutral", 0.06)]
    [InlineData("dynamic", 0.07)]
    public void GivenProfileId_WhenFilled_ThenCorrectRateIsLoaded(string profileId, double expectedRate)
    {
        var data = _repo.GetInvestmentData();
        var profile = data.Profiles.FirstOrDefault(p => p.Id == profileId);

        Assert.NotNull(profile);
        Assert.Equal((decimal)expectedRate, profile.Rate);
    }

    [Fact]
    public void GivenValidJson_WhenFilled_ThenPrincipalAmountsAreLoaded()
    {
        var data = _repo.GetInvestmentData();

        Assert.Contains(1000m, data.PrincipalAmounts);
        Assert.Contains(150000m, data.PrincipalAmounts);
    }

    [Fact]
    public void GivenNeutralProfile_WhenFilled_ThenMarketModifiersAreLoaded()
    {
        var data = _repo.GetInvestmentData();
        var neutral = data.Profiles.First(p => p.Id == "neutral");

        Assert.Equal(0.20m, neutral.MarketModifiers.Bull);
        Assert.Equal(-0.20m, neutral.MarketModifiers.Bear);
    }
}
