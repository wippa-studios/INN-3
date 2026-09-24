using System;
using LYL.Domain.Model;
using LYL.Persistence.Interfaces;

namespace LYL.Persistence;

public class SupervisorRepository : ISupervisorRepository
{
    public Task<Supervisor?> GetByIdAsync(Guid supervisorId)
    {
        // Add one in memory fake supervisor for test operations
        var dummySupervisor = new Supervisor
        {
            SupervisorId = supervisorId,
            Email = "docent@mail.com"
        };

        return Task.FromResult<Supervisor?>(dummySupervisor);
    }
}
