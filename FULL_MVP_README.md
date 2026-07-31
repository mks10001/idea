# Full MVP integration

This is an integration branch that merges the following feature branches:

- feat/token-and-escrow
- feat/stripe-integration
- feat/prisma-migration
- feat/frontend-scaffold

It contains the backend (NestJS + Prisma) with token issuance, offers/escrow placeholders, Stripe integration (webhook + checkout session creation), and a minimal Next.js frontend scaffold.

Runbook & Smoke Tests
- See README-backend.md and frontend/README-frontend.md for detailed local run instructions.

PR will include migration guidance, stripe testing instructions, and a checklist for reviewers.
