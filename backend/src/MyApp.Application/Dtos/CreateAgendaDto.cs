using System;

namespace MyApp.Application.Dtos
{
    public class CreateAgendaDto
    {
        public Guid PessoaId { get; set; }
        public string Titulo { get; set; } = null!;
        public string? Descricao { get; set; }
        public DateTime DataAgenda { get; set; }
        public TimeSpan HorarioInicio { get; set; }
        public TimeSpan HorarioFim { get; set; }
    }
}