using System.Text.Json.Serialization;
using LYL.Domain.Model.JsonModel;

namespace LYL.Domain.Model.JsonModel
{
    public class Rent
    {
        [JsonPropertyName("options")]
        public List<RentOption> HousingOptions {get; set;}
        [JsonPropertyName("social_housing_conditions")]
        public SocialHousingCondition socialHousingConditions { get; set; } 
    }
}