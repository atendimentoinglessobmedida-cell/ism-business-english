# Global alignment recovery — second pass

Base: PR #7, `global-text-alignment-recovery`, `7bcc8b381c1d8c8468722f1fa76e3151698d41df`.

## Changes

- `premium-ux.css`: removed late global overrides that shrank main padding, headings, muted copy, tabs and the mobile Home grid.
- `completion-hardening.css`: removed the competing two-column Home rule at 375px and the 12px heading override.
- `layout.css`: fixed the bilingual adjacent selector, enabled wrapping tab labels, aligned Home flex contents to the reading column and released the lesson image's fixed HTML height on mobile.
- `experience.css`: made nested learning grids shrinkable, wrapped progress headings, restored readable Home descriptions and corrected professional-theme Home card contrast.
- `speaking-experience.css`: responsive rubric columns, wrapping history/score rows, readable rubric descriptions and theme-consistent surfaces.
- `my-business-english.css`: wrapping evidence grids, two-column metrics on mobile, heading clearance for the close button and readable modal surfaces.
- `real-business.css`: wrapping headings/metadata, readable scenario/answer text and theme-consistent scenario surfaces.
- `shared-learning-ui.css`: separate English titles and Portuguese descriptions in lesson links, wrapping sticky controls, safe-area bottom padding and shared backup surface tokens.
- `premium-shell.css`: shrinkable navigation/summary columns, wrapping labels and readable mobile navigation.
- `index.html`: read-only `window.state` getter exposes the live Core state to specialist modules, including after asynchronous hydration. Browser testing found an existing Real Business exception and missing specialist evidence caused by the previous lexical-only state.
- `scripts/alignment-browser-check.cjs`: reusable browser regression for layout, live state, persisted evidence, Speaking and modal controls.

## Validation

- Initial GitHub Actions staging run 36553540091: successful.
- All ten existing static/functional suites passed: published-functional, core-resume, persistence-resume, release-e2e, product-completion, market-benchmark, visual-learning, Premium schema, authentic-listening and regional-audio.
- JavaScript syntax checks and `git diff --check` passed.
- Edge/Chromium responsive scan: 12 routes at 320, 390, 768 and 1280px (48 combinations), no page errors or viewport overflow after state fix. The intentional horizontally scrollable Coach goal list is excluded from viewport-overflow assertions.
- A separate browser regression passes at all four widths: six Core panels, Real Business correct answer and reload persistence, Speaking render, My Business English modal open/close and close-button clearance.
- Live network checks loaded Core lesson 1.1, Professional Emails and the Premium hub. Simulation progression, text submission and feedback passed. No uncaught errors.
- Visual review of mobile Home, Core lesson, Professional Emails, Speaking and modal captures; desktop Home/Toolkit/Premium captures are retained with the QA artifacts.

## Limits and release decision

- Browser emulation is not physical Android/iOS testing. Microphone recording and real-device PWA installation are not certified by this pass.
- Vercel previews were already failing on the base commit. The connected Vercel account returned 403 for team `equipesonar-1862`, so their logs/build failure cause could not be inspected. The static Pages app was tested locally with live content APIs; a Next.js build is not certified (this branch has package scripts referring to absent app/build files).
- PWA cache remains v65: the existing worker fetches same-origin assets network-first and caches successful responses. No asset paths or offline schema changed; a cache reset is unnecessary for this CSS/state correction. Offline-only clients retain their previous assets until reconnecting.
- Keep PR #7 in Draft without merge/deployment while hosted preview access and physical-device QA remain outstanding.

## Reproduce the browser regression

Provide Playwright outside production dependencies, then run `node scripts/alignment-browser-check.cjs`. Optional environment variables: `ISM_PLAYWRIGHT_MODULE` (module path), `ISM_BROWSER_CHANNEL` (for example `msedge`). The script serves its own temporary local HTTP endpoint and uses isolated browser storage.
