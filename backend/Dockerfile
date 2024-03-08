FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy project file and restore the project.
COPY ./backend/*.csproj .
RUN dotnet restore

# Copy everything else and publish the project.
COPY /backend .
RUN dotnet publish -c Release -o out --self-contained --runtime win-x64

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "backend.dll"]