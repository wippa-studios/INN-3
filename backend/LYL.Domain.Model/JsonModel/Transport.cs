using System.Text.Json.Serialization;
namespace LYL.Domain.Model.JsonModel
{
    public class Transport
    {
        [JsonPropertyName("options")]
        public List<TransportOption> Options { get; set; }
    }
}
