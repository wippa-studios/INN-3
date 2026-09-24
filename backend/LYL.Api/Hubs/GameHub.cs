using System;
using System.Collections.Concurrent;
using LYL.Api.Contracts.Game;
using LYL.Domain.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace LYL.Api.Hubs;

public class GameHub(IGameSessionService sessionService) : Hub
{
    //TODO Check with team how we want to keep this, for testing purposes now IM
    private static readonly ConcurrentDictionary<string, (string PlayerId, string RoomCode)> connections = new();

    public async Task SubscribeToRoom(string roomCode)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);
    }

    public async Task<JoinTableResponse> JoinTable(JoinTableRequest request)
    {
        try
        {
            var response = await sessionService.JoinTableAsync(request);
            await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomCode);
            await Clients.Group(request.RoomCode).SendAsync("PlayerJoined", response);
            connections[Context.ConnectionId] = (response.PlayerId.ToString(), request.RoomCode);
            return response;
        }
        catch (Exception e)
        {
            await Clients.Caller.SendAsync("JoinFailed", e.Message);
            return null;
        } //TODO properder maken
    }

    public async Task<LeaveTableResponse> LeaveTable(LeaveTableRequest request)
    {
        try
        {
            var response = await sessionService.LeaveTableAsync(request);
            await Clients.Group(request.RoomCode).SendAsync("PlayerLeft", response);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, request.RoomCode);
            connections.TryRemove(Context.ConnectionId, out var value);
            return response;
        }
        catch (Exception e)
        {
            await Clients.Caller.SendAsync("LeaveFailed", e.Message);
            return null;
        } //TODO clean this
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (connections.TryGetValue(Context.ConnectionId, out var roomInfo))
        {
            await Clients.Group(roomInfo.RoomCode)
                .SendAsync("PlayerDisconnected", new { PlayerId = roomInfo.PlayerId });
            connections.TryRemove(Context.ConnectionId, out var value);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task ReconnectPlayer(string playerId, string roomCode)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);
        connections[Context.ConnectionId] = (playerId, roomCode);

        await Clients.Group(roomCode).SendAsync("PlayerReconnected", new { PlayerId = playerId });
    }

    public async Task UpdatePlayerPhase(string roomCode, string playerId, string newPhase)
    {
        try
        {
            if (!Guid.TryParse(playerId, out var playerGuid)) return;
            await sessionService.UpdatePlayerPhaseAsync(roomCode, playerGuid, newPhase);

            await Clients.Group(roomCode).SendAsync("PlayerPhaseUpdated", new
            {
                PlayerId = playerId,
                NewPhase = newPhase
            });
        }
        catch (Exception e)
        {
            throw new HubException($"Couldn't update phase: {e.Message}");
        }
    }
}
