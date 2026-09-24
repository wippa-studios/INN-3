using System.Text.Json.Serialization;
namespace LYL.Domain.Model.JsonModel
{
    public class SavingsOption
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("amountKey")]
        public string AmountKey { get; set; }

        [JsonPropertyName("returnKey")]
        public string ReturnKey { get; set; }

        [JsonPropertyName("infoKey")]
        public string InfoKey { get; set; }
    }
}