#!/usr/bin/env bash

pnpm install

./start-database.sh

# Get POSTGRES_PASSWORD from the container and store it in a variable
DB_PASSWORD=$(docker exec -it rentability-postgres env | grep '^POSTGRES_PASSWORD=' | cut -d '=' -f2 | tr -d '\r\n')

# Print to verify
echo "Database password: $DB_PASSWORD"

# Copy .env.example to .env and update the database password
cp .env.example .env
sed -i '' "s|postgresql://postgres:password@localhost:5432/rentability|postgresql://postgres:$DB_PASSWORD@localhost:5432/rentability|" .env

pnpm db:push

pnpm dev
