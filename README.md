# Rentability

**A scheduling app for businesses to keep track and manage their rental services**

## Local Development Setup

### Requirements

- Node.js 18+ (LTS recommended) — install: https://nodejs.org/
- pnpm 8+ — install: run `npm install -g pnpm@latest-10` after installing Node.js
- Docker (with Docker Desktop / Docker Compose) — install: https://www.docker.com/get-started and Compose docs: https://docs.docker.com/compose/install/
- A `.env` file created from `.env.example` (ensure `AUTH_SECRET` and any database vars like `DATABASE_URL` are set)

Optional checks:

- node -v
- pnpm -v
- docker --version

Quick tip:

- Copy the example env: `cp .env.example .env` and edit the values before running the app.

### Running Locally

1. run `pnpm install` to install dependencies
2. run `./start-database.sh` to run a docker container for PostgresSQL
3. run `pnpm db:push` to apply the current schema to the database.
4. create a `.env` file using `.env.example` as a template and fill in needed values (currently just AUTH_SECRET)
5. run `pnpm db:reset && pnpm db:push && pnpm db:seed` to reset & seed the database (run only `pnpm db:push && pnpm db:seed` starting from empty db)
6. run `pnpm dev` to run locally

### Common Troubleshooting

- “Database connection refused”: ensure Docker is running and `DATABASE_URL` points to the expected host/port.
- “AUTH_SECRET missing”: copy `.env.example` and set AUTH_SECRET before starting.

### Developer tooling & tips

- Recommended VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense, PostgreSQL

## Create T3 App ---------------------------------------------------------------------------------------------

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

### What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)

### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
