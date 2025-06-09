# Build aşaması: .NET 9 SDK kullanılıyor
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

# Çalışma aşaması: runtime imajı
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "X.dll"]
