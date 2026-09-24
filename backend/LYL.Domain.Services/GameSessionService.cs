using System.Diagnostics.CodeAnalysis;
using LYL.Api.Contracts.EventCards;
using LYL.Api.Contracts.FirstWorkPhase;
using LYL.Api.Contracts.Game;
using LYL.Api.Contracts.StudentPhase;
using LYL.Domain.Model;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.Interfaces;
using LYL.Domain.Model.JsonModel.Event;
using LYL.Domain.Model.States;
using LYL.Domain.Services.Interfaces;
using LYL.Domain.Services.Mapping;
using LYL.Persistence.Interfaces;

namespace LYL.Domain.Services;

public class GameSessionService : IGameSessionService
{
    private readonly IGameRoomRepository roomRepo;
    private readonly ISupervisorRepository supervisorRepo;
    private readonly IJsonSerializerService jsonSerializer;
    private readonly IMemoryAccessService memoryAccessService;
    private readonly IInvestmentCalculator investmentCalculator;

    public GameSessionService(IGameRoomRepository roomRepo, ISupervisorRepository supervisorRepo,
        IJsonSerializerService jsonSerializer, IMemoryAccessService memoryService, IInvestmentCalculator investmentCalculator)
    {
        this.roomRepo = roomRepo;
        this.supervisorRepo = supervisorRepo;
        this.jsonSerializer = jsonSerializer;
        this.memoryAccessService = memoryService;
        this.investmentCalculator =  investmentCalculator;
    }

    public async Task<CreateRoomResponse> CreateRoomAsync(CreateRoomRequest request)
    {
        var supervisor = await supervisorRepo.GetByIdAsync(request.SupervisorId);
        //TODO: Handle this cleaner
        if (supervisor == null)
        {
            throw new ArgumentException("Docent niet gevonden.");
        }

        var room = new GameRoom(supervisor, GenerateRoomCode());

        await roomRepo.AddAsync(room);
        
        //if everything succeeds read json files backend 
        jsonSerializer.SerializeAllJsonFiles();
        
        return new CreateRoomResponse
        {
            RoomCode = room.RoomCode
        };
    }

    public async Task<JoinTableResponse> JoinTableAsync(JoinTableRequest request)
    {
        var room = await roomRepo.GetByRoomCodeAsync(request.RoomCode);
        if (room == null) throw new ArgumentException("Room does not exist.");

        var table = room.Tables.FirstOrDefault(t => t.TableNumber == request.TableNumber);
        if (table == null) throw new ArgumentException("Table does not exist.");

        var existingPlayer = table.Players.FirstOrDefault(p => p.Nickname == request.NickName);

        Player activePlayer;

        if (existingPlayer != null)
        {
            activePlayer = existingPlayer;
        }
        else
        {
            activePlayer = new Player
            {
                PlayerId = Guid.NewGuid(),
                Nickname = request.NickName,
                CurrentPhase = room.IsActive ? "student-phase" : "waiting"
            };

            if (!table.TryAddPlayer(activePlayer))
            {
                throw new InvalidOperationException("This table is full.");
            }
        }

        var response = new JoinTableResponse
        {
            NickName = request.NickName,
            TableNumber = request.TableNumber,
            PlayerId = activePlayer.PlayerId,
            IsGameAlreadyStarted = room.IsActive,
            CurrentPhase = activePlayer.CurrentPhase
        };

        await roomRepo.UpdateAsync(room);

        return response;
    }

    public async Task<LeaveTableResponse> LeaveTableAsync(LeaveTableRequest request)
    {
        var room = await roomRepo.GetByRoomCodeAsync(request.RoomCode);
        if (room == null) throw new ArgumentException("Room does not exist.");

        var table = room.Tables.FirstOrDefault(t => t.Players.Any(p => p.PlayerId == request.PlayerId));
        if (table == null) throw new ArgumentException("Table does not exist.");

        //If players are not inside the DB we can use linq to find them?
        var playerToRemove = table.Players.FirstOrDefault(p => p.PlayerId == request.PlayerId);
        if (playerToRemove == null)
        {
            throw new ArgumentException("Player zit niet aan deze tafel.");
        }

        table.RemovePlayer(playerToRemove);

        await roomRepo.UpdateAsync(room);

        var response = new LeaveTableResponse
        {
            TableNumber = request.TableNumber,
            PlayerId = playerToRemove.PlayerId
        };
        return response;
    }

    public async Task SetRoomActiveAsync(string roomCode, bool isActive)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        room.IsActive = isActive;

        if (isActive)
        {
            //TODO hier alle characters opvragen en aan table toewijzen (binnen de foreach toewijzen en buiten opvragen!!!!)
            List<Character> characters = jsonSerializer.getCharacters();
            List<Partner> partners = jsonSerializer.GetPartners();
            foreach (var table in room.Tables)
            {
                table.Characters = characters;
                table.AssignCharactersToPlayers(partners);
                foreach (var player in table.Players)
                {
                    player.CurrentPhase = "character-discovery";
                }
            }
        }

        await roomRepo.UpdateAsync(room);
    }

    public async Task UpdatePlayerPhaseAsync(string roomCode, Guid playerId, string newPhase)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId == playerId);

        if (player == null) throw new ArgumentException("Player not found");

        player.CurrentPhase = newPhase;
        await roomRepo.UpdateAsync(room);
    }

    //TODO Use mapping? 
    public async Task<RoomStateResponse?> GetRoomStateAsync(string roomCode)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);

        if (room == null) return null;

        var response = new RoomStateResponse
        {
            RoomCode = room.RoomCode,
            IsActive = room.IsActive,
            Players = new List<PlayerStateDto>()
        };

        foreach (var table in room.Tables)
        {
            foreach (var player in table.Players)
            {
                response.Players.Add(new PlayerStateDto
                {
                    PlayerId = player.PlayerId.ToString(),
                    NickName = player.Nickname,
                    TableNumber = table.TableNumber,
                    IsOffline = false,
                    CurrentPhase = player.CurrentPhase
                });
            }
        }

        return response;
    }

    public async Task CloseRoomAsync(string roomCode)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");
        await roomRepo.RemoveAsync(roomCode);
    }

    public async Task<Dictionary<int, List<EventCard>>> GetEventCards()
    {
        // Haal alle kaarten op (zorg dat de Id property in deze lijst goed gevuld is vanuit de JSON keys!)
        List<EventCard> eventCards = memoryAccessService.GetAllEventCards();

        Dictionary<int, List<string>> packages = new()
        {
            { 1, ["divorce", "promotion", "car_accident_parked"] },
            //{ 2, ["inheritance", "house_on_fire", "dismissal"] },
            //{ 3, ["financial_support", "car_accident_hail", "storm_damage_trampoline"] }, //TODO hail vervangen met illness work
            { 4, ["new_job", "depression", "leaking_roof"] },
           // { 5, ["holiday", "hospital_treatment", "car_accident_hail"] },
           // { 6, ["second_car", "housing_costs_1", "storm_damage_roof"] },
            { 7, ["car_accident_traffic_jam", "illness_dice", "housing_costs_2"] }
        };

        Dictionary<int, List<EventCard>> packagesInGroupsToReturn = new();
        var randomKeys = packages.Keys.OrderBy(x => Guid.NewGuid()).Take(3).ToList();

        foreach (var key in randomKeys)
        {
            var selectedPackageStrings = packages[key];
            var cardsForPackage = new List<EventCard>();

            foreach (var stringId in selectedPackageStrings)
            {
                
                var card = eventCards.FirstOrDefault(x => x.Id == stringId);
            
                if (card != null)
                {
                    cardsForPackage.Add(card);
                }
            }

            packagesInGroupsToReturn.Add(key, cardsForPackage);
        }

        return packagesInGroupsToReturn;
    }

    public async Task SaveEventCardsInput(string roomId, string playerGuid, EventCardSaveRequestContract request)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomId);
        if (room == null) throw new Exception("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId.ToString() == playerGuid);
        if (player == null) throw new Exception("Player not found");

        try
        {
            var choosenEventsAsModel = request.AsModel();
            player.Dossier.ChoosenEventCards = choosenEventsAsModel; 
            await roomRepo.UpdateAsync(room);
           
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }

    //Helper, we can extract this into a utils folder and inject via interface
    private string GenerateRoomCode()
    {
        return new Random().Next(100000, 999999).ToString();
    }

    //TODO Look at interface!!
    public async Task<Character?> GetPlayerCharacterAsync(string roomCode, string playerId)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) return null;

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId.ToString() == playerId);

        if (player?.Character == null) return null;

        if (player.Character.ChosenJob == null)
        {
            player.Character.AssignRandomJob();

            await roomRepo.UpdateAsync(room);
        }

        return player.Character;
    }

    public async Task<string> CompleteStudentPhaseAsync(string roomCode, Guid playerId,
        CompleteStudentPhaseRequest request)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId == playerId);

        if (player?.Character?.StudentPhase == null)
            throw new ArgumentException("Player or Character Data not found");

        int newlyAddedPoints = 0;
        foreach (var selection in request.Selections)
        {
            var existingOption = player.Character.StudentPhase.Options.FirstOrDefault(o => o.Id == selection.Key);
            if (existingOption != null)
            {
                newlyAddedPoints += (selection.Value - existingOption.FilledSlots);
            }
        }

        if (newlyAddedPoints > player.Character.AllocatablePoints)
        {
            throw new ArgumentException("Je hebt te veel punten proberen te verdelen!");
        }

        foreach (var selection in request.Selections)
        {
            var optionToUpdate = player.Character.StudentPhase.Options.FirstOrDefault(o => o.Id == selection.Key);

            if (optionToUpdate != null)
            {
                if (selection.Value > optionToUpdate.MaxSlots)
                {
                    throw new ArgumentException($"Cheat gedetecteerd: Te veel slots voor {optionToUpdate.TitleKey}");
                }

                optionToUpdate.FilledSlots = selection.Value;
            }
        }

        player.CurrentPhase = "first-work-phase";
        await roomRepo.UpdateAsync(room);

        return player.CurrentPhase;
    }

    public async Task<string> CompleteFirstWorkPhaseAsync(string roomCode, Guid playerId)
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId == playerId);

        if (player == null) throw new ArgumentException("Player not found");

        player.CurrentPhase = "second-work-phase";
        await roomRepo.UpdateAsync(room);

        return player.CurrentPhase;
    }
    

    public async Task<bool> CheckPhaseInputsMonthlyAsync(string roomCode, Guid playerId, DossierCheckRequest request) 
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId == playerId);
        if (player == null) throw new ArgumentException("Player not found");
        
        //setting workphasestate?
        if (player.DossierState is not SecondWorkphaseState) player.DossierState = new FirstWorkphaseState(player.Dossier, memoryAccessService);
        var dossierData = new DossierData();
        if (player.DossierState is FirstWorkphaseState)  dossierData = request.AsModelPhase1();
        if (player.DossierState is SecondWorkphaseState) dossierData = request.AsModelPhase2();
        
        return player.CheckMontlhy(dossierData);
        
    }
    
    public async Task<bool> CheckPhaseInputsCalcsAsync(string roomCode, Guid playerId, DossierCheckRequest request) 
    {
        var room = await roomRepo.GetByRoomCodeAsync(roomCode);
        if (room == null) throw new ArgumentException("Room not found");

        var player = room.Tables
            .SelectMany(t => t.Players)
            .FirstOrDefault(p => p.PlayerId == playerId);
        if (player == null) throw new ArgumentException("Player not found");

        var dossierData = new DossierData();
        if (player.DossierState is FirstWorkphaseState)  dossierData = request.AsModelPhase1();
        if (player.DossierState is SecondWorkphaseState) dossierData = request.AsModelPhase2();
        
        //setting workphasestate?
        if (player.DossierState is not SecondWorkphaseState) player.DossierState = new FirstWorkphaseState(player.Dossier, memoryAccessService);
        //TODO: just a quick way to go to nextphase rn
        var result = player.CheckCalculations(dossierData, investmentCalculator);
        if (result && player.DossierState is FirstWorkphaseState) player.DossierState.NextPhase(player);
        return result;
        
    }
}