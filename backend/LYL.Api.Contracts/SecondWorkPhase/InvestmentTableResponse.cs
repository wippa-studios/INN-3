using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LYL.Api.Contracts.SecondWorkPhase;

public class InvestmentTableResponse
{
    [JsonPropertyName("playerProfile")]
    public string PlayerProfile { get; set; }

    [JsonPropertyName("config")]
    public InvestmentConfigDto Config { get; set; }

    [JsonPropertyName("table")]
    public List<InvestmentTableRow> Table { get; set; }
}

public class InvestmentConfigDto
{
    [JsonPropertyName("timeHorizonYears")]
    public int TimeHorizonYears { get; set; }

    [JsonPropertyName("inflationRate")]
    public decimal InflationRate { get; set; }

    [JsonPropertyName("savingsRate")]
    public decimal SavingsRate { get; set; }
}

public class InvestmentTableRow
{
    [JsonPropertyName("principal")]
    public decimal Principal { get; set; }

    [JsonPropertyName("inflationImpact")]
    public decimal InflationImpact { get; set; }

    [JsonPropertyName("savingsReturn")]
    public decimal SavingsReturn { get; set; }

    [JsonPropertyName("returns")]
    public Dictionary<string, decimal> Returns { get; set; }
}
