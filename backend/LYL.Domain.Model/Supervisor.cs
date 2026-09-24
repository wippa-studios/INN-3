using System;

namespace LYL.Domain.Model;

public class Supervisor
{
    public Guid SupervisorId { get; set; }

    public string Email { get; set; }

//  This is used for the server to know to which browser it needs to send the updates surrounding the   players
    public string ConnectionId { get; set; }
}
