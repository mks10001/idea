# Frontend README

This is a minimal Next.js frontend scaffold for the Idea-to-Funding project.

Quickstart:
1. cd frontend
2. npm install
3. cp .env.example .env (set NEXT_PUBLIC_API_BASE_URL to your backend)
4. npm run dev

Pages:
- / - idea list
- /auth/register - register
- /auth/login - login
- /ideas/new - create idea
- /ideas/[id] - idea details
- /wallet - wallet page (view balance and purchase tokens)

Notes:
- JWT is stored in localStorage (simple MVP approach). API calls include Authorization header when logged in.
- Purchase flow redirects to Stripe Checkout URL returned by backend.
