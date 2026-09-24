using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel;

public class InvestmentConfig
{
    [JsonPropertyName("timeHorizonYears")]
    public int TimeHorizonYears { get; set; }

    [JsonPropertyName("inflationRate")]
    public decimal InflationRate { get; set; }

    [JsonPropertyName("savingsRate")]
    public decimal SavingsRate { get; set; }
}
