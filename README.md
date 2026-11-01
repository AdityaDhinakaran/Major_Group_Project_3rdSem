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


## Free GitHub Pages site

The React frontend can be hosted free on GitHub Pages for this public repository. The built frontend is included in the `docs/` folder. In repository Settings → Pages, choose `main` as the branch and `/docs` as the folder to publish. The site URL is:

`https://adityadhinakaran.github.io/Major_Group_Project_3rdSem/`

The Pages site uses the built-in sample roadmap data. GitHub Pages only serves static files, so the Express API and PostgreSQL community submissions need a separate Node.js host and database to persist.
