using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel.Event;

public class EventCardOption
{
    [JsonPropertyName("conditionId")]
    public string ConditionId { get; set; } = string.Empty;

    [JsonPropertyName("labelKey")]
    public string LabelKey { get; set; } = string.Empty;

    [JsonPropertyName("valueKey")]
    public string ValueKey { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public decimal? Amount { get; set; } 

    [JsonPropertyName("usesFranchise")]
    public bool? UsesFranchise { get; set; }

    [JsonPropertyName("multiplier")]
    public string? Multiplier { get; set; }
}