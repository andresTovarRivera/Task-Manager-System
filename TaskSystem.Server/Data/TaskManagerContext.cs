using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TaskSystem.Server.Data.Interfaces;
using TaskSystem.Server.Models;

namespace TaskSystem.Server.Data;

public class TaskManagerContext(DbContextOptions options) : DbContext(options), ITaskManagerContext
{    
    public DbSet<TaskData> Tasks { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}

