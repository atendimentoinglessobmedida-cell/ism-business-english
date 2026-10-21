# ISM Business: cross-section consistency audit

Date: 2026-10-21

## Scope
Reviewed all 24 HTML entry points and the nine main internal sections: home, journey, practice, smartreview, businessmode, simulate, toolkit, support and premium. Includes complete lessons, level pathways, practice and conversation labs, Skills Studio, listening, Ideas Lab, first steps, teacher/contact, plans, installation, credits and review entry points.

## Findings and corrections
The conversation lab and student guide did not share the Business theme. Legacy practice and skill panels still had hardcoded dark surfaces with dark text. Pricing had remaining dark summary blocks and pale package text. Course modules, home panels, audio help and update notices retained incompatible foreground colors. Selected navigation used inconsistent state classes.

Added business-standard.css as the final theme on all entry points. Shared light surfaces, blue primary actions, yellow accents, input appearance, type scale, focus indicators and active navigation now cover the legacy surfaces. Added shared button geometry to pages missing it. Added keyboard skip links to the conversation lab and first steps. Bounded the desktop lesson outline. Updated browser theme metadata and PWA cache v93. Existing authentication, prices, lesson IDs, answers, scores and completion rules were not changed.

## Validation
Full static QA passed, including functional/access/persistence/content regressions and a new 24-page theme inclusion check. Browser inspected all 24 entries and nine internal sections. No broken loaded image or horizontal overflow was detected on desktop. All 24 entries passed overflow checks at viewport settings 320, 390 and 768; 320 was repeated after final fixes. Contrast sampling of rendered leaf text with solid backgrounds across those pages and sections reported no remaining failures after corrections. The audit deliberately skips gradient backgrounds and is not a full accessibility certification.

## Limits
Protected Premium content was reviewed at its accessible entry surface and in source; this was not an authenticated traversal of every protected lesson or exercise state. Device audio quality, microphone permissions, physical device installation and complete pedagogical content were not revalidated by this visual update. The six-section learning path applies to the twelve complete lessons; specialist labs retain their activity-specific structure with the shared visual system.

Browser evidence: outputs/business-standard-browser-audit-2026-10-21.json. Static QA log: outputs/business-standard-qa-2026-10-21.log.
