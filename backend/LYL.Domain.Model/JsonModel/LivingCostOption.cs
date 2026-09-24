using System.Text.Json.Serialization;

namespace LYL.Domain.Model.JsonModel
{
    public class LivingCostOption
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("nameKey")]
        public string NameKey { get; set; }

        [JsonPropertyName("no_children")]
        public int? NoChildren { get; set; }

        [JsonPropertyName("one_child")]
        public object OneChild { get; set; } //TODO Soms int, soms string in json dus check zeker doen in service die dit gebruikt!

        [JsonPropertyName("two_children")]
        public object TwoChildren { get; set; } //TODO Soms int, soms string in json dus check zeker doen in service die dit gebruikt!

        [JsonPropertyName("three_children")]
        public object ThreeChildren { get; set; } //TODO Soms int, soms string in json dus check zeker doen in service die dit gebruikt!
    }
}