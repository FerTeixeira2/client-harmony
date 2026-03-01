using System.Text.RegularExpressions;
using MyApp.Domain.Exceptions;

namespace MyApp.Domain.ValueObjects;

public record Email
{
    public string Valor { get; }

    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public Email(string valor)
    {
        if (string.IsNullOrWhiteSpace(valor))
            throw new DomainException("Email não pode ser vazio.");

        if (!EmailRegex.IsMatch(valor))
            throw new DomainException("Email inválido.");

        Valor = valor.Trim().ToLowerInvariant();
    }
}
