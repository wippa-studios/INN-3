using LYL.Api.Contracts.EventCards;
using LYL.Api.Contracts.FirstWorkPhase;
using LYL.Api.Contracts.Game;
using LYL.Api.Contracts.StudentPhase;
using LYL.Domain.Model;
using LYL.Domain.Model.JsonModel.Event;


namespace LYL.Domain.Services.Interfaces;

public interface IGameSessionService
{
    Task<CreateRoomResponse> CreateRoomAsync(CreateRoomRequest request);
    Task<JoinTableResponse> JoinTableAsync(JoinTableRequest request);
    Task<LeaveTableResponse> LeaveTableAsync(LeaveTableRequest request);
    Task SetRoomActiveAsync(string roomCode, bool isActive);
    Task UpdatePlayerPhaseAsync(string roomCode, Guid playerId, string newPhase);

    Task<RoomStateResponse?> GetRoomStateAsync(string roomCode);

    //TODO Don't return model here! This was quick and dirty testing!
    Task<Character?> GetPlayerCharacterAsync(string roomCode, string playerId);
    Task<string> CompleteStudentPhaseAsync(string roomCode, Guid playerId, CompleteStudentPhaseRequest request);
    Task<string> CompleteFirstWorkPhaseAsync(string roomCode, Guid playerId);
    Task<bool> CheckPhaseInputsMonthlyAsync(string roomCode, Guid playerId, DossierCheckRequest request); //TODO aanpassen naa request
    Task<bool> CheckPhaseInputsCalcsAsync(string roomCode, Guid playerId, DossierCheckRequest request);
    Task CloseRoomAsync(string roomCode);
    Task<Dictionary<int, List<EventCard>>> GetEventCards();
    Task SaveEventCardsInput(string roomId, string playerId, EventCardSaveRequestContract request);
}