using System;

namespace LYL.Api.Contracts.Game;

public class LeaveTableResponse
{
    public int TableNumber { get; set; }
    public Guid PlayerId { get; set; }
}
