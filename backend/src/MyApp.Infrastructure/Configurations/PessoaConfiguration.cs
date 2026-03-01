using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Configurations;

public class PessoaConfiguration : IEntityTypeConfiguration<Pessoa>
{
    public void Configure(EntityTypeBuilder<Pessoa> builder)
    {
        builder.ToTable("Pessoas");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nome).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Email).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Cpf).IsRequired().HasMaxLength(11);
        builder.Property(p => p.StatusId).IsRequired();
        builder.Property(p => p.DataDesativacao);
        builder.Property(p => p.DataCadastro).IsRequired();
        builder.Property(p => p.DataAtualizacao);

        builder.HasOne(p => p.Status)
            .WithMany(s => s.Pessoas)
            .HasForeignKey(p => p.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Telefones)
            .WithOne(t => t.Pessoa)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Enderecos)
            .WithOne(e => e.Pessoa)
            .HasForeignKey(e => e.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
