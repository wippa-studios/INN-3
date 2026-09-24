namespace LYL.Domain.Model;

public class GameRoom
{
    public GameRoom(Supervisor host, string roomCode)
    {
        Host = host;
        RoomCode = roomCode;
        
        for (int i = 1; i <= 4; i++)
        {
            Tables.Add(new Table { TableNumber = i });
        }
    }
    public Guid GameRoomId { get; set; }

    public string Name { get; set; }

    public string RoomCode { get; set; }

    public bool IsActive { get; set; }

    public Supervisor Host { get; set; }

    public List<Table> Tables { get; set; } = new();
}