# ISM Business English — Product Completion Audit

Date: 2026-09-27
Branch audited: `ux-learning-upgrade`
Baseline: CI green at `34df92074e85d443a8cb60e22884d0d7e209e6cd`.

## Executive diagnosis

The app has moved beyond MVP: it already has a coherent Core/Premium learning system, adaptive Coach, Smart Review 2.0, Speaking Experience, My Business English, Real Business English, PWA/offline support and guarded persistence. The remaining work is primarily product completion rather than feature accumulation.

The largest remaining gaps are: physical-device media QA, end-to-end browser journey certification on the current upgrade, cross-device continuity, stronger speaking evidence/feedback, complete editorial QA, accessibility certification, and final release/observability safeguards.

## Evidence-based scorecard

| Area | Score | Evidence / gap |
|---|---:|---|
| UX general | 8.5 | Premium visual consolidation and reduced density exist; current upgrade still needs full browser journey certification. |
| UI consistency | 8.7 | Shared shells/styles plus Premium UX; visual regression matrix is not yet automated. |
| Onboarding | 8.0 | Goals and adaptive Coach exist; first-session comprehension/conversion needs final usability validation. |
| Navigation | 8.5 | Core paths are established; regression on all secondary pages still needs current-build browser pass. |
| Journey clarity | 8.6 | Coach, continue learning, review and journey surfaces reinforce next action. |
| Mobile | 8.0 | Prior 390x844 check passed; full 320/360/375/390/412/430 matrix is outstanding. |
| Accessibility | 7.8 | Reduced-motion support exists; full keyboard, focus, ARIA and screen-reader audit is outstanding. |
| Pedagogy | 9.0 | Strong practice/retry/completion contracts and professional scenarios; editorial consistency still needs a final pass. |
| Progression | 8.8 | Stars, completion, Coach and review are integrated; cross-device continuity is absent. |
| Speaking | 8.2 | Speaking evidence and retry flow exist; microphone/recognition and objective proficiency validation are not certified. |
| Listening | 8.4 | Multi-pass authentic listening exists; physical playback and custom accent recordings remain outstanding. |
| Vocabulary | 8.3 | Integrated across lessons/toolkit; systematic corpus/editorial audit is outstanding. |
| Spaced review | 9.0 | Smart Review 2.0 and review history are present. |
| Feedback | 8.7 | Retry and explanatory feedback are established; speaking feedback can become more diagnostic. |
| Simulations | 8.8 | Guided and Real Business scenarios are present; broader scenario depth can follow only after release hardening. |
| Personalization | 8.7 | Coach uses learner state/goals; recommendations should be verified against real learner histories. |
| Gamification | 8.4 | XP/stars/progress exist without dominating pedagogy. |
| Motivation | 8.5 | Coach and visible progress provide direction; needs real-user validation. |
| Business English content | 9.0 | Meetings/presentations plus professional extensions are substantial. |
| Professional utility | 9.0 | Builders, simulations and authentic situations provide transfer to work. |
| Persistence | 9.2 | localStorage + IndexedDB fallback + snapshots + backup/restore + hydration contracts. |
| Resume | 9.1 | Automated resume contract is green; real-browser interruption scenarios still need certification. |
| Offline/PWA | 8.8 | Service-worker shell/API caching exists; offline upgrade edge cases need browser/device testing. |
| Performance | 8.2 | Static architecture is lightweight; no current performance-budget/Lighthouse gate. |
| Stability | 9.0 | Current CI is green; browser E2E remains the missing release gate. |
| Premium perception | 8.8 | Visual Premium layer and coherent learning surfaces exist; final device polish remains. |

## Priorities

### P0 — release blockers

1. **Current-build browser E2E certification**: first access → goal → Home → lesson → exercise → speaking → completion → close/reload → continue → Smart Review → Coach → Real Business → Toolkit/My Business English.
2. **Physical Android/iOS media certification**: TTS audible quality, microphone permission/recording, background/visibility interruption, replay and slow playback.
3. **Persistence interruption matrix**: refresh, tab close, offline restart, storage fallback, malformed state recovery and app update.
4. **Release gate**: prevent promotion when browser E2E or critical persistence checks fail.

### P1 — high-impact completion

1. Accessibility pass: keyboard, focus visibility/order, labels/ARIA, modal focus trapping, touch targets, contrast, reduced motion and screen-reader landmarks.
2. Mobile matrix: 320/360/375/390/412/430 px; no horizontal overflow; keyboard/modal/audio/recording checks.
3. Speaking quality: explicit Try → Listen back → self/diagnostic feedback → Retry → improvement evidence; preserve attempts without bloating storage.
4. Editorial QA across Core/Premium: naturalness, distractor quality, EN/PT accuracy, level consistency, professional realism and duplicate content.
5. Error-state UX: offline/API/audio/microphone/storage failures must explain recovery without losing progress.
6. Performance budget: page weight, startup, long tasks and service-worker cache versioning.

### P2 — product-strengthening

1. Optional authenticated cross-device sync while keeping local-first recovery.
2. Richer learner evidence in My Business English: strongest productions, recurring language patterns and improvement history.
3. Coach explanation quality based on real learner histories and confidence thresholds.
4. Expand Real Business scenarios only after P0/P1 are green.
5. Add visual regression snapshots for core mobile/desktop surfaces.

### P3 — polish

1. Microcopy harmonization.
2. Fine spacing/animation tuning.
3. Additional achievement variety only where pedagogically meaningful.
4. Optional richer audio library/custom recordings.

## Implementation packages

1. **Release E2E Gate** — browser journey, resume/offline interruption, critical console-error checks.
2. **Device & Media Certification** — Android/iOS TTS and microphone checklist with pass/fail evidence.
3. **Accessibility & Mobile Hardening** — WCAG-oriented interaction pass + six viewport matrix.
4. **Speaking Completion** — retry/evidence/feedback refinements.
5. **Editorial & Learning QA** — systematic content and distractor review.
6. **Reliability & Error Recovery** — user-facing recovery states and corrupted-storage scenarios.
7. **Performance & PWA** — measurable budgets, cache/update validation.
8. **Cross-device Continuity** — only after local-first release is certified.
9. **Final Product Polish** — microcopy, visual regression, remaining P2/P3 items.

## Regression risks

- Core (`ismbe:v9`) and Premium (`ismbe:premium:p1:v1`) must not overwrite one another.
- XP/stars must not be double-counted by Premium or retries.
- Smart Review history and Speaking evidence must survive hydration and update cycles.
- Service-worker cache changes must not strand users on mixed JS/CSS versions.
- Media improvements must not trigger autoplay or break browsers without MediaRecorder/TTS.
- Accessibility changes must not alter existing completion logic.
- Cross-device sync, if added, must never replace a newer local state with stale remote data silently.

## Definition of final release

The app is release-ready only when automated CI is green **and** the P0 browser/device matrix has documented passes. No new major feature should be added before that gate is achieved.

## Immediate execution decision

Start Package 1: **Release E2E Gate**. Do not merge/publish the upgrade merely because static CI is green. First create a repeatable browser-level release contract covering navigation, completion, persistence/resume and critical integration surfaces. After Package 1 is green, proceed to physical-device media certification.