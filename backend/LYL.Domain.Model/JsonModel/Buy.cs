using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class Buy
    {
        [JsonPropertyName("options")]
        public List<BuyOption> BuyOptions { get; set; } //TODO
    }
}