using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Configurations;

public class EnderecoConfiguration : IEntityTypeConfiguration<Endereco>
{
    public void Configure(EntityTypeBuilder<Endereco> builder)
    {
        builder.ToTable("Enderecos");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Rua).IsRequired().HasMaxLength(150);
        builder.Property(e => e.Numero).IsRequired().HasMaxLength(20);
        builder.Property(e => e.Complemento).HasMaxLength(100);
        builder.Property(e => e.Bairro).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Cidade).IsRequired().HasMaxLength(100);
        builder.Property(e => e.Estado).IsRequired().HasMaxLength(2);
        builder.Property(e => e.Cep).IsRequired().HasMaxLength(8);
        builder.Property(e => e.TipoEndereco).IsRequired().HasMaxLength(30);
        builder.Property(e => e.Ativo).IsRequired();
        builder.Property(e => e.PessoaId).IsRequired();
    }
}
