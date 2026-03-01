using System.Net;
using System.Text.Json;
using MyApp.Api.Models;
using MyApp.Domain.Exceptions;

namespace MyApp.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        var (statusCode, response) = exception switch
        {
            NotFoundException => (HttpStatusCode.NotFound, new ErrorResponse(exception.Message, 404)),
            DomainException => (HttpStatusCode.BadRequest, new ErrorResponse(exception.Message, 400)),
            ArgumentException => (HttpStatusCode.BadRequest, new ErrorResponse(exception.Message, 400)),
            _ => (HttpStatusCode.InternalServerError,
                new ErrorResponse(
                    _env.IsDevelopment() ? exception.Message : "Ocorreu um erro interno no servidor.",
                    500))
        };

        context.Response.StatusCode = (int)statusCode;
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}
