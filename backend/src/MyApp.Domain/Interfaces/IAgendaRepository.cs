using MyApp.Domain.Entities;

namespace MyApp.Domain.Interfaces;

public interface IAgendaRepository
{
    Task<Agenda?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Agenda>> GetByPessoaAsync(Guid pessoaId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Agenda>> GetByDataAsync(DateTime data, CancellationToken cancellationToken = default);
    Task<IEnumerable<Agenda>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim, CancellationToken cancellationToken = default);
    Task AddAsync(Agenda agenda, CancellationToken cancellationToken = default);
    Task UpdateAsync(Agenda agenda, CancellationToken cancellationToken = default);
    Task RemoveAsync(Agenda agenda, CancellationToken cancellationToken = default);
}

