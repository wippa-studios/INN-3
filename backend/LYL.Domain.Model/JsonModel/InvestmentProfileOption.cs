using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel;

public class InvestmentProfileOption
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("nameKey")]
    public string NameKey { get; set; }

    [JsonPropertyName("rate")]
    public decimal Rate { get; set; }

    [JsonPropertyName("marketModifiers")]
    public MarketModifiers MarketModifiers { get; set; }
}
