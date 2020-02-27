#AS build

FROM mcr.microsoft.com/dotnet/core/sdk:3.0 as build
WORKDIR /build

# copy csproj and restore as distinct layers
COPY ./PLSystem/PLSystem.csproj ./PLSystem/PLSystem.csproj
RUN dotnet restore ./PLSystem/PLSystem.csproj

COPY ./PLSystem.Business/PLSystem.Business.csproj ./PLSystem.Business/PLSystem.Business.csproj
RUN dotnet restore ./PLSystem.Business/PLSystem.Business.csproj

COPY ./PLSystem.DAL/PLSystem.DAL.csproj ./PLSystem.DAL/PLSystem.DAL.csproj
RUN dotnet restore ./PLSystem.DAL/PLSystem.DAL.csproj

COPY . .
RUN dotnet publish ./PLSystem/PLSystem.csproj -c Release --output /publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0 as runtime
WORKDIR /publish
COPY --from=build /publish .
# CMD bash -c "dotnet PLSystem.dll"


ENTRYPOINT ["dotnet", "PLSystem.dll"]