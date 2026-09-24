using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class AutoInsuranceOption
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("descKey")]
        public string DescKey { get; set; }
        
        [JsonPropertyName("coverageKey")]
        public string CoverageKey { get; set; }

        [JsonPropertyName("franchise")]
        public decimal Franchise { get; set; }

        [JsonPropertyName("yearlyCost")]
        public decimal YearlyCost { get; set; }

        [JsonPropertyName("monthlyCost")]
        public decimal MonthlyCost { get; set; }
        
        [JsonPropertyName("monthlyCostSports")]
        public decimal MonthlyCostSports { get; set; }
    }
}