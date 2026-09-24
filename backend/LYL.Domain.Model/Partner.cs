using System;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model;

public class Partner
{
    
    [JsonPropertyName("id")]
    public string Id {get; set;} 

    [JsonPropertyName("wageKey")]
    public string WageKey {get; set;}

    [JsonPropertyName("wage")]
    public decimal Wage {get; set;}

    [JsonPropertyName("savingsKey")]
    public string SavingsKey {get; set;}

    [JsonPropertyName("savings")]
    public decimal Savings {get; set;}
}
