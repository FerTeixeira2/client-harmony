namespace MyApp.Domain.Entities;

public class Pessoa
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public int StatusId { get; set; } = 1;
    public DateTime? DataDesativacao { get; set; }
    public DateTime DataCadastro { get; set; }
    public DateTime? DataAtualizacao { get; set; }

    public virtual StatusPessoa Status { get; set; } = null!;
    public virtual ICollection<Telefone> Telefones { get; set; } = new List<Telefone>();
    public virtual ICollection<Endereco> Enderecos { get; set; } = new List<Endereco>();
}
