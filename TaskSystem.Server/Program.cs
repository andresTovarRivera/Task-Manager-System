using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TaskSystem.Server.BusinessLayer;
using TaskSystem.Server.BusinessLayer.Interfaces;
using TaskSystem.Server.Data;
using TaskSystem.Server.Data.Interfaces;
using TaskSystem.Server.Middleware;
using TaskSystem.Server.Models;
using TaskSystem.Server.Models.Authenticate;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Version = "v1",
        Title = "TaskManager",
        Description = ""
    });
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT Token with bearer format (bearer yourToken)"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
                }
            },
            new string[]{ }
        }
    });
});

builder.Services.AddTransient<ITaskManagerBL, TaskManagerBL>();
builder.Services.AddTransient<IUserBL, UserBL>();
builder.Services.AddTransient<IValidateDataBL, ValidateDataBL>();

builder.Services.AddDbContext<ITaskManagerContext, TaskManagerContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ITaskManagerContext>();
    context.Database.Migrate();

    if (!context.Users.Any())
    {
        context.Users.AddRange(
            new User { Name = "admin", Email = "admin@task.com", Password = "123" },
            new User { Name = "admin2", Email = "admin2@task.com", Password = "456" },
            new User { Name = "admin3", Email = "admin3@task.com", Password = "789" }
            );

        await context.SaveChangesAsync();
    }

    if (!context.Tasks.Any())
    {
        context.Tasks.AddRange(
            new TaskData { Title = "Demo task", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = false, Priority = PriorityLevel.Low, UserId = 1 },
            new TaskData { Title = "Demo task 2", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = true, Priority = PriorityLevel.None, UserId = 1 },
            new TaskData { Title = "Demo task 3", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = false, Priority = PriorityLevel.High, UserId = 1 },
            new TaskData { Title = "Demo task 4", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = true, Priority = PriorityLevel.Medium, UserId = 1 },
            new TaskData { Title = "Demo task", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = false, Priority = PriorityLevel.High, UserId = 2 },
            new TaskData { Title = "Demo task 2", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = false, Priority = PriorityLevel.Low, UserId = 2 },
            new TaskData { Title = "Demo task", Description = "This is a demo task", Date = DateTime.Now, IsCompleted = false, Priority = PriorityLevel.Low, UserId = 3 }
            );

        await context.SaveChangesAsync();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

app.UseAuthorization();

app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
