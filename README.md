# Relics
Relics is a simple full-stack web application for a school project

## Get started
The application is split in two parts: the frontend and the backend. The backend can be found in /backend and the frontend can be found in /web.

### Setting up the database
First you will need to spin up a docker container running the PostgreSQL database. This can be found here: https://hub.docker.com/_/postgres.
<br/>After starting the docker container, get the port of the container. You will need this next.

### Settings up the backend
Navigate to the `backend` directory and open the `appsettings.json` file. Here you will see a property for the connectionstring to the database. You wil need to fill in the correct port, the username and password to the database. 
<br/>The default value is the default username and password of a fresh PostgreSQL image.
<br/><br/>
After configuration you can start the backend application by running the following command: `dotnet run --project "backend"`. This will start the ASP.NET Core backend application.

### Settings up the frontend
Navigate to the `web` directory and run the following command: `npm run dev`. This will start the frontend application.
<br/>Open http://localhost:3000 to see the running web application. You might need to change the `uri` in the `apollo-client.js` file to make sure the web application is reaching the api at the correct url.
