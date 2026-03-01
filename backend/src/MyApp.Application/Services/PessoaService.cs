using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using MyApp.Domain.Exceptions;
using MyApp.Domain.Interfaces;

namespace MyApp.Application.Services;

public class PessoaService : IPessoaService
{
    private readonly IPessoaRepository _repository;

    public PessoaService(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<PessoaDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var pessoa = await _repository.GetByIdAsync(id, cancellationToken);
        return pessoa is null ? null : ToDto(pessoa);
    }

    public async Task<IEnumerable<PessoaDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var pessoas = await _repository.GetAllAsync(cancellationToken);
        return pessoas.Select(p => ToDto(p));
    }

    public async Task<PessoaDto> CreateAsync(CreatePessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoaId = Guid.NewGuid();
        var cpfLimpo = dto.Cpf.Replace(".", "").Replace("-", "");
        var cepLimpo = dto.Cep.Replace("-", "");

        var pessoa = new Pessoa
        {
            Id = pessoaId,
            Nome = dto.Nome,
            Email = dto.Email,
            Cpf = cpfLimpo.Length > 11 ? cpfLimpo[..11] : cpfLimpo,
            StatusId = 1,
            DataCadastro = DateTime.UtcNow
        };

        var telefone = new Telefone
        {
            Id = Guid.NewGuid(),
            PessoaId = pessoaId,
            Numero = dto.Telefone,
            Tipo = "Celular",
            Ativo = true,
            DataCadastro = DateTime.UtcNow
        };

        var endereco = new Endereco
        {
            Id = Guid.NewGuid(),
            PessoaId = pessoaId,
            Rua = dto.Logradouro,
            Numero = dto.Numero,
            Complemento = dto.Complemento,
            Bairro = dto.Bairro,
            Cidade = dto.Cidade,
            Estado = dto.Estado,
            Cep = cepLimpo.Length > 8 ? cepLimpo[..8] : cepLimpo,
            TipoEndereco = "Principal",
            Ativo = true,
            DataCadastro = DateTime.UtcNow
        };

        await _repository.AddAsync(pessoa, telefone, endereco, cancellationToken);
        return ToDto(pessoa, telefone, endereco);
    }

    public async Task<PessoaDto> UpdateAsync(Guid id, UpdatePessoaDto dto, CancellationToken cancellationToken = default)
    {
        var pessoa = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Pessoa", id);

        var cpfLimpo = dto.Cpf.Replace(".", "").Replace("-", "");
        var cepLimpo = dto.Cep.Replace("-", "");

        pessoa.Nome = dto.Nome;
        pessoa.Email = dto.Email;
        pessoa.Cpf = cpfLimpo.Length > 11 ? cpfLimpo[..11] : cpfLimpo;
        pessoa.DataAtualizacao = DateTime.UtcNow;

        var telefone = pessoa.Telefones.FirstOrDefault(t => t.Ativo);
        if (telefone != null)
        {
            telefone.Numero = dto.Telefone;
            telefone.DataAtualizacao = DateTime.UtcNow;
        }
        else if (!string.IsNullOrWhiteSpace(dto.Telefone))
        {
            telefone = new Telefone
            {
                Id = Guid.NewGuid(),
                PessoaId = id,
                Numero = dto.Telefone,
                Tipo = "Celular",
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            };
            pessoa.Telefones.Add(telefone);
        }

        var endereco = pessoa.Enderecos.FirstOrDefault(e => e.Ativo);
        if (endereco != null)
        {
            endereco.Rua = dto.Logradouro;
            endereco.Numero = dto.Numero;
            endereco.Complemento = dto.Complemento;
            endereco.Bairro = dto.Bairro;
            endereco.Cidade = dto.Cidade;
            endereco.Estado = dto.Estado;
            endereco.Cep = cepLimpo.Length > 8 ? cepLimpo[..8] : cepLimpo;
            endereco.DataAtualizacao = DateTime.UtcNow;
        }
        else
        {
            endereco = new Endereco
            {
                Id = Guid.NewGuid(),
                PessoaId = id,
                Rua = dto.Logradouro,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado,
                Cep = cepLimpo.Length > 8 ? cepLimpo[..8] : cepLimpo,
                TipoEndereco = "Principal",
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            };
            pessoa.Enderecos.Add(endereco);
        }

        await _repository.UpdateAsync(pessoa, cancellationToken);
        return ToDto(pessoa);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        await _repository.DesativarAsync(id, cancellationToken);
    }

    private static PessoaDto ToDto(Pessoa p, Telefone? t = null, Endereco? e = null)
    {
        var telefone = t ?? p.Telefones.FirstOrDefault(x => x.Ativo);
        var endereco = e ?? p.Enderecos.FirstOrDefault(x => x.Ativo);
        var cpfFormatado = p.Cpf.Length >= 11
            ? $"{p.Cpf[..3]}.{p.Cpf[3..6]}.{p.Cpf[6..9]}-{p.Cpf[9..11]}"
            : p.Cpf;
        var cepFormatado = endereco?.Cep?.Length >= 8
            ? $"{endereco.Cep[..5]}-{endereco.Cep[5..8]}"
            : endereco?.Cep ?? "";
        return new PessoaDto
        {
            Id = p.Id,
            Nome = p.Nome,
            Email = p.Email,
            Telefone = telefone?.Numero ?? "",
            Cpf = cpfFormatado,
            Cep = cepFormatado,
            Logradouro = endereco?.Rua ?? "",
            Numero = endereco?.Numero ?? "",
            Complemento = endereco?.Complemento,
            Bairro = endereco?.Bairro ?? "",
            Cidade = endereco?.Cidade ?? "",
            Estado = endereco?.Estado ?? "",
            DataCadastro = p.DataCadastro,
            DataAtualizacao = p.DataAtualizacao,
            ImagemUrl = ""
        };
    }
}
