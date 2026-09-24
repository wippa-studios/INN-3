using LYL.Api.Hubs;
using LYL.Domain.Model;
using LYL.Domain.Model.Interfaces;
using LYL.Domain.Services;
using LYL.Domain.Services.Interfaces;
using LYL.Persistence;
using LYL.Persistence.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//Real time web functionality
builder.Services.AddSignalR(options => { options.EnableDetailedErrors = true; });

// CORS config, 
var allowedOrigins = builder.Configuration
    .GetValue<string>("Cors:AllowedOrigins")
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<IGameSessionService, GameSessionService>();

//TODO: These are added as singletons as long as we are using in memory, this should normally just be addscoped
builder.Services.AddSingleton<IGameRoomRepository, GameRoomRepository>();
builder.Services.AddSingleton<ISupervisorRepository, SupervisorRepository>();
var pgConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=liveyourlife;Username=liveyourlife;Password=liveyourlife";
builder.Services.AddSingleton<IJsonReaderRepository>(_ => new JsonReaderRepository(pgConnectionString));
builder.Services.AddSingleton<IJsonSerializerService, JsonSerializerService>();
builder.Services.AddSingleton<IInMemoryDataRepository, InMemoryDataRepository>();
builder.Services.AddSingleton<IMemoryAccessService, InMemoryAccessService>();

//twee interfaces in 1 klasse
builder.Services.AddSingleton<InvestmentReturnsService>();
builder.Services.AddSingleton<IInvestmentReturnsService>(x => x.GetRequiredService<InvestmentReturnsService>());
builder.Services.AddSingleton<IInvestmentCalculator>(x => x.GetRequiredService<InvestmentReturnsService>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}




//app.UseHttpsRedirection();

app.UseRouting();

// Activate CORS policy
app.UseCors("ReactApp");

app.UseAuthorization();

app.MapControllers();

// Make endpoint for gamehub
app.MapHub<GameHub>("/gamehub");

app.Run();
