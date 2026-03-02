using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApp.Domain.Entities;

namespace MyApp.Infrastructure.Configurations;

public class AgendaConfiguration : IEntityTypeConfiguration<Agenda>
{
    public void Configure(EntityTypeBuilder<Agenda> builder)
    {
        builder.ToTable("Agenda");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Titulo)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(a => a.Descricao)
            .HasMaxLength(500);

        builder.Property(a => a.DataAgenda)
            .IsRequired();

        builder.Property(a => a.HorarioInicio)
            .IsRequired()
            .HasColumnType("time");

        builder.Property(a => a.HorarioFim)
            .IsRequired()
            .HasColumnType("time");

        builder.Property(a => a.DataCadastro)
            .IsRequired();

        builder.Property(a => a.DataAtualizacao);

        builder.HasOne(a => a.Pessoa)
            .WithMany()
            .HasForeignKey(a => a.PessoaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

