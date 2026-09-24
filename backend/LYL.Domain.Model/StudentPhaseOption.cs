using System;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model;

public class StudentPhaseOption
{
    [JsonPropertyName("id")] public string Id { get; set; }
    [JsonPropertyName("titleKey")] public string TitleKey { get; set; }
    [JsonPropertyName("descriptionKey")] public string DescriptionKey { get; set; }
    [JsonPropertyName("preFilledSlots")] public int FilledSlots { get; set; }
    [JsonPropertyName("maxSlots")] public int MaxSlots { get; set; }

    public void FillSlot()
    {
        FilledSlots++;
    }
}
