using LYL.Api.Contracts.Supervisor;
using Microsoft.AspNetCore.Mvc;

namespace LYL.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupervisorController(IConfiguration configuration) : ControllerBase
{
    [HttpPost("verify-pin")]
    public IActionResult VerifyPin([FromBody] VerifyPinRequest request)
    {
        var configuredPin = configuration["Supervisor:Pin"];

        if (string.IsNullOrEmpty(configuredPin))
        {
            return StatusCode(500, new { message = "Supervisor PIN is not configured." });
        }

        if (string.Equals(request.Pin, configuredPin, StringComparison.Ordinal))
        {
            return Ok();
        }

        return Unauthorized();
    }
}
