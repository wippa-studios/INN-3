using System.Text.Json.Serialization;
namespace LYL.Domain.Model.JsonModel
{
    public class TransportOption
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("infoKey")]
        public string InfoKey { get; set; }

        [JsonPropertyName("purchasePrice")]
        public decimal PurchasePrice { get; set; }

        [JsonPropertyName("monthlyPurchase")]
        public decimal MonthlyPurchase { get; set; }

        [JsonPropertyName("monthlyCost")]
        public decimal MonthlyCost { get; set; }

        [JsonPropertyName("space")]
        public int Space  { get; set; }
    }
}