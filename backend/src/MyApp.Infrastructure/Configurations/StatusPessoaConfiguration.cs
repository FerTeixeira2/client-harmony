using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Configurations;

public class StatusPessoaConfiguration : IEntityTypeConfiguration<StatusPessoa>
{
    public void Configure(EntityTypeBuilder<StatusPessoa> builder)
    {
        builder.ToTable("StatusPessoa");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Nome).IsRequired().HasMaxLength(50);
    }
}
