using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using MyApp.Application.Dtos;
using Xunit;

namespace MyApp.Tests.IntegrationTests;

public class PessoasControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public PessoasControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/api/pessoas");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetById_WhenNotFound_Returns404()
    {
        var response = await _client.GetAsync($"/api/pessoas/{Guid.NewGuid()}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_ValidDto_ReturnsCreated()
    {
        var dto = new CreatePessoaDto
        {
            Nome = "Teste Integration",
            Cpf = "52998224725",
            Email = "teste@email.com",
            Telefone = "(11) 99999-0000",
            Cep = "01310100",
            Logradouro = "Av. Paulista",
            Numero = "1000",
            Bairro = "Bela Vista",
            Cidade = "São Paulo",
            Estado = "SP"
        };

        var response = await _client.PostAsJsonAsync("/api/pessoas", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var pessoa = await response.Content.ReadFromJsonAsync<PessoaDto>();
        pessoa.Should().NotBeNull();
        pessoa!.Nome.Should().Be("Teste Integration");
    }
}
