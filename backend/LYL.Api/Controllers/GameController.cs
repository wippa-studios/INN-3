using LYL.Api.Contracts.EventCards;
using LYL.Api.Contracts.FirstWorkPhase;
using LYL.Api.Contracts.Game;
using LYL.Api.Contracts.SecondWorkPhase;
using LYL.Api.Contracts.StudentPhase;
using LYL.Api.Hubs;
using LYL.Domain.Model;
using LYL.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace LYL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController(IGameSessionService gameSessionService, IHubContext<GameHub> hubContext, IInvestmentReturnsService investmentReturnsService) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult<CreateRoomResponse>> CreateRoom([FromBody] CreateRoomRequest request)
    {
        var response = await gameSessionService.CreateRoomAsync(request);
        return Ok(response);
    }

    [HttpPost("{roomCode}/start")]
    public async Task<IActionResult> StartGame(string roomCode)
    {
        await gameSessionService.SetRoomActiveAsync(roomCode, true);

        await hubContext.Clients.Group(roomCode).SendAsync("GameStarted", "character-discovery");

        return Ok(new { message = "Het spel is succesvol gestart!" });
    }

    [HttpGet("{roomCode}")]
    public async Task<ActionResult<RoomStateResponse>> GetRoomState(string roomCode)
    {
        var roomState = await gameSessionService.GetRoomStateAsync(roomCode);

        if (roomState == null)
        {
            return NotFound(new { message = "Room does not exist." });
        }

        return Ok(roomState);
    }

    [HttpGet("{roomCode}/player/{playerId}/character")]
    public async Task<IActionResult> GetPlayerCharacter(string roomCode, string playerId)
    {
        var character = await gameSessionService.GetPlayerCharacterAsync(roomCode, playerId);

        if (character == null)
        {
            return NotFound(new { message = "Room or player not found." });
        }

        return Ok(character);
    }

    [HttpPost("{roomId}/player/{playerId}/student-phase")]
    public async Task<IActionResult> CompleteStudentPhase(string roomId, string playerId,
        [FromBody] CompleteStudentPhaseRequest dto)
    {
        if (!Guid.TryParse(playerId, out var playerGuid))
        {
            return BadRequest(new { message = "Ongeldig speler ID." });
        }

        var updatedPhase = await gameSessionService.CompleteStudentPhaseAsync(roomId, playerGuid, dto);

        await hubContext.Clients.Group(roomId).SendAsync("PlayerPhaseUpdated", new
        {
            PlayerId = playerId,
            NewPhase = updatedPhase
        });

        return Ok();
    }

    [HttpPost("{roomId}/player/{playerId}/first-work-phase")]
    public async Task<IActionResult> CompleteFirstWorkPhase(string roomId, string playerId)
    {
        if (!Guid.TryParse(playerId, out var playerGuid))
            return BadRequest(new { message = "Ongeldig speler ID." });

        var updatedPhase = await gameSessionService.CompleteFirstWorkPhaseAsync(roomId, playerGuid);

        await hubContext.Clients.Group(roomId).SendAsync("PlayerPhaseUpdated", new
        {
            PlayerId = playerId,
            NewPhase = updatedPhase
        });

        return Ok();
    }

    [HttpPost("{roomId}/player/{playerId}/check-dossier-total")]
    public async Task<ActionResult<bool>> CheckPhaseInputs(string roomId, string playerId,
        [FromBody] DossierCheckRequest request)
    {
        
        if (!Guid.TryParse(playerId, out var playerGuid))
            return BadRequest(new { message = "Ongeldig speler ID." });

        try
        {
            bool isCorrect = await gameSessionService.CheckPhaseInputsCalcsAsync(roomId, playerGuid, request);
            return Ok(isCorrect);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }

    }

    [HttpGet("{roomCode}/player/{playerId}/investments")]
    public async Task<ActionResult<InvestmentTableResponse>> GetInvestmentTable(string roomCode, string playerId)
    {
        if (!Guid.TryParse(playerId, out var playerGuid))
            return BadRequest(new { message = "Ongeldig speler ID." });

        var character = await gameSessionService.GetPlayerCharacterAsync(roomCode, playerGuid.ToString());
        if (character == null)
            return NotFound(new { message = "Room or player not found." });

        var table = investmentReturnsService.GetTableFor(InvestmentProfile.Neutral);
        return Ok(table);
    }

    [HttpDelete("{roomCode}")]
    public async Task<IActionResult> CloseRoom(string roomCode)
    {
        await gameSessionService.CloseRoomAsync(roomCode);
        await hubContext.Clients.Group(roomCode).SendAsync("RoomClosed");
        return NoContent();
    }

    [HttpPost("{roomId}/player/{playerId}/check-dossier-monthly")]
    public async Task<ActionResult<bool>> CheckBalanceMonthInputs(string roomId, string playerId,
        [FromBody] DossierCheckRequest request)
    {
        
         if (!Guid.TryParse(playerId, out var playerGuid))
             return BadRequest(new { message = "Ongeldig speler ID." });

         try
         {
             bool isCorrect = await gameSessionService.CheckPhaseInputsMonthlyAsync(roomId, playerGuid, request);
             return Ok(isCorrect);
         }
         catch (Exception ex)
         {
             return BadRequest(new { message = ex.Message });
         }
        
    }
    
    [HttpPost("{roomId}/player/{playerId}/saveEventCardsChoices")]
    public async Task<ActionResult> SaveEventCardsInput(string roomId, string playerId, [FromBody]EventCardSaveRequestContract request) 
    {
       if (!Guid.TryParse(playerId, out var playerGuid))
            return BadRequest(new { message = "Ongeldig speler ID." });
       
            try
            {
                await gameSessionService.SaveEventCardsInput(roomId, playerId, request); 
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        

    }

    [HttpGet("{roomId}/player/{playerId}/getEventCards")]
    public async Task<IActionResult> GetEventCards(string roomId, string playerId)
    {
       if (!Guid.TryParse(playerId, out var playerGuid))
           return BadRequest(new { message = "Ongeldig speler ID." });
       
        try
        {
            var cards = await gameSessionService.GetEventCards();
            return Ok(cards);
        }
        catch (Exception e)
        {
           Console.WriteLine(e.Message);
           return StatusCode(500, new { message = e.Message });
        }
     
        
    }

    
    
    
}