# GRYFFINDOR OS — Design Engineering Craft Protocol

> Drop this file in `docs/GRYFFINDOR_CRAFT_PROTOCOL.md` and refer to it from the project's existing `AGENTS.md` or Antigravity project instructions. This complements, rather than replaces, the application's feature, security, and data-integrity requirements.

## Scope & source

Reference the upstream **emilkowalski/skills** repository: https://github.com/emilkowalski/skills . The repository contains 18 skill directories and is MIT licensed; retain its license and attribution when redistributing substantial copied materials. Before treating any local skills as installed, inspect `.agents/skills/emilkowalski/` and verify each `SKILL.md` can be read.

## Core rules

1. **Functionality first.** A visually perfect control must still call a real operation, provide errors and loading feedback, persist data, enforce authorization, and sync to other signed-in devices where specified.
2. **Make frequent actions instantaneous.** No entrance/exit animations on the command palette (`⌘K`/`Ctrl+K`), frequent navigation, bulk task edits, or repeatedly opened work views. Rare celebrations may have subtle motion.
3. **Motion must have a reason.** For occasional dialogs, toasts, drawers, and onboarding, use purposeful motion, ease-out entrances, physical transform origins, interruptible transitions, and reduced-motion alternatives. Avoid `transition: all`, `scale(0)` entrances, and excessive stagger.
4. **Keep animations cheap.** Favor `transform` and `opacity`; diagnose frame drops before applying `will-change`; avoid React state updates on every drag frame.
5. **Do not globally overwrite transforms.** The reported `button:active { transform: scale(.975) }` is a useful starting point but may break components with translation, drag or custom transforms. Apply tactile press selectively to a class or composed motion value, and verify focus/disabled states.
6. **Real device behavior matters.** Avoid sticky touch hover, use capability media queries, preserve browser zoom, use >=16px inputs on iPhone, account for safe areas, and test on real Safari/iPhone plus Mac and Windows browsers.
7. **Numeric layout stability.** Use tabular numerals on timers, attendance clocks, reports, currency, dashboards, and market prices.
8. **Adversarial UI testing.** Exercise long names, empty states, offline states, duplicate updates, revoked access, slow networks, right-to-left/non-Latin text where relevant, tiny and huge numbers, and expired sessions.
9. **Accessibility is a gate.** Keyboard and screen-reader access, visible focus, adequate contrast under all adaptive theme overrides, reduced motion, and non-drag interaction alternatives.
10. **No hidden monitoring.** Device, status, attendance, and app activity remain distinct concepts. Device telemetry is opt-in, platform-constrained, and private unless explicitly shared.

## Skill routing — which to invoke when

| Situation | Consult these local skills |
| --- | --- |
| Overall craft review | `emil-design-eng` |
| Hero / Atrium entrance / narrative | `find-animation-opportunities`, `choreograph`, `animate` |
| Frequent navigation, command palette, tables | `remove-animations`, `review-animations` |
| Slow / dropped-frame UI | `animation-performance`, `improve-animations` |
| Bottom sheets, swipes, drags | `gestures`, `pick-ui-library` |
| iPhone Safari / PWA issues | `mobile-native`, `break-ui` |
| Dashboard and real-time timers | `animation-performance`, `break-ui` |
| Choosing toasts | `ask-sonner`, `pick-ui-library` |
| Comparing visual approaches | `prototype` |
| Native iOS / Expo future apps | `write-swift`, `animate-expo` where applicable |

Read the specific skill before using it; don't apply all 18 indiscriminately or copy skill text into production bundles.

## Gryffindor-specific application

- **Public portfolio / 17 Worlds / Atrium:** Reserve expressive, spatially coherent interactions here. Defer nonessential 3D on low-powered devices and offer reduced-motion/static alternatives.
- **Private Life & Work OS:** Prioritize speed and clarity. Opening Tasks, Clock In/Out, Notes, Calendar, Command Palette and search should feel immediate.
- **Attendance and finance:** Use tabular numbers and preserve steady dimensions; do not animate counts continuously on data refresh.
- **Task assignment:** Use accessible dialogs and permission-aware assignees, optimistic updates only where rollback is correct, real server validation, and visible sync/error feedback.
- **Adaptive Theme Studio:** Apply theme tokens at global, page, module, component and element levels with predictable precedence; preview contrast; avoid flash-of-unstyled-theme; save preferences and synchronize appropriately.
- **Cross-device sync:** Avoid unnecessary animation when live messages, tasks or timers arrive; do not shift users' focus unexpectedly.

## Safe implementation protocol

1. Read the existing source, dependencies and applicable local skill files first.
2. Produce a **Before | After | Why** audit table covering only observed issues.
3. Implement small cohesive changes, preserving work and avoiding unrelated refactors.
4. Run `npm run build` and available tests; if a script is absent, record that it was unavailable rather than implying success.
5. Verify interaction flows using browser tests on desktop and mobile viewport sizes; inspect keyboard use, reduced-motion, and overflow.
6. Run real-device tests for iPhone Safari and at least one Windows and macOS browser before declaring platform polish complete.
7. Record changed files, test commands/results, limitations, and a rollback path. Commit only when checks pass; never claim a specific SHA without inspecting Git history.

## Suggested acceptance checklist

- [ ] No dead links, empty click handlers, or nonfunctional controls
- [ ] No horizontal overflow at 320, 375, 390, 768, 1024, 1440 widths
- [ ] Command palette and high-frequency navigation respond without animation delay
- [ ] All dialogs, sheets, tooltips and toasts are keyboard-accessible
- [ ] Touch targets and iPhone safe areas verified on device
- [ ] Timers and currency figures have stable widths
- [ ] All animation honors reduced motion and is interruption-safe
- [ ] User-chosen theme colors remain legible in every affected component
- [ ] Core CRUD and task assignment persist and sync through authorized backend
- [ ] Private data cannot be seen by the other user without sharing
- [ ] Build, relevant unit/e2e tests and real-device manual checks recorded

## Note on current state

The project owner reports integration under `.agents/skills/emilkowalski/` and a successful local build on commit `0956cd8`. These are **reported, not independently verified** until the local repository files and Git history are inspected.
