using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Configurations;

public class TelefoneConfiguration : IEntityTypeConfiguration<Telefone>
{
    public void Configure(EntityTypeBuilder<Telefone> builder)
    {
        builder.ToTable("Telefones");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Numero).IsRequired().HasMaxLength(20);
        builder.Property(t => t.Tipo).IsRequired().HasMaxLength(30);
        builder.Property(t => t.Ativo).IsRequired();
        builder.Property(t => t.PessoaId).IsRequired();
    }
}
