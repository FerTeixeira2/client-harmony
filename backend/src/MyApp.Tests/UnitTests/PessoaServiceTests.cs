using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using MyApp.Application.Dtos;
using MyApp.Application.Services;
using MyApp.Domain.Entities;
using MyApp.Domain.Exceptions;
using MyApp.Domain.Interfaces;
using Moq;
using Xunit;

namespace MyApp.Tests.UnitTests;

public class PessoaServiceTests
{
    private readonly Mock<IPessoaRepository> _repositoryMock;
    private readonly PessoaService _sut;

    public PessoaServiceTests()
    {
        _repositoryMock = new Mock<IPessoaRepository>();
        _sut = new PessoaService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenPessoaExists_ReturnsPessoaDto()
    {
        var id = Guid.NewGuid();
        var pessoa = new Pessoa
        {
            Id = id,
            Nome = "João Silva",
            Cpf = "12345678901",
            Email = "joao@email.com",
            StatusId = 1,
            DataCadastro = DateTime.UtcNow
        };
        _repositoryMock.Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pessoa);

        var result = await _sut.GetByIdAsync(id);

        result.Should().NotBeNull();
        result!.Nome.Should().Be("João Silva");
        result.Cpf.Should().Be("12345678901");
    }

    [Fact]
    public async Task GetByIdAsync_WhenPessoaNotExists_ReturnsNull()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Pessoa?)null);

        var result = await _sut.GetByIdAsync(id);

        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_WhenPessoaNotExists_ThrowsNotFoundException()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Pessoa?)null);

        var act = () => _sut.DeleteAsync(id);

        await act.Should().ThrowAsync<NotFoundException>();
    }
}
