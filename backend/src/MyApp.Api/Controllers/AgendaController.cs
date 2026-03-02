using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Interfaces;
using MyApp.Application.Dtos;
using System;
using System.Threading.Tasks;

namespace MyApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendaController : ControllerBase
    {
        private readonly IAgendaService _service;

        public AgendaController(IAgendaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CreateAgendaDto dto)
        {
            var result = await _service.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] UpdateAgendaDto dto)
        {
            var result = await _service.AtualizarAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remover(Guid id)
        {
            var removed = await _service.RemoverAsync(id);
            if(!removed) return NotFound();
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(Guid id)
        {
            var agenda = await _service.ObterPorIdAsync(id);
            if(agenda == null) return NotFound();
            return Ok(agenda);
        }

        [HttpGet("pessoa/{pessoaId}")]
        public async Task<IActionResult> ObterPorPessoa(Guid pessoaId)
        {
            var agendas = await _service.ObterPorPessoaAsync(pessoaId);
            return Ok(agendas);
        }

        [HttpGet("data/{data}")]
        public async Task<IActionResult> ObterPorData(DateTime data)
        {
            var agendas = await _service.ObterPorDataAsync(data);
            return Ok(agendas);
        }

        [HttpGet("periodo")]
        public async Task<IActionResult> ObterPorPeriodo([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            var agendas = await _service.ObterPorPeriodoAsync(dataInicio, dataFim);
            return Ok(agendas);
        }
    }
}