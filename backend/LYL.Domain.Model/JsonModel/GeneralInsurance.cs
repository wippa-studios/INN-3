using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class GeneralInsurance
    {
        [JsonPropertyName("options")]
        public List<GeneralInsuranceOption> Options { get; set; }
    }
}