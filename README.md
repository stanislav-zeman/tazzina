# Tazzina

Coffee consumption tracker for teams. Log your daily coffees, track team stats across sprints, and see who's fueling the most.

## Stack

- [SvelteKit](https://kit.svelte.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [bits-ui](https://bits-ui.com/)
- [PostgreSQL](https://www.postgresql.org/) via [postgres.js](https://github.com/porsager/postgres)
- [Auth.js](https://authjs.dev/) (Google OAuth)
- Docker + Google Cloud Run

## Getting started

### Prerequisites

- Node.js 22+
- pnpm
- Docker & Docker Compose

### Local development

```bash
pnpm install
cp .env.example .env  # fill in your credentials
docker compose up     # starts the app + postgres
```

The app will be available at `http://localhost:3000`.

### Environment variables

| Variable               | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string                             |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                                   |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                               |
| `AUTH_SECRET`          | Auth.js secret (random string)                           |
| `AUTH_URL`             | Full URL of the app (e.g. `https://tazzina.example.com`) |
| `ORIGIN`               | Same as `AUTH_URL`                                       |
