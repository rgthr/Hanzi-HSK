# Hanzi — Consolidated build

**Version:** `CONSOLIDATED 2.0.0 — PARITY CLEAN SHELL`

**Branch:** `clean-consolidation`

The production `main` app remains the fallback. The consolidated branch is required to preserve the intended product behavior of main while removing the technical causes of the recurring six-card, swipe and writing regressions.

## Runtime architecture

The consolidated runtime is now independent from `core.html` and every legacy interaction patch. It contains only:

1. `consolidated-shell.html` — the explicit product surface. No hidden legacy controls.
2. `consolidated-state.js` — HSK dataset loading, the existing `hanzi_v1_state` persistence contract, mastery, theme and audio state.
3. `consolidated.css` — all visual styling.
4. `consolidated-app.js` — the single controller for lesson paging, focus paging, recall, quizzes, Connect the Three and both writing surfaces.

Legacy files remain in git for fallback/history but are not runtime dependencies of the consolidated build.

## Product parity contract

The consolidated build intentionally preserves the current intended main experience:

- Learn / Progress / Explore navigation.
- HSK 1 progression in 12-character lessons.
- Exactly six equal cards visible at once, with two bounded lesson pages.
- No `New mix` feature.
- Adaptive `Continue learning`, introducing unseen characters while carrying learning/review characters.
- Clicking any lesson card opens that exact six-card page at the clicked position.
- Focused character cards with Hanzi hero, blurred pinyin + meaning recall, audio, key context, exactly three sentence examples, related shapes and stroke-order practice.
- Sentence Chinese remains visible; pinyin + English are blurred until tapped and reset when the example changes.
- Six-question test after a six-card learning set: four recall questions, Connect the Three with six characters, then embedded writing.
- Quiz answers reveal Hanzi + pinyin + meaning.
- Writing quiz opens directly and always exposes `Finish quiz`.
- Explore: All / Unseen / Learning / Mastered / Needs work with neutral/blue/green/pink state borders and identical tile interiors.
- Settings: System / Light / Dark appearance, audio on/off, explicit consolidated version.
- Swipe down closes focus, except writing input owns its touch surface.
- Existing progress survives because `hanzi_v1_state` and `hanzi_hsk1_dataset_v1` are unchanged.

## Technical invariants

- The lesson board DOM has only the six currently visible `.tile` children. It is never a 200%-wide track, nested grid page or native scroll-snap container.
- Lesson swipes replace those six children only after a committed horizontal gesture.
- Lesson paging is bounded: page 1 cannot go right; page 2 cannot go left beyond the lesson.
- Focus has exactly one transform track and one gesture controller.
- A capture-phase click guard suppresses the synthetic click following a swipe so recall/sentence taps do not fire accidentally.
- Writing surfaces stop event propagation before the focus pager can interpret handwriting as navigation.
- Card writing and quiz writing use the same `createWriter()` implementation.
- Correct strokes are not followed by custom `animateStroke()` calls; Hanzi Writer owns progression to the next expected stroke.
- Randomization uses Fisher–Yates rather than `sort(() => Math.random() - .5)`.
- No new patch files are permitted for consolidated bugs. Fix the owning function or stylesheet.

## Required validation before merge

- Lesson page 1 → page 2 → page 1 repeatedly.
- Edge swipes on page 1 and page 2.
- Verify exactly six cards remain visible after every swipe and after progress updates.
- Open each of the six cards from both lesson pages and confirm the clicked starting position.
- Swipe left/right from focus positions 1 through 6.
- Tap and swipe beginning on main recall and sentence areas; swipes must not reveal content.
- Cycle all three sentences and verify reveal resets.
- Complete all four recall question types and inspect answer reveal.
- Complete Connect the Three with six unique Hanzi.
- Write horizontal, vertical, diagonal and hooked strokes without focus navigation.
- Complete multiple consecutive correct strokes without an extra tap.
- Finish the quiz without completing writing.
- Open regular stroke practice, Watch, Start over, then write.
- Verify Explore search, all five filters and state colors in light/dark appearance.
- Close/reopen focus repeatedly and use swipe-down close.
- Reload and confirm progress/settings persist.

Nothing from this branch is merged to `main` until this matrix passes on-device.