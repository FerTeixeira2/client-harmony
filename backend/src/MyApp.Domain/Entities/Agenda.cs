using System;

namespace MyApp.Domain.Entities
{
    public class Agenda
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // FK para pessoa
        public Guid PessoaId { get; set; }

        public string Titulo { get; set; } = null!;
        public string? Descricao { get; set; }
        public DateTime DataAgenda { get; set; }
        public TimeSpan HorarioInicio { get; set; }
        public TimeSpan HorarioFim { get; set; }

        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
        public DateTime? DataAtualizacao { get; set; }

        // Navegação (opcional)
        public Pessoa? Pessoa { get; set; }
    }
}