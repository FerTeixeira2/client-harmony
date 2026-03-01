using MyApp.Application.Dtos;

namespace MyApp.Application.Interfaces;

public interface IPessoaService
{
    Task<PessoaDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<PessoaDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PessoaDto> CreateAsync(CreatePessoaDto dto, CancellationToken cancellationToken = default);
    Task<PessoaDto> UpdateAsync(Guid id, UpdatePessoaDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
