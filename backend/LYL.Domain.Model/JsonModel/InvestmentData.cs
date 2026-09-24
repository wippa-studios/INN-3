using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel;

public class InvestmentData
{
    [JsonPropertyName("config")]
    public InvestmentConfig Config { get; set; }

    [JsonPropertyName("profiles")]
    public List<InvestmentProfileOption> Profiles { get; set; }

    [JsonPropertyName("principalAmounts")]
    public List<decimal> PrincipalAmounts { get; set; }
}
