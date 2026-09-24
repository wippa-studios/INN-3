namespace LYL.Api.Contracts.Game;

public class JoinTableRequest
{
    public string RoomCode { get; set; }
    public int TableNumber { get; set; }
    public string NickName { get; set; }
}