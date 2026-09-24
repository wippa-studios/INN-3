using System;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model;

public class Job
{
    [JsonPropertyName("titleKey")] public string JobNameKey { get; set; }
    [JsonPropertyName("startNet")] public int StartNet { get; set; }
    [JsonPropertyName("startBrut")] public int StartBrut { get; set; }
    [JsonPropertyName("avgBrut")] public int AvgBrut { get; set; }
    [JsonPropertyName("avgNet")] public int AvgNet { get; set; }
    [JsonPropertyName("pension")] public int Pension { get; set; }
    [JsonPropertyName("hasBenefits")] public bool HasBenefits { get; set; }
}
