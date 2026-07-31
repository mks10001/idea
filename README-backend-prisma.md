## Prisma migration guidance

This file supplements prisma/migrations/README.md with a short checklist:

- Ensure DATABASE_URL env var points to the correct database.
- Run `npx prisma generate` to update the client.
- Run `npx prisma migrate dev --name init` for local development (this generates migration files under prisma/migrations/).
- Commit the generated migration files if they represent the canonical DDL for your project. Note: some teams prefer generating migrations in CI to avoid environment-specific DDL differences.
- In production, run `npx prisma migrate deploy` as part of deployment.

If you want me to generate SQL migration files based on the current schema.prisma and include them in the repo, tell me and I will create an initial SQL migration file. Otherwise, run `prisma migrate dev` in your environment to produce migration files.
