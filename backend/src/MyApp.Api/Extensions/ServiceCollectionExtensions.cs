using FluentValidation;
using Microsoft.EntityFrameworkCore;
using MyApp.Application.Interfaces;
using MyApp.Application.Services;
using MyApp.Application.Validators;
using MyApp.Domain.Interfaces;
using MyApp.Infrastructure.Data;
using MyApp.Infrastructure.Repositories;

namespace MyApp.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPessoaService, PessoaService>();
        services.AddScoped<IPessoaRepository, PessoaRepository>();
        services.AddScoped<IAgendaRepository, AgendaRepository>();
        services.AddValidatorsFromAssemblyContaining<CreatePessoaValidator>();
        services.AddScoped<IAgendaService, AgendaService>();
        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration, IHostEnvironment? hostEnvironment = null)
    {
        var isTesting = hostEnvironment?.IsEnvironment("Testing") ?? false;
        var useInMemory = configuration.GetValue<bool>("UseInMemoryDatabase");

        if (isTesting || useInMemory)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("InMemoryTestDb"));
        }
        else
        {
            var connectionString = configuration.GetConnectionString("SqlAuthConnection")
                ?? configuration.GetConnectionString("DefaultConnection")
                ?? "Server=(localdb)\\mssqllocaldb;Database=MyAppDb;Trusted_Connection=true;";
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));
        }
        return services;
    }
}
