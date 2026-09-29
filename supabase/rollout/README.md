# Legacy closure — deployed and verified 2026-09-29

The user authorized completing the rollout after frontend publication. All five protected handlers were deployed in sequence and verified remotely: direct anonymous requests returned 401; the existing authenticated gateway returned 200 with byte-identical JSON to the pre-rollout responses and no-store headers. A synthetic account was used, then canceled and its code rotated. Suspension and expiry each rejected the existing signed session with 401; Core remained 200.

Deployed versions: ism-interview-content v3, ism-interview-lab v3, ism-interview-pathway v2, ism-premium-content v4, ism-premium-simulations v2. Original versions and hashes in the manifest remain rollback metadata. This verifies endpoint authorization, not certification on physical Android/iOS devices.

The five `candidate/<slug>/index.ts` files explicitly call `gatewayOnly` as the first operation in the actual `Deno.serve` request callback. No handler monkeypatch is used. Anonymous and public-key requests receive401. Only the backend gateway's service credential is accepted; the credential is read from Supabase environment and is never written here. CORS preflight remains available. Successful content responses are private/no-store.

`manifest.json` records the captured deployment version and bundle SHA for each rollback snapshot. `original/` contains the actual captured source, not a reconstruction. The guard resides in `_shared/gateway-only.mjs`.

## Activation

First publish and verify the client which routes all Premium API traffic through `ism-premium-gateway`. Only after release QA is satisfied, deploy each candidate with its relative helper. With the Supabase MCP deployment tool, use entrypoint `candidate/<slug>/index.ts`, include that file and `_shared/gateway-only.mjs`, and preserve `verify_jwt: false`: the function performs its own explicit backend credential authentication. Do not put the service credential in deployment arguments.

Before deployment, compare current function version/SHA with manifest. If changed, refresh snapshots and reapply the guard to the latest content. Run `node scripts/legacy-access-rollout-check.mjs` before each rollout. After each deployment verify direct anonymous URL401 and client→gateway→upstream200 using a synthetic account. Verify suspended/expired accounts denied by gateway and Core still works.

## Rollback

If protected client access fails, restore the corresponding `original/<slug>/index.ts` using its captured configuration. This temporarily restores public access and must be reported as such. Do not use rollback as evidence that protection passed. Repair and re-test the candidate before activating again.

## Tests

The regression runner evaluates each real candidate callback using Node's TypeScript stripping and supplies only a synthetic secret. For all five functions it confirms anonymous401, wrong credential401, OPTIONS204, authorized200, no-store, and JSON equality against the captured original. Missing server secret503 and unsupported authenticated method405 are also checked. These local checks complement the remote rollout verification recorded above.
