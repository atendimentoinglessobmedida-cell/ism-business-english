# ISM Business Growth — decisions
1. Keep current published application untouched; all work on isolated branch.
2. Reuse existing business-practice-content.js lesson IDs and Interview Lab rather than duplicate their content.
3. Store curriculum and rubric utilities separately to allow safe integration after authentication and production parity checks.
4. Do not treat the existing rule-based adaptive-coach.js as a generative Speaking Coach.
5. Do not persist student metrics locally for HR reporting; future B2B records require authenticated server storage, row-level authorization and consent/privacy notices.
6. Regular/Premium coach time quotas remain 15/30 minutes per day and 450/900 per 30-day cycle, subject to backend enforcement; not implemented here.
7. No payments, production routes, existing lesson records or Supabase schemas changed.
