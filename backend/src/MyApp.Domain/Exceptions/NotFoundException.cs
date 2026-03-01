namespace MyApp.Domain.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object key)
        : base($"{entityName} com id '{key}' não foi encontrado.") { }

    public NotFoundException(string message) : base(message) { }
}
