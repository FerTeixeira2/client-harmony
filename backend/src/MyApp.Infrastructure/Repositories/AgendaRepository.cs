using Microsoft.EntityFrameworkCore;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces;
using MyApp.Infrastructure.Data;

namespace MyApp.Infrastructure.Repositories;

public class AgendaRepository : IAgendaRepository
{
    private readonly AppDbContext _context;

    public AgendaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Agenda?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Agendas
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Agenda>> GetByPessoaAsync(Guid pessoaId, CancellationToken cancellationToken = default)
    {
        return await _context.Agendas
            .Where(a => a.PessoaId == pessoaId)
            .OrderBy(a => a.DataAgenda)
            .ThenBy(a => a.HorarioInicio)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Agenda>> GetByDataAsync(DateTime data, CancellationToken cancellationToken = default)
    {
        var dateOnly = data.Date;

        return await _context.Agendas
            .Where(a => a.DataAgenda.Date == dateOnly)
            .OrderBy(a => a.HorarioInicio)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Agenda>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim, CancellationToken cancellationToken = default)
    {
        var inicio = dataInicio.Date;
        var fim = dataFim.Date;

        return await _context.Agendas
            .Where(a => a.DataAgenda.Date >= inicio && a.DataAgenda.Date <= fim)
            .OrderBy(a => a.DataAgenda)
            .ThenBy(a => a.HorarioInicio)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Agenda agenda, CancellationToken cancellationToken = default)
    {
        await _context.Agendas.AddAsync(agenda, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Agenda agenda, CancellationToken cancellationToken = default)
    {
        _context.Agendas.Update(agenda);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(Agenda agenda, CancellationToken cancellationToken = default)
    {
        _context.Agendas.Remove(agenda);
        await _context.SaveChangesAsync(cancellationToken);
    }
}

