using LYL.Api.Contracts.SecondWorkPhase;
using LYL.Domain.Model;

namespace LYL.Domain.Services.Interfaces;

public interface IInvestmentReturnsService
{
   
    InvestmentTableResponse GetTableFor(InvestmentProfile profile);
}
