#!/usr/bin/env bash

pnpm install

./start-database.sh

# Get POSTGRES_PASSWORD from the container and store it in a variable
DB_PASSWORD=$(docker exec -it rentability-postgres env | grep '^POSTGRES_PASSWORD=' | cut -d '=' -f2)

# Print to verify
echo "Database password: $DB_PASSWORD"

# initialize the .env file to access the database
cat <<EOF > .env
AUTH_SECRET=""
DATABASE_URL="postgresql://postgres:$DB_PASSWORD@localhost:5432/rentability"
EOF

pnpm db:push

pnpm dev
