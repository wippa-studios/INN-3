using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel;

public class MarketModifiers
{
    [JsonPropertyName("bull")]
    public decimal Bull { get; set; }

    [JsonPropertyName("bear")]
    public decimal Bear { get; set; }
}
