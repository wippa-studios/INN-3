using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class Savings
    {
        [JsonPropertyName("options")]
        public List<SavingsOption> Options { get; set; }
    }
}