# Website Analysis Report: islamic-ads-earn.com

**Date:** June 25, 2026
**Purpose:** Educational / Security Analysis

---

## 1. Download Summary

| Metric | Value |
|--------|-------|
| **Total files downloaded** | 63 |
| **Total size** | 2,444,781 bytes (2.3 MB) |
| **HTML pages** | 11 files (137,790 bytes) |
| **JavaScript files** | 49 files (801,111 bytes) |
| **CSS files** | 1 file (100,126 bytes) |
| **Image files (PNG)** | 2 files (1,405,754 bytes) |

---

## 2. Complete File Listing

### HTML Pages
```
index.html                       (27,816 bytes)  - Landing page
login.html                       (7,643 bytes)   - Login form
register.html                    (8,956 bytes)   - Registration form
dashboard.html                   (4,523 bytes)   - User dashboard
deposit.html                     (47,624 bytes)  - Deposit/buy package page
withdraw.html                    (3,614 bytes)   - Withdrawal page
invite.html                      (4,087 bytes)   - Referral/invite page
plan-list.html                   (21,029 bytes)  - Plan listing page
complete-task.html               (4,728 bytes)   - Ad watching/task page
admin.html                       (5,325 bytes)   - Admin control panel
vip-packages.html                (2,445 bytes)   - VIP package listing
```

### Core JavaScript Bundles
```
assets/index-CQnWUjsj.js        (331,097 bytes) - Main React/Router bundle
assets/client-BaMLYllm.js        (194,783 bytes) - Supabase client SDK
assets/invite-LXD9uPo3.js       (33,384 bytes)  - Referral system + QR code lib
assets/admin-BMXJ7Df3.js         (45,680 bytes)  - Admin panel
assets/dashboard-DE_U3Ww_.js     (25,203 bytes)  - Dashboard component
assets/withdrawal-history-BISps9CD.js (20,519 bytes) - Withdrawal history
assets/deposit-BA2PZkpl.js       (13,901 bytes)  - Deposit/package purchase
assets/withdraw-BBAtsq6l.js      (11,661 bytes)  - Withdrawal form
assets/offer-apply-D4ffxYgQ.js   (8,475 bytes)   - Special offer application
assets/complete-task-DgB0kfEh.js  (7,309 bytes)  - Ad watching/task completion
assets/index-CYfkGe_9.js         (6,233 bytes)  - Homepage component
assets/register-A3WTx_rM.js      (5,749 bytes)  - Registration form
assets/login-B9rF1T53.js         (3,709 bytes)  - Login form
assets/promo-code-B0J-BYPd.js    (3,518 bytes)  - Promo code entry
assets/deposit-history-DP5ToFDF.js (3,218 bytes) - Deposit history
assets/plan-list-DoZO2sUe.js      (3,253 bytes) - Plan listing
assets/balance-history-BmeN3LAO.js (2,738 bytes) - Balance history
assets/banned-Pr1fzUpf.js         (2,446 bytes) - Banned account page
assets/user-session-D5SYADmQ.js   (1,964 bytes) - User session management
assets/vip-packages-DpNKgiaA.js   (1,362 bytes) - VIP package definitions
assets/Header-DgME0PqW.js         (1,214 bytes) - Header component
assets/createLucideIcon-Bjbq1aAs.js (1,202 bytes) - Icon library helper
```

### Analytics / Tracking Scripts
```
__l5e/events.js                  (44,148 bytes)  - Lovable.dev platform telemetry
~flock.js                        (21,296 bytes)  - Tinybird web analytics
```

### Icon Components (Lucide SVG)
```
assets/x-8suKtt1X.js, assets/crown-DGN7bd4H.js, assets/tag-z4STMM2g.js,
assets/ticket-iDWFjpe5.js, assets/wallet-qynyQoEz.js, assets/users-D3gn5cze.js,
assets/shield-DNyWfJ6D.js, assets/zap-BR9nxjjS.js, assets/trending-up-Bxv3dDfj.js,
assets/package-EsnxUUSv.js, assets/eye-FLJYg5wO.js, assets/eye-off-hSuMTHhx.js,
assets/copy-DrN4iJnf.js, assets/download-DtWwhcci.js, assets/lock-CiCYaL-C.js,
assets/circle-alert-DKvoJhH9.js, assets/circle-check-CO8yE3CE.js,
assets/circle-check-big-BEqVpJ2k.js, assets/circle-x-C3GvQBsC.js,
assets/clock-_4IGwniC.js, assets/arrow-left-DP6ADFD8.js, assets/check-QI4PRSzb.js,
assets/log-in-CN5V-Lnr.js, assets/user-DJomeDR9.js, assets/logo-D5oI_FYM.js
```

### CSS
```
assets/styles-D7v021ue.css       (100,126 bytes) - Tailwind CSS compiled stylesheet
```

### Images
```
assets/logo-CqYZQfoZ.png         (645,598 bytes) - Site logo
external/og-images/og-image.png   (760,156 bytes) - Open Graph share image
```

---

## 3. Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend Framework | React 19.2.5 |
| Router | TanStack Router (SSR mode) |
| SSR Framework | TanStack Start (via Vinxi) |
| Bundler | Vite with Rollup |
| CSS | Tailwind CSS (compiled) |
| Icons | Lucide React |
| Font | Noto Nastaliq Urdu (Google Fonts) |
| Backend/Database | Supabase (PostgreSQL) |
| Build Platform | Lovable.dev (AI-generated code) |
| Analytics | Tinybird + Lovable platform telemetry |
| QR Code | qrcode library (embedded in invite chunk) |

---

## 4. Backend / API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/_serverFn/{functionId}` | TanStack Start server function RPC |
| Supabase Edge Functions: `register-user` | User registration |
| Supabase Edge Functions: `admin-data` | Settings, referrals, user status, plan discounts |
| Supabase Edge Functions: `user-history` | Deposit/withdrawal/task history |
| Supabase Edge Functions: `submit-transaction` | Deposit submission with screenshot |
| Supabase Edge Functions: `claim-daily-task` | Daily ad earning claim |
| Supabase Table: `payment_methods` | Payment method configuration |
| Supabase Table: `profiles` | User profiles (live subscription) |
| Supabase Table: `deposits` | Deposit records (live subscription) |
| Supabase Table: `withdrawals` | Withdrawal records (live subscription) |
| Supabase Table: `daily_task_claims` | Daily task claims |
| `/__l5e/trackevents` | Lovable event tracking |
| `/__l5e/replay` | Lovable session replay |
| `/~api/analytics` | Tinybird analytics proxy |
| Supabase URL: `https://mxuwqgngsgsqvfirwopy.supabase.co` | Backend API |

---

## 5. External URLs Found

| URL | Purpose |
|-----|---------|
| `https://mxuwqgngsgsqvfirwopy.supabase.co` | Supabase backend |
| `https://fonts.googleapis.com` | Google Fonts (Noto Nastaliq Urdu) |
| `https://storage.googleapis.com/gpt-engineer-file-uploads/...` | OG image hosting (Lovable) |
| `https://api.tinybird.co/v0/events` | Analytics API |
| `https://whatsapp.com/channel/0029Vb7P8PXF1YlUTnZDzk2z` | WhatsApp channel |

---

## 6. VIP Package Structure (Hardcoded)

The site defines 10 "investment" tiers:

| Package | Investment (PKR) | Daily Earning (PKR) | Daily ROI | Ads/Day | Duration | Referral |
|---------|-----------------|--------------------:|----------:|--------:|----------|----------|
| VIP 1   | 150             | 60                  | 40.0%     | 1       | Lifetime | 13%      |
| VIP 2   | 300             | 100                 | 33.3%     | 1       | Lifetime | 13%      |
| VIP 3   | 600             | 180                 | 30.0%     | 1       | Lifetime | 13%      |
| VIP 4   | 1,200           | 320                 | 26.7%     | 1       | Lifetime | 13%      |
| VIP 5   | 2,400           | 700                 | 29.2%     | 1       | Lifetime | 13%      |
| VIP 6   | 4,800           | 1,500               | 31.3%     | 1       | Lifetime | 13%      |
| VIP 7   | 9,600           | 3,200               | 33.3%     | 1       | Lifetime | 13%      |
| VIP 8   | 19,200          | 6,500               | 33.9%     | 1       | Lifetime | 13%      |
| VIP 9   | 38,400          | 13,000              | 33.9%     | 1       | Lifetime | 13%      |
| VIP 10  | 76,800          | 26,000              | 33.9%     | 1       | Lifetime | 13%      |

**All packages claim "Lifetime" duration and "Unlimited" total profit.**

---

## 7. How The Scheme Works (Code Analysis)

### Registration
- Users register with username, phone (+92), password, and optional referral code
- The `register-user` Supabase Edge Function creates/syncs user profiles
- Referral codes are 6-digit numeric codes

### Deposit (Investment)
1. User selects a VIP package (PKR 150 - 76,800)
2. Optional discount code validation via `admin-data` edge function
3. User selects payment method (EasyPaisa/JazzCash, dynamically from `payment_methods` table)
4. User sends money manually to the displayed account number
5. User submits TRX ID, WhatsApp number, and screenshot as "proof"
6. Admin manually approves deposits via admin panel
7. Package activates after admin approval

### "Earning" (Daily Task)
1. User clicks "Complete Task" - sees a 10-second fake progress bar
2. While waiting, an Islamic quote (hadith/Quran verse) is displayed in Urdu
3. After 10 seconds, user clicks "Claim PKR X" to claim daily earnings
4. Only 1 claim per day per user
5. The `claim-daily-task` edge function adds the amount to user balance

### Referral System
- 13% commission on referred users' deposits (shown as "dashboard commission")
- 50% commission on referred users' withdrawals (shown as "withdrawal commission")
- QR code generation for easy sharing of referral links
- Team report download for users with 20+ referrals

### Withdrawal
- Minimum withdrawal: PKR 30
- Processing time: 20 minutes to 24 hours (manual admin approval)
- Admin controls all approvals/rejections

### Dashboard
- Shows fake "Live Activity" ticker with randomly generated deposit/withdrawal events
- Names are hardcoded (e.g., "Ahmed K***", "Bilal S***", etc.)
- Amounts are randomly picked from the VIP package investment/earning values
- New fake activity generated every 25 seconds
- Activity rotates display every 3 seconds

### Admin Panel
- User ban/unban capability
- Deposit/withdrawal approval/rejection
- Dashboard notice management
- Offer popup configuration with countdown timer
- WhatsApp channel URL configuration
- Payment method management

---

## 8. Red Flags / Suspicious Patterns

### Ponzi/MLM Scheme Indicators
1. **Impossible ROI**: 26-40% DAILY returns are mathematically unsustainable
2. **"Lifetime" duration**: Claims unlimited profit forever from a one-time investment
3. **Referral pyramid**: 13% of deposits + 50% of withdrawals as referral commission
4. **Fake social proof**: 15 hardcoded testimonials with fabricated names and amounts
5. **Fake live activity**: Dashboard shows randomly generated fake transactions
6. **No real product**: The "task" is watching a 10-second progress bar + Islamic quote
7. **Manual admin control**: All deposits and withdrawals require manual admin approval
8. **User banning**: `/banned` route with `noindex` tag - users can be silently banned
9. **Religious exploitation**: Using "Islamic" and "Halal" branding to build trust
10. **False government claims**: "FBR Verified" / "Government verified platform" with no evidence

### Technical Observations
- **No malware detected**: No eval(), no obfuscation, no cryptomining, no data exfiltration
- **Standard tech stack**: React + Supabase + Tailwind - legitimate technologies
- **AI-generated code**: Built entirely on Lovable.dev (GPT-Engineer), an AI code generation platform
- **Client-side auth weakness**: Login state stored as simple localStorage flag (`iae_logged_in`)
- **Ban polling**: Dashboard checks ban status every 15 seconds via API

### Data Collection
- Username, phone number (+92 Pakistan), password
- WhatsApp number (during deposits)
- Payment screenshots (base64 encoded)
- Transaction IDs
- Browser analytics (Tinybird + Lovable telemetry)
- Session replay capability (via rrweb in Lovable SDK)

---

## 9. Application Routes (16 total)

```
/                    Landing page (marketing + fake testimonials)
/login               User login
/register            User registration
/dashboard           User dashboard with fake live activity
/deposit             Buy VIP packages
/deposit-history     View deposit history
/withdraw            Withdraw balance
/withdrawal-history  View withdrawal history
/balance-history     Balance history
/plan-list           Investment plans listing
/vip-packages        VIP package details
/complete-task       Daily ad watching (10s timer + Islamic quote)
/invite              Referral/invitation system with QR codes
/promo-code          Promotional code entry
/offer-apply         Special offer application
/banned              Account banned page (noindex, nofollow)
/admin               Admin control panel
```

---

## 10. Conclusion

This website is a **classic investment/Ponzi scheme** disguised as an Islamic "halal earning platform." Key characteristics:

- Users invest real money (PKR 150 - 76,800) to "buy packages"
- They allegedly "earn" 26-40% daily returns by watching a 10-second loading bar
- They recruit others for 13% deposit commissions + 50% withdrawal commissions
- All payouts are manually controlled by the admin (who can ban users at will)
- Social proof is entirely fabricated (hardcoded fake reviews and fake live activity)
- The "FBR Verified" claim is unverifiable
- The mathematics of 30%+ daily returns are unsustainable without new investor money

From a technical standpoint, the code contains no malware, viruses, or traditional security exploits. It is a straightforward React SPA with Supabase backend, built using AI code generation (Lovable.dev). The fraud is in the business model, not the code itself.
