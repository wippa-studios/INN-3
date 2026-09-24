using System.Dynamic;
using System.Text.Json.Serialization;
using LYL.Domain.Model.JsonModel;
namespace LYL.Domain.Model.JsonModel;

public class Housing
{
    [JsonPropertyName("rent")]
    public Rent Rent { get; set; }

    [JsonPropertyName("buy")]
    public Buy Buy {get; set;}   

}
