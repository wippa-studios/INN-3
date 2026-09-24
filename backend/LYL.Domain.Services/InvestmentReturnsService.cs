using LYL.Api.Contracts.SecondWorkPhase;
using LYL.Domain.Model;
using LYL.Domain.Model.Interfaces;
using LYL.Domain.Services.Interfaces;

namespace LYL.Domain.Services;

public class InvestmentReturnsService(IMemoryAccessService memoryAccessService) : IInvestmentReturnsService, IInvestmentCalculator
{
    public decimal CalculateReturn(decimal principal, decimal rate, int years)
    {
        return (principal * (decimal)Math.Pow((double)(1 + rate), years)) - principal;
    }

    public decimal CalculateInflationImpact(decimal principal, decimal inflationRate, int years)
    {
        return -principal / (decimal)Math.Pow((double)(1 + inflationRate), years);
    }

    public InvestmentTableResponse GetTableFor(InvestmentProfile profile)
    {
        var data = memoryAccessService.GetInvestmentData();
        var config = data.Config;
        var profileId = profile.ToString().ToLower();

        var table = data.PrincipalAmounts.Select(principal => new InvestmentTableRow
        {
            Principal = principal,
            InflationImpact = Math.Round(CalculateInflationImpact(principal, config.InflationRate, config.TimeHorizonYears), 2, MidpointRounding.AwayFromZero),
            SavingsReturn = Math.Round(CalculateReturn(principal, config.SavingsRate, config.TimeHorizonYears), 2, MidpointRounding.AwayFromZero),
            Returns = data.Profiles.ToDictionary(
                p => p.Id,
                p => Math.Round(CalculateReturn(principal, p.Rate, config.TimeHorizonYears), 2, MidpointRounding.AwayFromZero)
            )
        }).ToList();

        return new InvestmentTableResponse
        {
            PlayerProfile = profileId,
            Config = new InvestmentConfigDto
            {
                TimeHorizonYears = config.TimeHorizonYears,
                InflationRate = config.InflationRate,
                SavingsRate = config.SavingsRate
            },
            Table = table
        };
    }
}
