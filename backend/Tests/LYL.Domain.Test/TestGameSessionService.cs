using LYL.Api.Contracts.FirstWorkPhase;
using LYL.Domain.Model;
using LYL.Domain.Model.Dossiers;
using LYL.Domain.Model.Interfaces;
using LYL.Domain.Model.States;
using LYL.Domain.Services;
using LYL.Domain.Services.Interfaces;
using LYL.Persistence;
using LYL.Persistence.Interfaces;
using Moq;

namespace LYL.Domain.Test;



public class TestGameSessionService
{
   /* 

    private static decimal RemainingBudget = 905m;
    private static DossierCheckRequest data = new ()
    {
        
        NetSalary = request.NetSalaryPhase1,
        HousingCost = request.MonthlyRentPhase1,
        OtherLivingCost = request.LivingCostsPhase1,
        TransportPurchaseCost = request.PurchaseMonthlyPhase1,
        TransportMonthlyCost = request.MonthlyCostPhase1,
        TransportInsuranceCost = request.CarInsurancePhase1,
        FireInsuranceCost = request.FireInsurancePhase1,
        FamilyInsuranceCost = request.FamilyInsurancePhase1,
        HospitalisationInsuranceCost = request.HospitalInsurancePhase1,
        AccidentInsuranceCost = request.AccidentInsurancePhase1
    };
    
   
    private Guid playerId = Guid.NewGuid();
    private string roomCode = "450090";
    
   [Fact]
public async Task Test_method_CheckPhaseInputsAsync_valid() //TODO testen eens decimal/int situation in orde staan!
{
   // data.CalcRemainingBudget = RemainingBudget; 
    
    var roomRepoMock = new Mock<IGameRoomRepository>();
    var supervisorRepoMock = new Mock<ISupervisorRepository>();
    var jsonSerializerMock = new Mock<IJsonSerializerService>();
    var memoryRepoMock = new Mock<IMemoryAccessService>();
    
    //TODO checken of methods al decimals teruggeven en ontvangen
    memoryRepoMock.Setup(m => m.GetHouseId(450m)).Returns("house_1"); // Geef een geldige id terug
    memoryRepoMock.Setup(m => m.CheckLivingExpense(750m, "house_1")).Returns(true);
    memoryRepoMock.Setup(m => m.GetMonthlyCarCost(150m)).Returns((150m, false));
    memoryRepoMock.Setup(m => m.CheckTransportInsurance(25m, false)).Returns(true);
    memoryRepoMock.Setup(m => m.CheckFireInsuranceCost(10m, "house_1")).Returns(true);
    memoryRepoMock.Setup(m => m.GetHospitalisationInsurance()).Returns((10m,5m));
    

   
    var character = new Character();
    character.ChosenJob = new Job { StartNet = 2450 };

    var supervisor = new Supervisor(); 
    var room = new GameRoom(supervisor, roomCode);
    var table = room.Tables[0]; 
    
    var player = new Player()
    {
        PlayerId = playerId,
        Nickname = "TestPlayer",
        Table = table,
        CurrentPhase = "first-work-phase",
        DossierState = new FirstWorkphaseState(new Dossier(character), memoryRepoMock.Object)
    };

    table.TryAddPlayer(player);
    
    roomRepoMock
        .Setup(repo => repo.GetByRoomCodeAsync(roomCode))
        .ReturnsAsync(room);
    
    var gameSessionService = new GameSessionService(
        roomRepoMock.Object, 
        supervisorRepoMock.Object, 
        jsonSerializerMock.Object
    );
    
    var result = await gameSessionService.CheckPhaseInputsMonthlyAsync(roomCode, playerId, data);
    
    Assert.True(result); */
    
    
}
