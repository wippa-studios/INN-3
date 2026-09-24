using System;
using System.Text.Json.Serialization;

namespace LYL.Domain.Model;

public class CharacterStudentPhase
{
    [JsonPropertyName("allocatablePoints")]public int AllocatablePoints { get; set; }
    [JsonPropertyName("categories")] public List<StudentPhaseOption> Options { get; set; }
}
