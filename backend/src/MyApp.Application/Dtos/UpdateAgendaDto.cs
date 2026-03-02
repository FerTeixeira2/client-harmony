using System;

namespace MyApp.Application.Dtos
{
    public class UpdateAgendaDto
    {
        public string Titulo { get; set; } = null!;
        public string? Descricao { get; set; }
        public DateTime DataAgenda { get; set; }
        public TimeSpan HorarioInicio { get; set; }
        public TimeSpan HorarioFim { get; set; }
    }
}