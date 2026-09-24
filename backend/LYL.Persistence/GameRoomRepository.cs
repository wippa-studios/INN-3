using System;
using System.Collections.Concurrent;
using LYL.Domain.Model;
using LYL.Persistence.Interfaces;

namespace LYL.Persistence;

public class GameRoomRepository : IGameRoomRepository
{
    // Temporary in memory implementation, concurrentdictionary for thread safety (no race conditions)
    private readonly ConcurrentDictionary<string, GameRoom> activeRooms = new();

    public Task AddAsync(GameRoom room)
    {
        activeRooms.TryAdd(room.RoomCode, room);

        // Fake async
        return Task.CompletedTask;
    }

    public Task<GameRoom?> GetByRoomCodeAsync(string roomCode)
    {
        activeRooms.TryGetValue(roomCode, out var room);
        return Task.FromResult(room);
    }

    public Task UpdateAsync(GameRoom room)
    {
        //No need to update for in memory (same reference)
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string roomCode)
    {
        activeRooms.TryRemove(roomCode, out _);
        return Task.CompletedTask;
    }
}
