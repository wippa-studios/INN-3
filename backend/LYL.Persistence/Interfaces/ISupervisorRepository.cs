using System;
using LYL.Domain.Model;

namespace LYL.Persistence.Interfaces;

public interface ISupervisorRepository
{
    Task<Supervisor?> GetByIdAsync(Guid supervisorId);
}
