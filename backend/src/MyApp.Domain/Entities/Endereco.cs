namespace MyApp.Domain.Entities;

public class Endereco
{
    public Guid Id { get; set; }
    public Guid PessoaId { get; set; }
    public string Rua { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string? Complemento { get; set; }
    public string Bairro { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public string TipoEndereco { get; set; } = "Principal";
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; }
    public DateTime? DataAtualizacao { get; set; }

    public virtual Pessoa Pessoa { get; set; } = null!;
}
