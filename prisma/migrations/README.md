# Prisma Migrations (Guidance)

This directory contains guidance and helper scripts for applying Prisma migrations for the Idea-to-Funding project.

Important notes
- I do NOT run migrations against your production database. Migrations must be executed in an environment that has access to your DATABASE_URL (local, CI or deployment environment).
- Always back up your production database before running migrations.

Commands
- Generate client:
  npx prisma generate

- Create a migration (development):
  npx prisma migrate dev --name init

- Apply migrations (production / CI):
  npx prisma migrate deploy

- Inspect SQL for a migration:
  npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma

CI example (GitHub Actions)
- Use prisma migrate deploy in your release workflow. Example snippet:

```yaml
- name: Install dependencies
  run: npm ci

- name: Generate Prisma client
  run: npx prisma generate

- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npx prisma migrate deploy
```

Seeding
- You can use a seed script to create initial admin/test users. See prisma/seed.ts example in this branch.

Rollback / Troubleshooting
- Prisma migrations are not easily reversible automatically. If you need to rollback a production migration, restore from backup or write a corrective migration.
- If migrate dev fails locally, try `npx prisma migrate resolve --applied <migration_name>` only if you understand the migration state.
