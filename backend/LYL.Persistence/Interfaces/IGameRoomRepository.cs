using System;
using LYL.Domain.Model;

namespace LYL.Persistence.Interfaces;

public interface IGameRoomRepository
{
    Task AddAsync(GameRoom room);
    Task<GameRoom?> GetByRoomCodeAsync(string roomCode);
    Task UpdateAsync(GameRoom room);
    Task RemoveAsync(string roomCode);
}
