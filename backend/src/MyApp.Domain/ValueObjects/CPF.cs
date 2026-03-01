using System.Text.RegularExpressions;
using MyApp.Domain.Exceptions;

namespace MyApp.Domain.ValueObjects;

public record CPF
{
    public string Valor { get; }

    public CPF(string valor)
    {
        var valorLimpo = Regex.Replace(valor ?? string.Empty, @"\D", "");
        if (valorLimpo.Length != 11)
            throw new DomainException("CPF deve conter 11 dígitos.");

        if (!EhValido(valorLimpo))
            throw new DomainException("CPF inválido.");

        Valor = valorLimpo;
    }

    public string Formatado => Convert.ToUInt64(Valor).ToString(@"000\.000\.000\-00");

    private static bool EhValido(string cpf)
    {
        if (cpf.Distinct().Count() == 1) return false;

        var soma = 0;
        for (var i = 0; i < 9; i++)
            soma += (cpf[i] - '0') * (10 - i);
        var digito1 = (soma * 10 % 11) % 10;
        if (digito1 != cpf[9] - '0') return false;

        soma = 0;
        for (var i = 0; i < 10; i++)
            soma += (cpf[i] - '0') * (11 - i);
        var digito2 = (soma * 10 % 11) % 10;
        return digito2 == cpf[10] - '0';
    }
}
