namespace MyApp.Domain.Entities;

public class StatusPessoa
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;

    public virtual ICollection<Pessoa> Pessoas { get; set; } = new List<Pessoa>();
}
