# Turborepo starter

This monorepo is based on the official starter of Turborepo.

## What's inside?

Besides the apps already present in the official starter (see [original README](./README_original.md)) the following packages/apps are included:

- `frontend`: a [Next.js](https://nextjs.org/) app
- `backend`: a [Nest.js](https://nestjs.com/) app
- `@repo/shared`: shared Typescript code between frontend and backend

## Initial Setup

### Install Node.js

- Developed using Node.js v22.12.0 on Linux Mint
- Install node version manager to install node.js:
- Also tested with Node.js v.20.11.1 on Windows (with PowerShell, there were errors in the Visual Studio Code terminal)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
```

### Install turborepo and pnpm as package manager

```
npm install turbo --global
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

On Windows pnpn is installed via PowerShell using (but check out [the install doc](https://pnpm.io/installation) for the latest instructions)

```
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

### Create .env file for backend

Go into `apps/backend` folder and copy the `.env.example` file to `.env` file (an apply changes if needed).

## Important Commands

### Basic Commands

Install all dependencies

```
pnpm install
```

Build all projects

```
turbo build
```

Start all projects in development mode

```
turbo dev
```

Run linter on all projects

```
turbo lint
```

Run the test cases for the backend (currently only backend is supported)

```
turbo test
```

### Development database start/stop (within docker)

These commands are defined in the top level package.json scripts:

Start the postgres docker container (docker-compose-local-db.yml):

```
pnpm db
```

Stop the postgres docker container (docker-compose-local-db.yml):

```
pnpm db:down
```

As an alternative a locally installed Postgres database on Windows is also fine.

### DB handling and migration

The following turbo commands are defined in the [package turbo.json](https://turbo.build/repo/docs/reference/package-configurations) of the backend project.

Regenerate a new migration deleting the old one.

```
turbo orm-reg
```

Apply the migration to the database.

```
turbo migrate
```

Generate a new migration file.

```
turbo orm-generate
```

Drop the current database schema

```
turbo drop
```

### Adding a new UI component from shadcn to the frontend

In the following example the [Alert component](https://ui.shadcn.com/docs/components/alert) will be added to the frontend project.

```
cd apps/frontend
pnpm dlx shadcn@latest add alert
```

### Resource generation in nestjs

```
cd apps/backend
nest g resource <resource-name>
```

### Installing packages using pnpm

E.g. install the (csv-parse)[https://www.npmjs.com/package/csv-parse] package

```
pnpm install csv-parse --recursive --filter=backend
```

Example for installing a dev dependency

```
pnpm install @types/multer --save-dev --recursive --filter=backend
```

## Docker Setup

- The `.env` file of `apps/backend` is not used
- Instead there are `.env` files for `backend` and `database` in `config` folder (currently only in a development setup)
- All services are defined in the main `docker-compose.yml` (currently for development setup only)
- ATTENTION: The `docker-compose.yml` is currently setup to drop the tables and rerun the migrations each launch
  - see `config/backend_dev.env`: `NODE_MIGRATIONS_RERUN` and `NODE_DB_DROP` set to `true`
  - Note that `apps/backend/src/config/ormconfig.ts` sets `dropSchema` and `migrationsRun` config in this case

### Build the docker containers

Run the following:

```
docker compose build
```

### Run the docker containers

Run the following:

```
docker compose up -d
```

Now go into a browser at http://localhost (or https://localhost), you will be forwarded to the https site,
accept that the page is secure and you should see the home page.
