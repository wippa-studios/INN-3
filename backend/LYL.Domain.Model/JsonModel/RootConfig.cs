using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel;

public class RootConfig
{
    [JsonPropertyName("housing")]
    public Housing Housing { get; set; }

    [JsonPropertyName("living_costs")]
    public LivingCosts LivingCosts { get; set; }

    [JsonPropertyName("mobility")]
    public Mobility Mobility { get; set; }

    [JsonPropertyName("general_insurance")]
    public GeneralInsurance GeneralInsurance { get; set; }

    [JsonPropertyName("savings")]
    public Savings Savings { get; set; }

}
