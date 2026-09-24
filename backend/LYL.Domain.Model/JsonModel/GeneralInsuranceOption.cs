using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class GeneralInsuranceOption
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("infoKey")]
        public string InfoKey { get; set; }

        [JsonPropertyName("costsKey")]
        public string CostsKey { get; set; }

        [JsonPropertyName("franchise")]
        public decimal Franchise { get; set; }

        // velden in de costs json per optie verschillen 
        // dus daarom een dictiornary.
        [JsonPropertyName("costs")]
        public Dictionary<string, decimal> Costs { get; set; } //key is soort housing

        //TODO coverage key + check family wat doet die 5 in de json?
    }
}