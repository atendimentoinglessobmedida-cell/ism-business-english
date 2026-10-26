# Premium access rollout

## Implemented and verified

`ism-premium-gateway` is an isolated Supabase function. POST `/session` requires matching email and access code, applies the existing database rate limiter, and issues a signed 30 minute bearer session bounded by the license expiry. It accepts both historical code hashing formats. Every GET `/asset`, `/api` and `/status` verifies the signature and reads the current student access status/expiry from the database. Failures deny access; no license information or service key is returned to the client. Responses are private/no-store. Session tokens stay in sessionStorage, never in URLs or local progress records.

The client loads the five authored content scripts through authenticated Blob URLs in original order and routes Premium API calls through the gateway. Public rendering code remains static. The PWA v66 upgrade deletes old mixed API caches, keeps Core responses in a separate cache and never caches Premium APIs or the gateway. Progress storage is preserved.

Live checks on 2026-09-29 used a temporary synthetic account: login200, private asset200, anonymous asset401, authorized upstream API200, suspended license401, expired license401. The account was deleted and its absence verified. Unit tests additionally cover token tampering, wrong key, deleted account, invalid dates and database failure. This does not certify physical devices or every browser UI flow.

## Safe activation sequence and outstanding boundary

1. Run `node scripts/package-premium.mjs` after content changes and deploy the generated JSON with the gateway. This file is backend-only and must never enter `dist`.
2. Build static output excluding the private content scripts. Every Premium entry page must load `premium-access.js` before existing API requests. Replace the authored script sequence with `ISMPremiumAccess.loadScripts` preserving order. Validate anonymous, active, expired and offline UI plus existing progress.
3. Publish the approved client before changing existing content endpoints. During transition the old endpoints remain public to avoid breaking the still-public production app. **The transition therefore does not constitute complete Premium enforcement.**
4. Add the same server session verification (or trusted server credential authentication for gateway-only access) to `ism-premium-content`, `ism-premium-simulations`, `ism-interview-content`, `ism-interview-lab` and `ism-interview-pathway`; verify every direct legacy URL returns401 without credentials. Then verify the deployed client through the gateway. Core endpoints remain free.
5. Keep the public repository/history limitation explicit: previously public lessons and files may already have been copied. Expiry governs future protected retrieval; it cannot revoke downloaded knowledge or historical Git copies. For future proprietary content, author it only in private backend storage/repository, not this public Git history.

Do not claim the license is fully enforced until direct legacy endpoints have been closed and public production uses the approved client. Gateway deployment alone does not meet that criterion.
