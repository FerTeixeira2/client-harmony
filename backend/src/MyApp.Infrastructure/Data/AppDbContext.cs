using Microsoft.EntityFrameworkCore;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<StatusPessoa> StatusPessoas => Set<StatusPessoa>();
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Telefone> Telefones => Set<Telefone>();
    public DbSet<Endereco> Enderecos => Set<Endereco>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.Entity<Pessoa>()
            .ToTable(tb =>
            {
                tb.HasTrigger("TR_Pessoas_Update");
                tb.HasTrigger("TR_Pessoas_Auditoria");
            });
    }
}
