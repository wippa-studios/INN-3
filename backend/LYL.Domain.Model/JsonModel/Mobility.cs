using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class Mobility
    {
        [JsonPropertyName("transport")]
        public Transport Transport { get; set; }

        [JsonPropertyName("auto_insurance")]
        public AutoInsurance AutoInsurance { get; set; }
    }
}