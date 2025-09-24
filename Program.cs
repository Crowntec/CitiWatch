using System.Text;
using CitiWatch.Application.Commands;
using CitiWatch.Application.Helper;
using CitiWatch.Application.Interfaces;
using CitiWatch.Application.Services;
using CitiWatch.Infrastructure.Config;
using CitiWatch.Infrastructure.Context;
using CitiWatch.Infrastructure.Services;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// Check for CLI commands first
var parser = new CommandLineParser(args);
if (parser.IsCliCommand())
{
    await HandleCliCommand(parser);
    return;
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IComplaintService, ComplaintService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<ValidatorHelper>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<CloudinaryService>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

builder.Services.Configure<CloudinaryConfig>(
    builder.Configuration.GetSection("Cloudinary"));

builder.Services.AddSingleton(sp =>
{
    var config = builder.Configuration.GetSection("Cloudinary").Get<CloudinaryConfig>();
    return new Cloudinary(new Account(config.CloudName, config.ApiKey, config.ApiSecret));
});

builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Name = "Authorization",
            Description = "Bearer Authentication with JWT Token",
            Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                }
            },
            new List < string > ()
        }
    });
});

builder.Services.AddAuthentication(opt => {
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    var jwtKey = builder.Configuration["JwtSettings:Key"];
    var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
    var jwtAudience = builder.Configuration["JwtSettings:Audience"];

    options.TokenValidationParameters = new TokenValidationParameters {
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey 
                ?? throw new InvalidOperationException("JWT Key not found in configuration or environment variables"))),

    };
});
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// CLI Command Handler
static async Task HandleCliCommand(CommandLineParser parser)
{
    try
    {
        // Build a minimal service provider for CLI operations
        var services = new ServiceCollection();
        
        // Add configuration
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();
        
        services.AddSingleton<IConfiguration>(configuration);
        
        // Add DbContext
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationContext>(options =>
            options.UseSqlServer(connectionString));
        
        // Add AdminCommands
        services.AddScoped<AdminCommands>();
        
        var serviceProvider = services.BuildServiceProvider();
        
        using var scope = serviceProvider.CreateScope();
        var adminCommands = scope.ServiceProvider.GetRequiredService<AdminCommands>();
        
        var command = parser.GetCommand();
        var success = false;
        
        switch (command)
        {
            case "create-admin":
                parser.ValidateCreateAdminArguments();
                var email = parser.GetArgumentValue("email")!;
                var password = parser.GetArgumentValue("password")!;
                var name = parser.GetArgumentValue("name");
                success = await adminCommands.CreateAdminAsync(email, password, name);
                break;
                
            case "list-admins":
                success = await adminCommands.ListAdminsAsync();
                break;
                
            case "help":
                AdminCommands.ShowHelp();
                success = true;
                break;
                
            default:
                Console.WriteLine("❌ Unknown command. Use --help for available commands.");
                AdminCommands.ShowHelp();
                break;
        }
        
        Environment.Exit(success ? 0 : 1);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ CLI Error: {ex.Message}");
        Environment.Exit(1);
    }
}