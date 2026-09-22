# Stabilization and learning interface — 2026-09-10

Based on branch github-pages-preview at f60b2b4cc2cb9c9ddbc708937d3b38644c9bfaf5.

## Changes

- Restored ism-interview-lab: its mock object used `feedback=` instead of `feedback:`. Fixed the syntax and deployed version 2, retaining existing public access configuration. Profile, STAR and mock sections each returned HTTP 200 with their expected data after deployment.
- Added professor page, contact section and explanation of Core stars; linked from Core and Premium. Direct contact address has not been supplied, so no telephone number or email has been invented.
- Four Core phases use collapsible module lists, per-phase lesson totals and earned stars. Homepage quick expressions are collapsible. Existing navy/cyan identity retained, with gold stars and reduced visual density.
- Core completion now requires all activities, speaking confirmation and at least 70%. Existing achievements and best-score history remain intact. Retry is immediately available after answering; visible score/stars update immediately.
- Core/listening and Premium choice positions are rotated without changing the correct answer. This mitigates positional clues; editorial quality of distractors remains a separate task.
- Premium lessons require a correct practice answer and speaking confirmation; explanatory feedback appears after an attempt. Existing completed lessons remain recorded.
- Full mock saves drafts and requires all 11 answers. An old empty completion flag no longer counts toward stage progress. Premium remains in `ismbe:premium:p1:v1`; Core remains in `ismbe:v9`.
- Failed Premium activity loads show retry and return controls without clearing saved state.
- Marketing now states 30 available P1 lessons and seven planned tracks, rather than advertising 86 available extras.

## Verification

- JavaScript syntax validation for all changed pages and scripts.
- Local handler execution for all three Lab sections; live 200 responses confirmed.
- Programmatic answer-identity check across 98 sample lesson IDs; listening correct choice occupies all three positions.
- Programmatic blank/full mock validation.
- Browser: homepage, phase expansion, Core module and lesson loads; two wrong answers plus speaking cannot complete a Core lesson.
- Browser: P1 profile and STAR editor open with backend data; blank mock blocked with 11 fields; draft survives reload.
- Browser: P1 lesson cannot complete before practice; correct answer plus speaking confirmation completes it. Core XP/stars unchanged by Premium activity.
- Browser: all four guided simulations still listed with 3/4/3/3 questions.
- Professor navigation and mobile screenshot at 390 × 844; no horizontal page overflow on mobile homepage. Desktop homepage visually inspected.

## Limits

- Travel reference site requires a registered login; internal professor/contact/game screens were inaccessible. Adaptation follows user-specified ideas and supplied artwork, not a claim of an exact reproduction.
- Contact section is present; a direct WhatsApp/email button awaits the user's professional contact details.
- Android physical device, audible TTS quality and microphone behavior remain unverified.
- No comprehensive editorial rewrite or validation of speech proficiency. Progress remains local to the browser; no cross-device sync added.
