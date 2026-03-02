using System;

namespace MyApp.Application.Dtos
{
    public class AgendaDto
    {
        public Guid Id { get; set; }
        public Guid PessoaId { get; set; }
        public string Titulo { get; set; } = null!;
        public string? Descricao { get; set; }
        public DateTime DataAgenda { get; set; }
        public TimeSpan HorarioInicio { get; set; }
        public TimeSpan HorarioFim { get; set; }
        public DateTime DataCadastro { get; set; }
        public DateTime? DataAtualizacao { get; set; }
    }
}