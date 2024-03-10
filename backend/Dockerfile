FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80
EXPOSE 443
EXPOSE 5000

# Copy project file and restore the project.
COPY ./backend/*.csproj .
RUN dotnet restore

# Copy everything else and publish the project.
COPY /backend .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Backend.dll"]