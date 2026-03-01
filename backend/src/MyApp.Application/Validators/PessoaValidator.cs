using FluentValidation;
using MyApp.Application.Dtos;

namespace MyApp.Application.Validators;

public class CreatePessoaValidator : AbstractValidator<CreatePessoaDto>
{
    public CreatePessoaValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(150).WithMessage("Nome deve ter no máximo 150 caracteres");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório")
            .EmailAddress().WithMessage("Email inválido")
            .MaximumLength(150);

        RuleFor(x => x.Cpf)
            .NotEmpty().WithMessage("CPF é obrigatório")
            .MaximumLength(14);
    }
}

public class UpdatePessoaValidator : AbstractValidator<UpdatePessoaDto>
{
    public UpdatePessoaValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório")
            .EmailAddress().WithMessage("Email inválido")
            .MaximumLength(150);

        RuleFor(x => x.Cpf)
            .NotEmpty().WithMessage("CPF é obrigatório")
            .MaximumLength(14);
    }
}
