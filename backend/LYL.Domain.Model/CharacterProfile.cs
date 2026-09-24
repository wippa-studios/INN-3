using System;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model;

public class CharacterProfile
{
    [JsonPropertyName("id")] public string Id { get; set; }
    [JsonPropertyName("nameKey")] public string Name { get; set; }
    [JsonPropertyName("age")] public int Age { get; set; }
    [JsonPropertyName("educationKey")] public string EducationKey { get; set; }
    [JsonPropertyName("interestKey")] public string InterestKey { get; set; }
    [JsonPropertyName("infoKey")] public string InfoKey { get; set; }
    [JsonPropertyName("experienceKey")] public string ExperienceKey { get; set; }

    [JsonPropertyName("parentalSupportKey")]
    public string ParentalSupportKey { get; set; }

    [JsonPropertyName("experienceInMonths")]
    public int ExperienceInMonths { get; set; }
}
