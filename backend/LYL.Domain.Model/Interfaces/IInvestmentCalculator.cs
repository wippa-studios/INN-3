namespace LYL.Domain.Model.Interfaces;

public interface IInvestmentCalculator
{
    decimal CalculateReturn(decimal principal, decimal rate, int years);
    decimal CalculateInflationImpact(decimal principal, decimal inflationRate, int years);
}