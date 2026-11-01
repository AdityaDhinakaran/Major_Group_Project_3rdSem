# Mathpath

Mathpath is a small community-driven mathematics learning roadmap platform. Learners can browse beginner and intermediate paths, filter by topic or level, save paths to their learning list, and suggest new paths.

## Tech stack

- React and Vite
- Node.js and Express
- PostgreSQL with `pg`

## Run locally

Use Node.js 18 or newer. Install the workspace dependencies and start the React app and API together:

```sh
npm install
npm run dev
```

Open the Vite URL printed in the terminal. The client proxies `/api` requests to the Express server at port 3001. The app includes starter roadmap data, so browsing works without a database.

## PostgreSQL (optional for browsing)

Create a database named `mathpath`, copy `.env.example` to `.env`, and set `DATABASE_URL`. Apply the schema:

```sh
psql "$DATABASE_URL" -f server/db/schema.sql
```

When `DATABASE_URL` is configured, roadmap suggestions are stored in PostgreSQL. Without it, the API serves starter data and accepts suggestions for the current session.

## API

- `GET /api/health` — service and database status
- `GET /api/roadmaps` — list learning paths
- `POST /api/roadmaps` — add a path with a title, description, and level

Example request:

```sh
curl -X POST http://localhost:3001/api/roadmaps \
  -H 'Content-Type: application/json' \
  -d '{"title":"Graph Theory","description":"Explore networks, paths, and connections.","level":"Beginner"}'
```


## Deploy on Vercel

The project is configured for Vercel. Import this GitHub repository in Vercel; `vercel.json` builds the React frontend into static assets and deploys the Express API as a serverless function. Vercel will assign a free `*.vercel.app` address.

The app works with sample roadmap data without a database. To persist community suggestions, add a PostgreSQL database and set `DATABASE_URL` in the Vercel project environment variables, then apply `server/db/schema.sql`.
