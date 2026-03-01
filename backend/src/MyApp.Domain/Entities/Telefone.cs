namespace MyApp.Domain.Entities;

public class Telefone
{
    public Guid Id { get; set; }
    public Guid PessoaId { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Tipo { get; set; } = "Celular";
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; }
    public DateTime? DataAtualizacao { get; set; }

    public virtual Pessoa Pessoa { get; set; } = null!;
}
