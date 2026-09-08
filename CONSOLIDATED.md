# Hanzi — Consolidated build

**Version:** `CONSOLIDATED 1.0.0`

**Branch:** `clean-consolidation`

This branch is a controlled consolidation of the Hanzi app. The production `main` app is the fallback and must not be modified while the consolidated build is being validated.

## Runtime architecture

The consolidated runtime intentionally loads only:

1. `core.html` — shell, dataset, persisted state and base helpers.
2. `consolidated.css` — all consolidated visual/interaction styling.
3. `consolidated-app.js` — the single owner of lesson paging, focused-card navigation, recall, quiz flow, Connect the Three and shared writing behavior.

The following legacy interaction layers are **not loaded** in this build: `patch.js`, `ui-fix.js`, `learning-flow.js`, `stroke-ui.js`, `stroke-engine-v8.js`, `polish-v9.js`, `related-compact-v12.js`, `sentence-quality-v15.js`, `app-v26.js`, `interaction-v29.js`, `quiz-practice-v30.js`, `lesson-ux-v32.js`.

## Safety rules

- Preserve the existing `hanzi_v1_state` persistence contract.
- Never reorder or replace the 12-character lesson because progress changes during a swipe/focus session.
- One controller owns each gesture surface.
- Writing surfaces stop navigation gestures; navigation never owns writing input.
- Lesson paging has exactly two bounded pages of six.
- Focus paging uses the actual six-character set passed at open time; no global inferred learn count.
- Card practice and quiz writing use the same writer factory.
- No new patch files are to be added to solve consolidated bugs; fix the owner in `consolidated-app.js` or `consolidated.css`.
- Do not merge to `main` until the interaction test matrix passes on the user's iPhone.

## Required validation before merge

- Lesson page 1 → page 2 → page 1 repeatedly.
- Edge swipes on page 1 and page 2.
- Open each of the six cards from both lesson pages.
- Swipe left/right from focus positions 1 through 6.
- Tap and swipe beginning on main recall and sentence areas.
- Cycle all three sentences.
- Complete Connect the Three without duplicate Hanzi.
- Write horizontal, vertical, diagonal and hooked strokes without focus navigation.
- Complete writing without an extra tap between correct strokes.
- Finish the quiz without completing writing.
- Verify Explore interiors are identical and only borders carry state colors.
- Verify light and dark appearance.
- Close/reopen focus repeatedly.
- Confirm progress persists after reload.
