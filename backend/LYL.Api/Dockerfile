FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files first for layer-cached restore
COPY LYL.Api/LYL.Api.csproj LYL.Api/
COPY LYL.Api.Contracts/LYL.Api.Contracts.csproj LYL.Api.Contracts/
COPY LYL.Domain.Model/LYL.Domain.Model.csproj LYL.Domain.Model/
COPY LYL.Domain.Services/LYL.Domain.Services.csproj LYL.Domain.Services/
COPY LYL.Persistence/LYL.Persistence.csproj LYL.Persistence/
COPY LYL.Persistence.DataModel/LYL.Persistence.DataModel.csproj LYL.Persistence.DataModel/
RUN dotnet restore LYL.Api/LYL.Api.csproj

COPY LYL.Api/ LYL.Api/
COPY LYL.Api.Contracts/ LYL.Api.Contracts/
COPY LYL.Domain.Model/ LYL.Domain.Model/
COPY LYL.Domain.Services/ LYL.Domain.Services/
COPY LYL.Persistence/ LYL.Persistence/
COPY LYL.Persistence.DataModel/ LYL.Persistence.DataModel/
RUN dotnet publish LYL.Api/LYL.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENTRYPOINT ["dotnet", "LYL.Api.dll"]
