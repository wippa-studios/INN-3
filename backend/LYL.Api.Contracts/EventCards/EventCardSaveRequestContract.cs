using System.Security.AccessControl;
using System.Text.Json.Serialization;

namespace LYL.Api.Contracts.EventCards;

public class EventCardSaveRequestContract
{
    [JsonPropertyName("choices")]
    public List<EventCardChoiceRequestContract> Choices { get; set; }
}

public class EventCardChoiceRequestContract
{
    [JsonPropertyName("cardId")]
    public string CardId { get; set; }
    [JsonPropertyName("conditionId")]
    public string? ConditionId { get; set; }
}