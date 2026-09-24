using System;

namespace LYL.Api.Contracts.Game;

public class CreateRoomRequest
{
    public required Guid SupervisorId { get; set; }
}
