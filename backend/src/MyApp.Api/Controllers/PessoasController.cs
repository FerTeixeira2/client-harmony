using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;

namespace MyApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaDto>>> GetAll(CancellationToken cancellationToken = default)
    {
        var pessoas = await _pessoaService.GetAllAsync(cancellationToken);
        return Ok(pessoas);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PessoaDto>> GetById(Guid id, CancellationToken cancellationToken = default)
    {
        var pessoa = await _pessoaService.GetByIdAsync(id, cancellationToken);
        if (pessoa is null)
            return NotFound();
        return Ok(pessoa);
    }

    [HttpPost]
    public async Task<ActionResult<PessoaDto>> Create([FromBody] CreatePessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoa = await _pessoaService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = pessoa.Id }, pessoa);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PessoaDto>> Update(Guid id, [FromBody] UpdatePessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoa = await _pessoaService.UpdateAsync(id, dto, cancellationToken);
        return Ok(pessoa);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken = default)
    {
        await _pessoaService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
