# Islamic Ads Earn (Supabase Edition) — Server Test Report

**Date:** 2026-06-27

---

## 1. Is the server running?

**YES** — The Express server starts successfully and is running in the background.

Startup banner confirms:
```
==========================================
  Islamic Ads Earn — Supabase Edition
==========================================
  Server:    http://localhost:3000
  Supabase:  https://mszigtijnoydxgwwlaez.supabase.co
==========================================
```

## 2. What port?

**Port 3000** (default, configurable via `PORT` environment variable).

## 3. Does it connect to Supabase?

**YES** — The server successfully connects to the Supabase instance at `https://mszigtijnoydxgwwlaez.supabase.co`.

This was confirmed by the register-user API call, which reached Supabase and received a **database schema error** (not a connection error):

```
PGRST204: Could not find the 'referral_code' column of 'users' in the schema cache
```

This proves the Supabase connection is working — the error is due to a mismatch between the columns the server code expects (`referral_code`, `referrer_id`, `vip_level`, `withdrawal_balance`, etc.) and the actual `users` table schema in Supabase.

---

## Endpoint Test Results

| Endpoint | Method | Status | Result |
|---|---|---|---|
| `/` (root/frontend) | GET | PASS | Serves the full SPA HTML page |
| `/api/settings` | GET | PASS | Returns settings JSON correctly |
| `/api/functions/register-user` | POST | PARTIAL | Supabase connected but schema mismatch on `referral_code` column |

## Fix Required (One-Time)

To fix the registration endpoint, add the following missing columns to the `users` table in Supabase:

- `referral_code` (text)
- `referrer_id` (text or uuid, nullable)
- `vip_level` (text, nullable)
- `withdrawal_balance` (numeric, default 0)
- `is_banned` (boolean, default false)
- `ban_reason` (text, nullable)

## Code Fix Applied

One code change was needed to start the server on Node.js v20:

- **File:** `backend/server.js`
- **Issue:** `@supabase/supabase-js` v2.45+ requires WebSocket support, which Node.js 20 lacks natively.
- **Fix:** Installed the `ws` npm package and added `realtime: { transport: WebSocket }` to the Supabase client config.

## Available API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/functions/register-user` | POST | Register or login a user |
| `/api/functions/claim-daily-task` | POST | Claim daily ad-watching earnings |
| `/api/functions/submit-transaction` | POST | Submit deposit or withdrawal |
| `/api/functions/user-history` | POST | Fetch transaction history |
| `/api/functions/admin-data` | POST | Admin data (users, deposits, withdrawals) |
| `/api/functions/admin-update-status` | POST | Approve/reject deposits or withdrawals |
| `/api/functions/admin-update-payment` | POST | Update payment method |
| `/api/functions/admin-update-settings` | POST | Update platform settings |
| `/api/query/:table` | GET | Generic Supabase table query |
| `/api/settings` | GET | Platform settings |
