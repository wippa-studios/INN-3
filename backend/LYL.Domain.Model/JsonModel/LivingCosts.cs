using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class LivingCosts
    {
        [JsonPropertyName("options")]
        public List<LivingCostOption> LivingCostsOptions { get; set; } //TODO
    }
}