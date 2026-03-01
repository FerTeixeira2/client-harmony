using MyApp.Api.Middleware;

namespace MyApp.Api.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }
}
