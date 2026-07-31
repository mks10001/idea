# Backend README

This is a minimal NestJS backend scaffold for the Idea-to-Funding project.

Quickstart (local):

1. Copy .env.example to .env and fill DATABASE_URL and JWT_SECRET.
2. Install dependencies: npm install
3. Generate Prisma client: npx prisma generate
4. Run migrations: npx prisma migrate dev --name init
5. Start dev server: npm run start:dev

APIs (examples):
- POST /api/auth/register  { email, password, name }
- POST /api/auth/login     { email, password }
- GET  /api/ideas
- POST /api/ideas         { authorId, title, description }
- GET  /api/ideas/:id
- GET  /api/wallet/balance/:userId

Notes:
- This scaffold is intentionally minimal: authentication uses bcrypt + JWT, and Prisma is used for DB access.
- Stripe webhook placeholder and KYC placeholders are to be implemented in later steps.
