# Etapa 2 — P1 integration QA

Validated on 2026-09-10 against the live public content/pathway/simulations endpoints, using an isolated Edge browser context at 390×844 and 1280×900.

## Changes

- Main Premium P1 card opens `interview.html`; return opens the Premium tab.
- Ten stage cards show completed units, status, and accessible progress bars. Overall progress is the average of the ten stages.
- Guided conversations include each opening followed by every endpoint turn (3, 4, 3, 3 questions).
- Legacy simulation strings remain opening answers. All questions must have saved, nonblank answers for completion.
- Drafts save while typing; conversations resume and allow editing earlier responses without dropping later answers.
- Premium uses the existing `ismbe:premium:p1:v1` storage key. Core storage and learning logic were not changed.
- Premium inline handler arguments are HTML-escaped so lesson navigation and audio buttons work with quoted strings.

## Passed checks

- JavaScript syntax and Git whitespace checks.
- P1 card navigation, return to Premium tab, and ten stage cards.
- Empty diagnostic remains 0/8; partial lessons show partial progress.
- Legacy answer retained, draft recovered after reload, blank submission disabled, earlier answer editable, subsequent answers retained.
- All thirteen simulation responses saved; stage 8 reaches 4/4 and completed styling.
- Premium module → lesson → audio handler → complete lesson → module navigation.
- Core home, journey, practice, simulations, toolkit, and Premium panel navigation smoke check.
- Core `ismbe:v9` value is byte-for-byte unchanged throughout Premium exercises and return navigation.
- Failed simulation request shows retry; recovery preserves saved progress.
- No uncaught browser JavaScript errors on tested successful flows; desktop overflow check and mobile visual inspection passed.

## Limits

- Progress is browser-local, with no cross-device synchronization.
- These are scripted guided conversations, not adaptive AI interviews or validated language/hiring assessments.
- Audio button execution was checked; audible quality and pronunciation scoring were not tested.
- Core navigation received a smoke check; all 98 lessons and every Core exercise were not re-certified.
- Testing targets the static GitHub Pages application. The separate bundled Next.js build pipeline was not run.
