using LYL.Domain.Model;
using LYL.Domain.Model.Interfaces;
using LYL.Domain.Model.JsonModel;
using LYL.Domain.Services;
using Moq;

namespace LYL.Domain.Test;

public class TestInvestmentReturnsService
{
    private readonly InvestmentReturnsService _service;

    public TestInvestmentReturnsService()
    {
        var investmentData = new InvestmentData
        {
            Config = new InvestmentConfig
            {
                TimeHorizonYears = 20,
                InflationRate = 0.02m,
                SavingsRate = 0.01m
            },
            Profiles =
            [
                new InvestmentProfileOption { Id = "conservative", NameKey = "investments.profiles.conservative.name", Rate = 0.05m, MarketModifiers = new MarketModifiers { Bull = 0.15m, Bear = -0.15m } },
                new InvestmentProfileOption { Id = "neutral",      NameKey = "investments.profiles.neutral.name",      Rate = 0.06m, MarketModifiers = new MarketModifiers { Bull = 0.20m, Bear = -0.20m } },
                new InvestmentProfileOption { Id = "dynamic",      NameKey = "investments.profiles.dynamic.name",      Rate = 0.07m, MarketModifiers = new MarketModifiers { Bull = 0.25m, Bear = -0.25m } }
            ],
            PrincipalAmounts = [1000, 10000, 100000]
        };

        var mockMemory = new Mock<IMemoryAccessService>();
        mockMemory.Setup(m => m.GetInvestmentData()).Returns(investmentData);

        _service = new InvestmentReturnsService(mockMemory.Object);
    }

    // --- CalculateReturn ---

    [Theory]
    [InlineData(10000, 0.01, 20, 2201.90)] // savings rate, Excel D10
    [InlineData(10000, 0.05, 20, 16532.98)] // conservative, Excel E10
    [InlineData(10000, 0.06, 20, 22071.35)] // neutral, Excel F10
    [InlineData(10000, 0.07, 20, 28696.84)] // dynamic, Excel G10
    public void GivenPrincipalRateYears_WhenCalculatingReturn_ThenMatchesExcel(
        decimal principal, double rate, int years, decimal expected)
    {
        var result = Math.Round(_service.CalculateReturn(principal, (decimal)rate, years), 2, MidpointRounding.AwayFromZero);

        Assert.Equal(expected, result);
    }

    [Fact]
    public void GivenPrincipalAndInflationRate_WhenCalculatingInflationImpact_ThenMatchesExcel()
    {
        // Excel B10: -1000 * 1/(1+0.02)^20 = -6729.71 (for 10000 principal)
        var result = Math.Round(_service.CalculateInflationImpact(10000, 0.02m, 20), 2, MidpointRounding.AwayFromZero);

        Assert.Equal(-6729.71m, result);
    }

    // --- GetTableFor ---

    [Fact]
    public void GivenNeutralProfile_WhenGettingTable_ThenPlayerProfileIsNeutral()
    {
        var response = _service.GetTableFor(InvestmentProfile.Neutral);

        Assert.Equal("neutral", response.PlayerProfile);
    }

    [Fact]
    public void GivenInvestmentData_WhenGettingTable_ThenRowCountMatchesPrincipalAmounts()
    {
        var response = _service.GetTableFor(InvestmentProfile.Neutral);

        Assert.Equal(3, response.Table.Count);
    }

    [Fact]
    public void GivenInvestmentData_WhenGettingTable_ThenEachRowHasAllThreeProfiles()
    {
        var response = _service.GetTableFor(InvestmentProfile.Neutral);
        var row = response.Table.First();

        Assert.True(row.Returns.ContainsKey("conservative"));
        Assert.True(row.Returns.ContainsKey("neutral"));
        Assert.True(row.Returns.ContainsKey("dynamic"));
    }

    [Fact]
    public void GivenInvestmentData_WhenGettingTable_ThenConfigIsIncluded()
    {
        var response = _service.GetTableFor(InvestmentProfile.Neutral);

        Assert.Equal(20, response.Config.TimeHorizonYears);
        Assert.Equal(0.02m, response.Config.InflationRate);
        Assert.Equal(0.01m, response.Config.SavingsRate);
    }
}
