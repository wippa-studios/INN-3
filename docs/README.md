# Run locally

You need **Node 22**, **.NET 10**, and **PostgreSQL on port 9999**.

Do not use `docker compose` for local play.

## Database

User / database / password: `liveyourlife`

```bash
psql -p 9999 -d liveyourlife -f database/init.sql
```

## Backend

```bash
cp backend/LYL.Api/appsettings.Development.json.example \
   backend/LYL.Api/appsettings.Development.json

dotnet run --project backend/LYL.Api/LYL.Api.csproj --launch-profile http
```

API: http://localhost:5209

## Frontend

Create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5209
```

```bash
cd frontend
yarn install
# or: npm install --legacy-peer-deps
npm run dev
```

UI: http://localhost:5173/home

Start the API before the UI. If SignalR fails, refresh the page.
