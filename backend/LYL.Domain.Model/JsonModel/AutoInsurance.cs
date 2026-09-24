using System.Text.Json.Serialization;
using LYL.Domain.Model.JsonModel;

namespace LYL.Domain.Model.JsonModel
{
    public class AutoInsurance
    {
        [JsonPropertyName("options")]
        public List<AutoInsuranceOption> Options { get; set; }
    }
}