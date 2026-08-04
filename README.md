# ClearFund

ClearFund is a transparency-first donation ledger for grassroots organisations. It records pledges and shows them publicly only after the receiving NGO verifies them.

## Local setup

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` plus a strong `AUTH_SECRET`.
3. Install dependencies: `npm install`
4. Apply the database schema: `npm run db:migrate`
5. Load the RAAHAT demonstration data: `npm run db:seed`
6. Run the app: `npm run dev`

The seeded credentials are for local development only:

- Donor: `donor@example.org` / `ChangeMe123!`
- NGO: `raahat@example.org` / `ChangeMe123!`

Change or remove these accounts before a production launch.

## Deploying to Vercel

1. Create a PostgreSQL database and copy its pooled connection string into Vercel as `DATABASE_URL`.
2. Add `AUTH_SECRET` (generate with `openssl rand -base64 32`) and set `AUTH_TRUST_HOST=true`.
3. For Google login, configure the production callback URL as `https://YOUR_DOMAIN/api/auth/callback/google`, then add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.
4. Import the GitHub repository in Vercel and deploy.
5. Run `npm run db:migrate` and `npm run db:seed` once against the production database from a secure terminal with the production `DATABASE_URL`.

Never commit `.env` files or production credentials.
