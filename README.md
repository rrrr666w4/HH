# Islamic Ads Earn — Supabase Edition

Supabase-connected version of the Islamic Ads Earn platform. This version replaces the local SQLite database with a real Supabase backend, connecting directly to the cloud PostgreSQL database for user management, transactions, and real-time features.

## Architecture

```
islamic-ads-earn-supabase/
├── backend/
│   └── server.js            # Express server with Supabase integration
├── frontend/
│   ├── assets/
│   │   ├── client-BaMLYllm.js   # Real Supabase client (replaces mock)
│   │   ├── index-CQnWUjsj.js   # Main React/Router app bundle
│   │   ├── dashboard-*.js       # Dashboard component
│   │   ├── deposit-*.js         # Deposit flow
│   │   ├── withdraw-*.js        # Withdrawal flow
│   │   ├── invite-*.js          # Referral system
│   │   ├── admin-*.js           # Admin panel
│   │   └── ...                  # Other component bundles
│   ├── index.html               # SPA entry point
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── ...                      # Other HTML pages
├── package.json
└── README.md
```

## How It Works

### Frontend (client-BaMLYllm.js)

The frontend client has been replaced with a real Supabase client that:

- **Imports `@supabase/supabase-js`** from CDN (esm.sh) as an ES module
- **Connects directly** to the Supabase project for database queries (`s.from()`)
- **Uses Supabase Realtime** for live channel subscriptions (`s.channel()`)
- **Supports Supabase Auth** for authentication (`s.auth`)
- **Falls back to the Express backend** for `s.functions.invoke()` calls when Supabase Edge Functions are not deployed

### Backend (server.js)

The Express backend serves as:

- **Static file server** for the frontend SPA
- **API proxy** for function calls that need server-side processing
- **Supabase bridge** — translates API requests into Supabase queries
- **Fallback handler** for `s.functions.invoke()` when Edge Functions aren't available

### Supabase Connection

| Property | Value |
|----------|-------|
| Project | mszigtijnoydxgwwlaez |
| URL | https://mszigtijnoydxgwwlaez.supabase.co |
| Key Type | anon (public) |

### Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User profiles, balances, VIP levels |
| `tasks` | Daily task claims and completion records |
| `deposits` | Deposit/investment transactions |
| `withdrawals` | Withdrawal requests and processing |

## Setup & Run

### Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)

### Installation

```bash
cd islamic-ads-earn-supabase
npm install
```

### Start the Server

```bash
npm start
```

### Access the App

Open your browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

### Function Endpoints (backend fallback for s.functions.invoke)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/functions/register-user` | Register or find existing user |
| POST | `/api/functions/claim-daily-task` | Claim daily ad-watching earnings |
| POST | `/api/functions/submit-transaction` | Submit deposit or withdrawal |
| POST | `/api/functions/user-history` | Fetch transaction history |
| POST | `/api/functions/admin-data` | Admin data (users, referrals, etc.) |
| POST | `/api/functions/admin-update-status` | Approve/reject transactions |
| POST | `/api/functions/admin-update-payment` | Update payment methods |
| POST | `/api/functions/admin-update-settings` | Update platform settings |

### Query Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/query/:table` | Generic table query with filters |
| GET | `/api/settings` | Platform settings |

## Key Differences from Clone Version

| Feature | Clone (SQLite) | Supabase Edition |
|---------|---------------|------------------|
| Database | Local SQLite | Cloud PostgreSQL (Supabase) |
| Auth | localStorage stubs | Supabase Auth (real) |
| Realtime | Polling (10s interval) | Supabase Realtime (WebSocket) |
| Functions | Local Express routes | Supabase Edge Functions + Express fallback |
| Client | Mock API adapter | Real @supabase/supabase-js |
| Deployment | Local only | Cloud-ready |
