using System.Text.Json.Serialization;
using LYL.Domain.Model.JsonModel;
namespace LYL.Domain.Model.JsonModel
{
    public class RentOption
    {//naam kan problemen geven bij serialize
        [JsonPropertyName("id")]
        public string Id { get; set; }
        
        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("spaceKey")]
        public string SpaceKey { get; set; }

        [JsonPropertyName("space")]
        public int Space {get; set;}

        [JsonPropertyName("mobilityKey")]
        public string MobilityKey { get; set; }

        [JsonPropertyName("needsCar")]
        public bool NeedsCar { get; set; }

        [JsonPropertyName("monthly")]
        public decimal Monthly { get; set; }
    }
}