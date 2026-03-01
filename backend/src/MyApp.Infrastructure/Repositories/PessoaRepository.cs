using Microsoft.EntityFrameworkCore;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces;
using MyApp.Infrastructure.Data;

namespace MyApp.Infrastructure.Repositories;

public class PessoaRepository : IPessoaRepository
{
    private readonly AppDbContext _context;

    public PessoaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Pessoa?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Pessoas
            .Include(p => p.Telefones)
            .Include(p => p.Enderecos)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Pessoa>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Pessoas
            .Include(p => p.Telefones)
            .Include(p => p.Enderecos)
            .Where(p => p.StatusId == 1)
            .OrderByDescending(p => p.DataCadastro)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Pessoa pessoa, Telefone telefone, Endereco endereco, CancellationToken cancellationToken = default)
    {
        await _context.Pessoas.AddAsync(pessoa, cancellationToken);
        await _context.Telefones.AddAsync(telefone, cancellationToken);
        await _context.Enderecos.AddAsync(endereco, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Pessoa pessoa, CancellationToken cancellationToken = default)
    {
        _context.Pessoas.Update(pessoa);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DesativarAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var pessoa = await _context.Pessoas.FindAsync([id], cancellationToken)
            ?? throw new Domain.Exceptions.NotFoundException("Pessoa", id);
        pessoa.StatusId = 2;
        pessoa.DataDesativacao = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
