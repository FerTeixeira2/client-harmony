using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using MyApp.Domain.Interfaces;

namespace MyApp.Application.Services;

public class AgendaService : IAgendaService
{
    private readonly IAgendaRepository _agendaRepository;
    private readonly IPessoaRepository _pessoaRepository;

    public AgendaService(IAgendaRepository agendaRepository, IPessoaRepository pessoaRepository)
    {
        _agendaRepository = agendaRepository;
        _pessoaRepository = pessoaRepository;
    }

    public async Task<AgendaDto> CriarAsync(CreateAgendaDto dto)
    {
        if (dto.HorarioFim <= dto.HorarioInicio)
            throw new ArgumentException("Horário final deve ser maior que o inicial.");

        var pessoa = await _pessoaRepository.GetByIdAsync(dto.PessoaId);
        if (pessoa is null)
            throw new KeyNotFoundException("Pessoa não encontrada.");

        var agenda = new Agenda
        {
            PessoaId = dto.PessoaId,
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            DataAgenda = dto.DataAgenda,
            HorarioInicio = dto.HorarioInicio,
            HorarioFim = dto.HorarioFim,
            DataCadastro = DateTime.UtcNow
        };

        await _agendaRepository.AddAsync(agenda);

        return MapToDto(agenda);
    }

    public async Task<AgendaDto> AtualizarAsync(Guid id, UpdateAgendaDto dto)
    {
        var agenda = await _agendaRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Evento não encontrado.");

        if (dto.HorarioFim <= dto.HorarioInicio)
            throw new ArgumentException("Horário final deve ser maior que o inicial.");

        agenda.Titulo = dto.Titulo;
        agenda.Descricao = dto.Descricao;
        agenda.DataAgenda = dto.DataAgenda;
        agenda.HorarioInicio = dto.HorarioInicio;
        agenda.HorarioFim = dto.HorarioFim;
        agenda.DataAtualizacao = DateTime.UtcNow;

        await _agendaRepository.UpdateAsync(agenda);

        return MapToDto(agenda);
    }

    public async Task<bool> RemoverAsync(Guid id)
    {
        var agenda = await _agendaRepository.GetByIdAsync(id);
        if (agenda is null)
            return false;

        await _agendaRepository.RemoveAsync(agenda);
        return true;
    }

    public async Task<AgendaDto?> ObterPorIdAsync(Guid id)
    {
        var agenda = await _agendaRepository.GetByIdAsync(id);
        return agenda is null ? null : MapToDto(agenda);
    }

    public async Task<IEnumerable<AgendaDto>> ObterPorPessoaAsync(Guid pessoaId)
    {
        var agendas = await _agendaRepository.GetByPessoaAsync(pessoaId);
        return agendas.Select(MapToDto);
    }

    public async Task<IEnumerable<AgendaDto>> ObterPorDataAsync(DateTime data)
    {
        var agendas = await _agendaRepository.GetByDataAsync(data);
        return agendas.Select(MapToDto);
    }

    public async Task<IEnumerable<AgendaDto>> ObterPorPeriodoAsync(DateTime dataInicio, DateTime dataFim)
    {
        var agendas = await _agendaRepository.GetByPeriodoAsync(dataInicio, dataFim);
        return agendas.Select(MapToDto);
    }

    private static AgendaDto MapToDto(Agenda agenda)
    {
        return new AgendaDto
        {
            Id = agenda.Id,
            PessoaId = agenda.PessoaId,
            Titulo = agenda.Titulo,
            Descricao = agenda.Descricao,
            DataAgenda = agenda.DataAgenda,
            HorarioInicio = agenda.HorarioInicio,
            HorarioFim = agenda.HorarioFim,
            DataCadastro = agenda.DataCadastro,
            DataAtualizacao = agenda.DataAtualizacao
        };
    }
}