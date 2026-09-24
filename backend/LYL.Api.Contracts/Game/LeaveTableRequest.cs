using System;

namespace LYL.Api.Contracts.Game;

public class LeaveTableRequest
{
    public string RoomCode { get; set; }
    public int TableNumber { get; set; }
    public string NickName { get; set; }
    public Guid PlayerId { get; set; }
}
