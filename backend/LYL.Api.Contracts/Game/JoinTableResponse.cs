using System;

namespace LYL.Api.Contracts.Game;

public class JoinTableResponse
{
    public string NickName { get; set; }
    public int TableNumber { get; set; }
    public Guid PlayerId { get; set; }
    public bool IsGameAlreadyStarted { get; set; }
    public string CurrentPhase { get; set; }
}
