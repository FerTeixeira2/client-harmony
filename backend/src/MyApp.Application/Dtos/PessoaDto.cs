namespace MyApp.Application.Dtos;

public record PessoaDto
{
    public Guid Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Telefone { get; init; } = string.Empty;
    public string Cpf { get; init; } = string.Empty;
    public string Cep { get; init; } = string.Empty;
    public string Logradouro { get; init; } = string.Empty;
    public string Numero { get; init; } = string.Empty;
    public string? Complemento { get; init; }
    public string Bairro { get; init; } = string.Empty;
    public string Cidade { get; init; } = string.Empty;
    public string Estado { get; init; } = string.Empty;
    public DateTime DataCadastro { get; init; }
    public DateTime? DataAtualizacao { get; init; }
    public string ImagemUrl { get; init; } = string.Empty;
}
