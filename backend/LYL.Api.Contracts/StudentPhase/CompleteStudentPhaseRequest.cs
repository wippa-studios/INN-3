using System;
using LYL.Domain.Model;

namespace LYL.Api.Contracts.StudentPhase;

public class CompleteStudentPhaseRequest
{
     public Dictionary<string, int> Selections { get; set; }
}
