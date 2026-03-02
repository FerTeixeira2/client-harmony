using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyApp.Application.Dtos;

namespace MyApp.Application.Interfaces
{
    public interface IAgendaService
    {
        Task<AgendaDto> CriarAsync(CreateAgendaDto dto);
        Task<AgendaDto> AtualizarAsync(Guid id, UpdateAgendaDto dto);
        Task<bool> RemoverAsync(Guid id);
        Task<AgendaDto?> ObterPorIdAsync(Guid id);
        Task<IEnumerable<AgendaDto>> ObterPorPessoaAsync(Guid pessoaId);
        Task<IEnumerable<AgendaDto>> ObterPorDataAsync(DateTime data);
        Task<IEnumerable<AgendaDto>> ObterPorPeriodoAsync(DateTime dataInicio, DateTime dataFim);
    }
}