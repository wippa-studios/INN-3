using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel.Event;

public enum EventCardType
{
    Fixed,
    InsuranceCheck,
    DiceRoll,
    CircleCount,
    Choice
}

public class EventCard
{
   
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("titleKey")]
    public string TitleKey { get; set; } = string.Empty;

    [JsonPropertyName("descriptionKey")]
    public string DescriptionKey { get; set; } = string.Empty;
    
    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))] //nodig voor enums uit json te halen
    public EventCardType Type { get; set; }
    
    [JsonPropertyName("relatedSkill")]
    public string? RelatedSkill { get; set; }

    [JsonPropertyName("requiredInsurance")]
    public string? RequiredInsurance { get; set; }
    
    [JsonPropertyName("options")]
    public List<EventCardOption> Options { get; set; } = new List<EventCardOption>();

    [JsonPropertyName("imageName")]
    public string? ImageName { get; set; }
}