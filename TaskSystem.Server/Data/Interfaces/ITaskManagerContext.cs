using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TaskSystem.Server.Models;

namespace TaskSystem.Server.Data.Interfaces;

public interface ITaskManagerContext
{
    DbSet<TaskData> Tasks { get; set; }
    DbSet<User> Users { get; set; }

    DatabaseFacade Database { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
