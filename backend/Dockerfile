FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/MyApp.Api/MyApp.Api.csproj", "MyApp.Api/"]
COPY ["src/MyApp.Application/MyApp.Application.csproj", "MyApp.Application/"]
COPY ["src/MyApp.Domain/MyApp.Domain.csproj", "MyApp.Domain/"]
COPY ["src/MyApp.Infrastructure/MyApp.Infrastructure.csproj", "MyApp.Infrastructure/"]

RUN dotnet restore "MyApp.Api/MyApp.Api.csproj"
COPY src/ .
WORKDIR "/src/MyApp.Api"
RUN dotnet build "MyApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyApp.Api.dll"]
