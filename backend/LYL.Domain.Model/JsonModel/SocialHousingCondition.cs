using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class SocialHousingCondition
    {
        [JsonPropertyName("childDeduction")]
        public decimal ChildDeduction { get; set; }
        [JsonPropertyName("maxIncome")]
        public decimal MaxIncome { get; set; }
        [JsonPropertyName("exampleIncome")]
        public int ExampleIncome { get; set; }
        [JsonPropertyName("exampleChildren")]
        public int ExampleChildren { get; set; }
    }
}