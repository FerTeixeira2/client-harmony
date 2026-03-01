using MyApp.Domain.Entities;

namespace MyApp.Domain.Interfaces;

public interface IPessoaRepository
{
    Task<Pessoa?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Pessoa>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Pessoa pessoa, Telefone telefone, Endereco endereco, CancellationToken cancellationToken = default);
    Task UpdateAsync(Pessoa pessoa, CancellationToken cancellationToken = default);
    Task DesativarAsync(Guid id, CancellationToken cancellationToken = default);
}
