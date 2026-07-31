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
- GET  /api/token/balance/:userId

Stripe integration (webhook testing):
- Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env
- Use stripe-cli to forward webhooks locally:
  stripe listen --forward-to localhost:3000/api/webhook/stripe
- Trigger a test checkout completion:
  stripe trigger checkout.session.completed
- After receiving webhook, the backend will create/update StripeEvent, then credit SITE_TOKEN to the user based on metadata.tokenAmount.

Notes:
- This scaffold is intentionally minimal: authentication uses bcrypt + JWT, and Prisma is used for DB access.
- Stripe webhook endpoint requires raw request body for signature verification; the server enables raw body for /api/webhook/stripe.
- In production, secure your JWT_SECRET and Stripe keys and run prisma migrate deploy as part of your CI/CD.
